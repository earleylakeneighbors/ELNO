import type { Metadata } from "next";
import { CronKeepaliveLogSection } from "@/components/admin/cron-keepalive-log";
import { SettingsForm } from "@/components/admin/settings-form";
import {
  CRON_KEEPALIVE_LOG_PAGE_SIZE,
  getSettings,
  isCronKeepaliveLogsConfigured,
  listCronKeepaliveLogs,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ keepalivePage?: string }>;
};

function parseKeepalivePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const keepalivePage = parseKeepalivePage(params.keepalivePage);

  const [settings, keepaliveLogs] = await Promise.all([
    getSettings(),
    listCronKeepaliveLogs({ page: keepalivePage, pageSize: CRON_KEEPALIVE_LOG_PAGE_SIZE }),
  ]);

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Organization details and social links. Leave social URLs blank until you have real
          accounts.
        </p>
      </header>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
      <CronKeepaliveLogSection
        result={keepaliveLogs}
        supabaseConfigured={isCronKeepaliveLogsConfigured()}
      />
    </div>
  );
}
