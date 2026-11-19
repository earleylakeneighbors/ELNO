import type { Metadata } from "next";
import {
  EMAIL_BLAST_LOG_PAGE_SIZE,
  getEmailBlastBatchWithDeliveries,
  isEmailBlastLogsConfigured,
  listEmailBlastBatches,
  listSubscribersAdmin,
} from "@/lib/data";
import { getAnnouncementBlastContent } from "@/lib/email/announcement-presets";
import { isResendConfigured } from "@/lib/email/send-announcement-blast";
import { EmailBlastClient } from "@/components/admin/email-blast-client";
import { EmailBlastLogSection } from "@/components/admin/email-blast-log";
import { BackLink } from "@/components/admin/back-link";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Send announcement",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ ids?: string; logPage?: string }> };

function parseLogPage(value: string | undefined): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export default async function AdminEmailBlastPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialSelectedIds = (params.ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const logPage = parseLogPage(params.logPage);

  const [subscribers, announcement, listResult] = await Promise.all([
    listSubscribersAdmin({ sort: "name_asc" }),
    Promise.resolve(getAnnouncementBlastContent("library-dedication")),
    listEmailBlastBatches({ page: logPage, pageSize: EMAIL_BLAST_LOG_PAGE_SIZE }),
  ]);

  const batchesWithDeliveries = await Promise.all(
    listResult.rows.map(async (batch) => {
      const full = await getEmailBlastBatchWithDeliveries(batch.id);
      return full ?? { ...batch, deliveries: [] };
    }),
  );

  return (
    <div className="space-y-6">
      <BackLink href="/admin/subscribers" label="Email list" />
      <PageHeader
        eyebrow="Email"
        title="Send announcement"
        description="Choose neighbors on the email list and send the library dedication news story. Each person gets their own message (paced to respect Resend rate limits)."
      />
      <EmailBlastClient
        subscribers={subscribers}
        emailConfigured={isResendConfigured()}
        initialSelectedIds={initialSelectedIds}
        announcement={announcement}
      />
      <EmailBlastLogSection
        listResult={listResult}
        batchesWithDeliveries={batchesWithDeliveries}
        supabaseConfigured={isEmailBlastLogsConfigured()}
        page={logPage}
      />
    </div>
  );
}