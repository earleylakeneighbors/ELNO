import Link from "next/link";
import type { CronKeepaliveLogListResult } from "@/lib/data/cron-keepalive-logs";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function CronKeepaliveLogSection({ result, supabaseConfigured }: Props) {
  const { rows, total, page, totalPages } = result;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = totalPages > 0 && page < totalPages ? page + 1 : null;

  function pageHref(targetPage: number) {
    return targetPage <= 1 ? "/admin/settings" : `/admin/settings?keepalivePage=${targetPage}`;
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <header>
        <h2 className="font-display text-2xl">Supabase keep-alive log</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Daily Vercel cron at 12:00 UTC hits{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">/api/cron/supabase-keepalive</code>
          . Manual tests with{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">Authorization: Bearer CRON_SECRET</code>{" "}
          appear here too.
        </p>
      </header>

      {!supabaseConfigured ? (
        <p className="mt-6 rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
          Supabase is not configured. Keep-alive logs require{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and the service role key.
        </p>
      ) : total === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          No keep-alive runs logged yet. After deploy and the daily cron (or a manual test), entries
          will show here newest first.
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm text-muted-foreground">
            {total} {total === 1 ? "entry" : "entries"}
            {totalPages > 1 ? (
              <>
                {" "}
                · Page {page} of {totalPages}
              </>
            ) : null}
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground">
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
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">{formatRowTime(row.created_at)}</td>
                    <td className="px-4 py-3">
                      {row.success ? (
                        <Badge variant="success">OK</Badge>
                      ) : (
                        <Badge className="bg-destructive/15 text-destructive">Failed</Badge>
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
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {prevPage ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={pageHref(prevPage)}>Previous</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
              )}
              {nextPage ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={pageHref(nextPage)}>Next</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              )}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
