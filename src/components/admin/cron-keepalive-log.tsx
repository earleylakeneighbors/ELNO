import Link from "next/link";
import { Activity, CheckCircle2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import type { CronKeepaliveLogListResult } from "@/lib/data/cron-keepalive-logs";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";

type Props = {
  result: CronKeepaliveLogListResult;
  supabaseConfigured: boolean;
};

function formatRowTime(iso: string) {
  return formatDate(iso, { dateStyle: "medium", timeStyle: "short" });
}

function profilesRowLabel(hasRow: boolean | null) {
  if (hasRow === null) return "—";
  return hasRow ? "Yes" : "No";
}

function Notice({ tone = "neutral", children }: { tone?: "neutral" | "warning"; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "mt-6 rounded-xl border border-dashed px-6 py-8 text-center text-sm text-muted-foreground",
        tone === "warning" ? "border-amber-200 bg-amber-50/50" : "border-border",
      )}
    >
      {children}
    </p>
  );
}

export function CronKeepaliveLogSection({ result, supabaseConfigured }: Props) {
  const { rows, total, page, totalPages, setupRequired } = result;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = totalPages > 0 && page < totalPages ? page + 1 : null;
  const ok = rows.filter((r) => r.success).length;
  const latest = rows[0];

  function pageHref(targetPage: number) {
    return targetPage <= 1 ? "/admin/settings" : `/admin/settings?keepalivePage=${targetPage}`;
  }

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-lg">Supabase keep-alive</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Daily Vercel cron at 12:00 UTC hits{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/cron/supabase-keepalive</code>. Manual
              tests with{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">Authorization: Bearer CRON_SECRET</code>{" "}
              appear here too.
            </p>
          </div>
        </div>
        {latest ? (
          <StatusPill tone={latest.success ? "success" : "danger"} pulse={latest.success}>
            {latest.success ? "Healthy" : "Last run failed"}
          </StatusPill>
        ) : null}
      </header>

      {!supabaseConfigured ? (
        <Notice>
          Supabase is not configured. Keep-alive logs require{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and the service role key.
        </Notice>
      ) : setupRequired ? (
        <Notice tone="warning">
          The <code className="text-xs">cron_keepalive_logs</code> table is not on this Supabase project yet.
          Apply <code className="text-xs">supabase/migrations/0002_cron_keepalive_logs.sql</code> (Supabase SQL
          editor or CLI), then refresh this page.
        </Notice>
      ) : total === 0 ? (
        <Notice>
          No keep-alive runs logged yet. After deploy and the daily cron (or a manual test), entries will show
          here newest first.
        </Notice>
      ) : (
        <>
          {/* Run history strip, oldest → newest */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {ok} of {rows.length} runs OK on this page
              </span>
              <span>
                {total} {total === 1 ? "entry" : "entries"}
                {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ""}
              </span>
            </div>
            <div className="mt-2 flex h-9 items-stretch gap-[3px]" role="list" aria-label="Run history">
              {[...rows].reverse().map((row) => (
                <span
                  key={row.id}
                  role="listitem"
                  title={`${formatRowTime(row.created_at)} · ${row.success ? "OK" : "Failed"}`}
                  aria-label={`${formatRowTime(row.created_at)}: ${row.success ? "OK" : "Failed"}`}
                  className={cn(
                    "flex-1 rounded-[3px] transition-transform hover:scale-y-110",
                    row.success ? "bg-success/70 hover:bg-success" : "bg-destructive/80 hover:bg-destructive",
                  )}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Older</span>
              <span>Newest</span>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Authorized</th>
                  <th className="px-4 py-3 font-medium">Profiles row</th>
                  <th className="px-4 py-3 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">{formatRowTime(row.created_at)}</td>
                    <td className="px-4 py-3">
                      {row.success ? (
                        <span className="inline-flex items-center gap-1.5 text-success">
                          <CheckCircle2 className="h-4 w-4" /> OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-destructive">
                          <XCircle className="h-4 w-4" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{row.authorized ? "Yes" : "No"}</td>
                    <td className="px-4 py-3">{profilesRowLabel(row.has_row)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.detail ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 ? (
            <div className="mt-4 flex items-center justify-end gap-2">
              {prevPage ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={pageHref(prevPage)}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
              )}
              {nextPage ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={pageHref(nextPage)}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
