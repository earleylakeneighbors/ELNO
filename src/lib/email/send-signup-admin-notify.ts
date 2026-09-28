import { NewSignupAdminEmail } from "../../../emails/new-signup-admin";
import type { Subscriber } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getResendClient, getResendFromAddress } from "./resend";

export type SendSignupAdminNotifyResult = { ok: boolean };

function displayName(subscriber: Subscriber): string {
  return [subscriber.first_name, subscriber.last_name].filter(Boolean).join(" ").trim();
}

function buildPlainText(subscriber: Subscriber, submittedAtLabel: string): string {
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
    "Reply to this message to reach the subscriber directly.",
  ].join("\n");
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

  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        to: [to],
        replyTo: subscriber.email,
        subject: `New email list signup: ${nameForSubject}`,
        react: NewSignupAdminEmail({
          firstName: subscriber.first_name,
          lastName: subscriber.last_name,
          email: subscriber.email,
          streetAddress: subscriber.street_address,
          interests: subscriber.interests,
          submittedAtLabel,
        }),
        text: buildPlainText(subscriber, submittedAtLabel),
      },
      { idempotencyKey: `signup-admin-notify/${subscriber.id}` },
    );

    if (error) {
      console.error("sendSignupAdminNotifyEmail failed", error.message);
      return { ok: false };
    }

    console.info("sendSignupAdminNotifyEmail sent", data?.id);
    return { ok: true };
  } catch (err) {
    console.error("sendSignupAdminNotifyEmail unexpected error", err);
    return { ok: false };
  }
}
