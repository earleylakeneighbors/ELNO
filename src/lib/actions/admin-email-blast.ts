"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/actions/admin";
import { getSubscriberById } from "@/lib/data";
import {
  getEmailBlastBatchWithDeliveries,
  insertEmailBlastBatchWithDeliveries,
  listFailedDeliveriesForBatch,
  recomputeEmailBlastBatchCounts,
  updateEmailBlastDelivery,
} from "@/lib/data/email-blast-logs";
import type { AnnouncementBlastPreset } from "@/lib/email/announcement-presets";
import { getAnnouncementBlastContent } from "@/lib/email/announcement-presets";
import { sendAnnouncementToOne } from "@/lib/email/send-announcement-blast";
import type { Subscriber } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { announcementBlastSchema, retryEmailBlastSchema } from "@/lib/validations";

export type BlastDeliverySummary = {
  id?: string;
  email: string;
  name: string;
  status: "sent" | "failed";
  error?: string;
};

export type SendAnnouncementBlastResult = {
  batchId: string;
  sent: number;
  failed: number;
  deliveries: BlastDeliverySummary[];
};

type BlastInput = z.infer<typeof announcementBlastSchema>;

function displayName(s: Subscriber): string {
  return [s.first_name, s.last_name].filter(Boolean).join(" ") || s.email;
}

async function sendToSubscriber(input: {
  subscriber: Subscriber;
  subject: string;
  preset: AnnouncementBlastPreset;
  idempotencyKey: string;
}): Promise<{ status: "sent" | "failed"; error?: string; resendId?: string }> {
  const result = await sendAnnouncementToOne({
    to: input.subscriber.email,
    firstName: input.subscriber.first_name,
    subject: input.subject,
    preset: input.preset,
    idempotencyKey: input.idempotencyKey,
  });
  if (result.ok) {
    return { status: "sent", resendId: result.resendId };
  }
  return { status: "failed", error: result.error ?? "Send failed." };
}

export async function sendAnnouncementBlastAction(
  input: BlastInput,
): Promise<ActionResult<SendAnnouncementBlastResult>> {
  await requireAdmin();

  const parsed = announcementBlastSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      first.subscriber_ids?.[0] ??
      first.subject?.[0] ??
      parsed.error.issues[0]?.message ??
      "Invalid blast request.";
    return { success: false, error: msg };
  }

  const { subscriber_ids, subject, preset, send_token } = parsed.data;
  const uniqueIds = [...new Set(subscriber_ids)];

  const subscribers = await Promise.all(uniqueIds.map((id) => getSubscriberById(id)));
  const found = subscribers.filter((s): s is Subscriber => s !== null);

  if (found.length === 0) {
    return { success: false, error: "No matching subscribers were found." };
  }

  const withoutConsent = found.filter((s) => !s.consent);
  if (withoutConsent.length > 0) {
    return {
      success: false,
      error: `${withoutConsent.length} selected ${withoutConsent.length === 1 ? "person has" : "people have"} not given email consent. Remove them from the selection and try again.`,
    };
  }

  const content = getAnnouncementBlastContent(preset);
  const emailSubject = (subject?.trim() || content.defaultSubject).slice(0, 160);

  const deliverySummaries: BlastDeliverySummary[] = [];
  const deliveryInserts: Parameters<typeof insertEmailBlastBatchWithDeliveries>[0]["deliveries"] = [];

  let sent = 0;
  let failed = 0;

  for (const subscriber of found) {
    const outcome = await sendToSubscriber({
      subscriber,
      subject: emailSubject,
      preset,
      idempotencyKey: `announcement-blast/${preset}/${subscriber.id}/${send_token}`,
    });
    const name = displayName(subscriber);
    if (outcome.status === "sent") sent += 1;
    else failed += 1;

    deliverySummaries.push({
      email: subscriber.email,
      name,
      status: outcome.status,
      error: outcome.error,
    });
    deliveryInserts.push({
      subscriber_id: subscriber.id,
      email: subscriber.email,
      recipient_name: name,
      status: outcome.status,
      error_message: outcome.error ?? null,
      resend_id: outcome.resendId ?? null,
    });
  }

  let batchId = "";
  try {
    const saved = await insertEmailBlastBatchWithDeliveries({
      send_token,
      preset,
      subject: emailSubject,
      recipient_count: found.length,
      sent_count: sent,
      failed_count: failed,
      deliveries: deliveryInserts,
    });
    batchId = saved.id;
    deliverySummaries.forEach((summary, i) => {
      if (saved.deliveries[i]) summary.id = saved.deliveries[i].id;
    });
  } catch (err) {
    console.error("insertEmailBlastBatchWithDeliveries", err);
  }

  if (sent === 0) {
    return {
      success: false,
      error:
        failed > 0
          ? "Could not send any messages. Check the delivery log for reasons."
          : "No messages were sent.",
      data: batchId ? { batchId, sent, failed, deliveries: deliverySummaries } : undefined,
    };
  }

  const message =
    failed === 0
      ? sent === 1
        ? "Announcement sent to 1 neighbor."
        : `Announcement sent to ${sent} neighbors.`
      : `Sent ${sent} of ${found.length}. ${failed} failed — see the delivery log below.`;

  return {
    success: true,
    data: { batchId, sent, failed, deliveries: deliverySummaries },
    message,
  };
}

