import type { Metadata } from "next";
import { listSubscribersAdmin } from "@/lib/data";
import { getAnnouncementBlastContent } from "@/lib/email/announcement-presets";
import { isResendConfigured } from "@/lib/email/send-announcement-blast";
import { EmailBlastClient } from "@/components/admin/email-blast-client";
import { BackLink } from "@/components/admin/back-link";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Send announcement",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ids?: string }> };

export default async function AdminEmailBlastPage({ searchParams }: Props) {
  const { ids } = await searchParams;
  const initialSelectedIds = (ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [subscribers, announcement] = await Promise.all([
    listSubscribersAdmin({ sort: "name_asc" }),
    Promise.resolve(getAnnouncementBlastContent("library-dedication")),
  ]);

  return (
    <div className="space-y-6">
      <BackLink href="/admin/subscribers" label="Email list" />
      <PageHeader
        eyebrow="Email"
        title="Send announcement"
        description="Choose neighbors on the email list and send the library dedication news story. Each person gets their own message."
      />
      <EmailBlastClient
        subscribers={subscribers}
        emailConfigured={isResendConfigured()}
        initialSelectedIds={initialSelectedIds}
        announcement={announcement}
      />
    </div>
  );
}