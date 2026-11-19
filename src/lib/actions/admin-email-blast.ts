"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/actions/admin";
import { getSubscriberById } from "@/lib/data";
import { getAnnouncementBlastContent } from "@/lib/email/announcement-presets";
import { sendAnnouncementToOne } from "@/lib/email/send-announcement-blast";
import type { ActionResult } from "@/lib/validations";
import { announcementBlastSchema } from "@/lib/validations";

export type SendAnnouncementBlastResult = {
  sent: number;
  failed: number;
};

type BlastInput = z.infer<typeof announcementBlastSchema>;

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
  const found = subscribers.filter((s): s is NonNullable<typeof s> => s !== null);

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

  let sent = 0;
  let failed = 0;

  for (const subscriber of found) {
    const result = await sendAnnouncementToOne({
      to: subscriber.email,
      firstName: subscriber.first_name,
      subject: emailSubject,
      preset,
      idempotencyKey: `announcement-blast/${preset}/${subscriber.id}/${send_token}`,
    });
    if (result.ok) sent += 1;
    else failed += 1;
  }

  if (sent === 0) {
    return {
      success: false,
      error:
        failed > 0
          ? "Could not send any messages. Check that Resend is configured and try again."
          : "No messages were sent.",
    };
  }

  const message =
    failed === 0
      ? sent === 1
        ? "Announcement sent to 1 neighbor."
        : `Announcement sent to ${sent} neighbors.`
      : `Sent ${sent} of ${found.length}. ${failed} failed — check server logs.`;

  return {
    success: true,
    data: { sent, failed },
    message,
  };
}