type RetryInput = z.infer<typeof retryEmailBlastSchema>;

export async function retryFailedBlastDeliveriesAction(
  input: RetryInput,
): Promise<ActionResult<SendAnnouncementBlastResult>> {
  await requireAdmin();

  const parsed = retryEmailBlastSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid retry request." };
  }

  const { batch_id, send_token } = parsed.data;

  const batch = await getEmailBlastBatchWithDeliveries(batch_id);
  if (!batch) {
    return { success: false, error: "Batch not found." };
  }

  const failedRows = await listFailedDeliveriesForBatch(batch_id);
  if (failedRows.length === 0) {
    return { success: false, error: "No failed deliveries to retry in this batch." };
  }

  const preset = batch.preset as AnnouncementBlastPreset;
  if (preset !== "library-dedication") {
    return { success: false, error: "Unsupported announcement preset." };
  }

  const deliverySummaries: BlastDeliverySummary[] = [];
  let sent = 0;
  let retriedFailed = 0;

  for (const row of failedRows) {
    if (!row.subscriber_id) {
      await updateEmailBlastDelivery(row.id, {
        status: "failed",
        error_message: "Subscriber record missing — cannot resend.",
        incrementRetry: true,
      });
      retriedFailed += 1;
      deliverySummaries.push({
        id: row.id,
        email: row.email,
        name: row.recipient_name,
        status: "failed",
        error: "Subscriber record missing — cannot resend.",
      });
      continue;
    }

    const subscriber = await getSubscriberById(row.subscriber_id);
    if (!subscriber) {
      await updateEmailBlastDelivery(row.id, {
        status: "failed",
        error_message: "Subscriber not found on the email list.",
        incrementRetry: true,
      });
      retriedFailed += 1;
      deliverySummaries.push({
        id: row.id,
        email: row.email,
        name: row.recipient_name,
        status: "failed",
        error: "Subscriber not found on the email list.",
      });
      continue;
    }

    if (!subscriber.consent) {
      await updateEmailBlastDelivery(row.id, {
        status: "failed",
        error_message: "Subscriber has not given email consent.",
        incrementRetry: true,
      });
      retriedFailed += 1;
      deliverySummaries.push({
        id: row.id,
        email: row.email,
        name: row.recipient_name,
        status: "failed",
        error: "Subscriber has not given email consent.",
      });
      continue;
    }

    const outcome = await sendToSubscriber({
      subscriber,
      subject: batch.subject,
      preset,
      idempotencyKey: `announcement-blast-retry/${preset}/${row.id}/${send_token}`,
    });

    await updateEmailBlastDelivery(row.id, {
      status: outcome.status,
      error_message: outcome.error ?? null,
      resend_id: outcome.resendId ?? null,
      incrementRetry: true,
    });

    if (outcome.status === "sent") sent += 1;
    else retriedFailed += 1;

    deliverySummaries.push({
      id: row.id,
      email: subscriber.email,
      name: displayName(subscriber),
      status: outcome.status,
      error: outcome.error,
    });
  }

  await recomputeEmailBlastBatchCounts(batch_id);

  if (sent === 0) {
    return {
      success: false,
      error: "Retry did not deliver any messages. See reasons in the log.",
      data: {
        batchId: batch_id,
        sent: 0,
        failed: retriedFailed,
        deliveries: deliverySummaries,
      },
    };
  }

  const message =
    retriedFailed === 0
      ? `Resent successfully to ${sent} ${sent === 1 ? "neighbor" : "neighbors"}.`
      : `Resent to ${sent}; ${retriedFailed} still failed.`;

  return {
    success: true,
    data: { batchId: batch_id, sent, failed: retriedFailed, deliveries: deliverySummaries },
    message,
  };
}