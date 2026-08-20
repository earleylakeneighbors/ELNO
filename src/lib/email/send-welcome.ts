import { WelcomeSubscriberEmail } from "../../../emails/welcome-subscriber";
import { SITE } from "@/lib/site";
import { getResendClient, getResendFromAddress } from "./resend";

export type SendWelcomeResult = { ok: boolean };

export async function sendWelcomeSubscriberEmail(input: {
  to: string;
  firstName: string;
}): Promise<SendWelcomeResult> {
  const resend = getResendClient();
  const from = getResendFromAddress();

  if (!resend || !from) {
    console.error(
      "sendWelcomeSubscriberEmail skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.",
    );
    return { ok: false };
  }

  const email = input.to.toLowerCase().trim();
  const firstName = input.firstName.trim();
  const siteUrl = SITE.url;

  const text = [
    `Thank you, ${firstName || "neighbor"}.`,
    "",
    "You're on the Earley Lake Neighborhood email list. We'll share announcements, gathering ideas, and ways to get involved around Earley Lake in Burnsville, MN.",
    "",
    `Events: ${siteUrl.replace(/\/$/, "")}/events`,
    `About us: ${siteUrl.replace(/\/$/, "")}/about`,
    "",
    "Earley Lake Neighborhood Organization · Burnsville, MN",
  ].join("\n");

  try {
    const { data, error } = await resend.emails.send(
      {
        from,
        to: [email],
        subject: "Welcome to Earley Lake Neighborhood",
        react: WelcomeSubscriberEmail({ firstName, siteUrl }),
        text,
      },
      { idempotencyKey: `welcome-subscriber/${email}` },
    );

    if (error) {
      console.error("sendWelcomeSubscriberEmail failed", error.message);
      return { ok: false };
    }

    console.info("sendWelcomeSubscriberEmail sent", data?.id);
    return { ok: true };
  } catch (err) {
    console.error("sendWelcomeSubscriberEmail unexpected error", err);
    return { ok: false };
  }
}
