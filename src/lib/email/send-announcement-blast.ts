import { AnnouncementBlastEmail } from "../../../emails/announcement-blast";
import {
  getAnnouncementBlastContent,
  type AnnouncementBlastPreset,
} from "./announcement-presets";
import { SITE } from "@/lib/site";
import { getResendClient, getResendFromAddress } from "./resend";

export function isResendConfigured(): boolean {
  return Boolean(getResendClient() && getResendFromAddress());
}

export type SendAnnouncementToOneResult = { ok: boolean };

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
    console.error(
      "sendAnnouncementToOne skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.",
    );
    return { ok: false };
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

  try {
    const { data, error } = await resend.emails.send(
      {
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
      },
      { idempotencyKey: input.idempotencyKey },
    );

    if (error) {
      console.error("sendAnnouncementToOne failed", email, error.message);
      return { ok: false };
    }

    console.info("sendAnnouncementToOne sent", email, data?.id);
    return { ok: true };
  } catch (err) {
    console.error("sendAnnouncementToOne unexpected error", email, err);
    return { ok: false };
  }
}