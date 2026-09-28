import { NewSignupAdminEmail } from "../../../emails/new-signup-admin";
import { SITE } from "@/lib/site";
import type { Subscriber } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getResendClient, getResendFromAddress } from "./resend";

function adminSubscribersUrl(): string {
  return `${SITE.url.replace(/\/$/, "")}/admin/subscribers`;
}

export type SendSignupAdminNotifyResult = { ok: boolean };

function displayName(subscriber: Subscriber): string {
  return [subscriber.first_name, subscriber.last_name].filter(Boolean).join(" ").trim();
}

function buildPlainText(
  subscriber: Subscriber,
  submittedAtLabel: string,
  adminListUrl: string,
): string {
  const fullName = displayName(subscriber) || "—";
  return [
    "New email list signup",
    "",
    `Name: ${fullName}`,
    `Email: ${subscriber.email}`,
    `Street address: ${subscriber.street_address?.trim() || "—"}`,
    `Interests: ${subscriber.interests?.trim() || "—"}`,
    `Submitted: ${submittedAtLabel}`,
    "",
    `Email list (admin): ${adminListUrl}`,
    "",
    "Reply to this message to reach the subscriber directly.",
  ].join("\n");
}

function logResendError(context: string, error: unknown) {
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    console.error(context, {
      message: record.message ?? String(error),
      name: record.name,
    });
    return;
  }
  console.error(context, error);
}

export async function sendSignupAdminNotifyEmail(input: {
  to: string;
  subscriber: Subscriber;
}): Promise<SendSignupAdminNotifyResult> {
  const resend = getResendClient();
  const from = getResendFromAddress();

  if (!resend || !from) {
    console.error(
      "sendSignupAdminNotifyEmail skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.",
    );
    return { ok: false };
  }

  const to = input.to.trim().toLowerCase();
  const { subscriber } = input;
  const submittedAtLabel = formatDate(subscriber.created_at, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const nameForSubject = displayName(subscriber) || subscriber.email;
  const subject = `New email list signup: ${nameForSubject}`;
  const adminListUrl = adminSubscribersUrl();
  const text = buildPlainText(subscriber, submittedAtLabel, adminListUrl);

  console.info("sendSignupAdminNotifyEmail attempt", {
    to,
    subscriberId: subscriber.id,
  });

  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        to: [to],
        replyTo: [subscriber.email],
        subject,
        react: NewSignupAdminEmail({
          firstName: subscriber.first_name,
          lastName: subscriber.last_name,
          email: subscriber.email,
          streetAddress: subscriber.street_address,
          interests: subscriber.interests,
          submittedAtLabel,
          adminListUrl,
        }),
        text,
      },
      { idempotencyKey: `signup-admin-notify/${subscriber.id}` },
    );

    if (!error) {
      console.info("sendSignupAdminNotifyEmail sent", data?.id);
      return { ok: true };
    }

    logResendError("sendSignupAdminNotifyEmail react send failed", error);

    const { data: fallbackData, error: fallbackError } = await resend.emails.send({
      from,
      to: [to],
      replyTo: [subscriber.email],
      subject,
      text,
    });

    if (fallbackError) {
      logResendError("sendSignupAdminNotifyEmail text-only fallback failed", fallbackError);
      return { ok: false };
    }

    console.info("sendSignupAdminNotifyEmail sent via text fallback", fallbackData?.id);
    return { ok: true };
  } catch (err) {
    console.error("sendSignupAdminNotifyEmail unexpected error", err);
    try {
      const { data: fallbackData, error: fallbackError } = await resend.emails.send({
        from,
        to: [to],
        replyTo: [subscriber.email],
        subject,
        text,
      });
      if (fallbackError) {
        logResendError("sendSignupAdminNotifyEmail text-only fallback failed", fallbackError);
        return { ok: false };
      }
      console.info("sendSignupAdminNotifyEmail sent via text fallback", fallbackData?.id);
      return { ok: true };
    } catch (fallbackErr) {
      console.error("sendSignupAdminNotifyEmail fallback unexpected error", fallbackErr);
      return { ok: false };
    }
  }
}
