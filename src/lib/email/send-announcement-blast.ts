import { AnnouncementBlastEmail } from "../../../emails/announcement-blast";
import {
  getAnnouncementBlastContent,
  type AnnouncementBlastPreset,
} from "./announcement-presets";
import { sendWithRateLimit } from "./send-with-rate-limit";
import { SITE } from "@/lib/site";
import { getResendClient, getResendFromAddress } from "./resend";

export function isResendConfigured(): boolean {
  return Boolean(getResendClient() && getResendFromAddress());
}

export type SendAnnouncementToOneResult = {
  ok: boolean;
  resendId?: string;
  error?: string;
};

export async function sendAnnouncementToOne(input: {
  to: string;
  firstName: string;
  subject: string;
  preset: AnnouncementBlastPreset;
  idempotencyKey: string;
}): Promise<SendAnnouncementToOneResult> {
  const resend = getResendClient();
  const from = getResendFromAddress();

  if (!resend || !from) {
    return {
      ok: false,
      error: "Resend is not configured (API key or from address).",
    };
  }

  const email = input.to.toLowerCase().trim();
  const content = getAnnouncementBlastContent(input.preset);
  const siteUrl = SITE.url;

  const text = [
    `Hi ${input.firstName.trim() || "neighbor"},`,
    "",
    content.title,
    "",
    content.excerpt,
    "",
    `Read more: ${content.url}`,
    "",
    "Earley Lake Neighborhood Organization · Burnsville, MN",
  ].join("\n");

  const payload = {
    from,
    to: [email],
    subject: input.subject,
    react: AnnouncementBlastEmail({
      firstName: input.firstName,
      siteUrl,
      announcementTitle: content.title,
      announcementExcerpt: content.excerpt,
      announcementUrl: content.url,
      heroImageUrl: content.heroImageUrl,
    }),
    text,
  };

  const result = await sendWithRateLimit(() =>
    resend.emails.send(payload, { idempotencyKey: input.idempotencyKey }),
  );

  if (!result.ok) {
    console.error("sendAnnouncementToOne failed", email, result.error);
    return { ok: false, error: result.error };
  }

  console.info("sendAnnouncementToOne sent", email, result.resendId);
  return { ok: true, resendId: result.resendId };
}