"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronLeft, ChevronRight, Mail, Megaphone } from "lucide-react";
import { retryFailedBlastDeliveriesAction } from "@/lib/actions/admin-email-blast";
import type { EmailBlastBatchListResult } from "@/lib/data/email-blast-logs";
import type { EmailBlastBatchWithDeliveries } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type Props = {
  listResult: EmailBlastBatchListResult;
  batchesWithDeliveries: EmailBlastBatchWithDeliveries[];
  supabaseConfigured: boolean;
  page: number;
};

function formatRowTime(iso: string) {
  return formatDate(iso, { dateStyle: "medium", timeStyle: "short" });
}

export function EmailBlastLogSection({
  listResult,
  batchesWithDeliveries,
  supabaseConfigured,
  page,
}: Props) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(batchesWithDeliveries[0]?.id ?? null);

  const { total, totalPages, setupRequired } = listResult;
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = totalPages > 0 && page < totalPages ? page + 1 : null;

  function pageHref(targetPage: number) {
    return targetPage <= 1 ? "/admin/email-blast" : `/admin/email-blast?logPage=${targetPage}`;
  }

  async function retryFailed(batchId: string) {
    setRetrying(true);
    try {
      const result = await retryFailedBlastDeliveriesAction({
        batch_id: batchId,
        send_token: crypto.randomUUID(),
      });
      if (!result.success) {
        toast.error(result.error);
        return false;
      }
      toast.success(result.message);
      router.refresh();
      return true;
    } finally {
      setRetrying(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-lg">Delivery log</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Per-recipient results for announcement sends. Failed rows often show Resend rate limits — use{" "}
              <strong className="font-medium text-foreground">Resend failed</strong> after a blast completes.
            </p>
          </div>
        </div>
        {total > 0 ? (
          <StatusPill tone="neutral">
            {total} {total === 1 ? "batch" : "batches"}
          </StatusPill>
        ) : null}
      </header>

      {!supabaseConfigured ? (
        <p className="mt-6 rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
          Logs are stored in memory locally. On production, configure Supabase and apply migration{" "}
          <code className="text-xs">0006_email_blast_logs.sql</code>.
        </p>
      ) : setupRequired ? (
        <p className="mt-6 rounded-xl border border-dashed border-amber-200 bg-amber-50/50 px-6 py-8 text-center text-sm text-muted-foreground">
          The <code className="text-xs">email_blast_batches</code> tables are not on this project yet. Apply{" "}
          <code className="text-xs">supabase/migrations/0006_email_blast_logs.sql</code>, then refresh.
        </p>
      ) : total === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
          No announcement blasts logged yet. After you send, results will appear here.
        </p>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {batchesWithDeliveries.map((batch) => {
              const isOpen = expanded === batch.id;
              return (
                <li key={batch.id} className="overflow-hidden rounded-xl border border-border bg-background">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : batch.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">{batch.subject}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {formatRowTime(batch.created_at)} · {batch.recipient_count} recipients
                      </span>
                    </span>
                    <span className="flex shrink-0 gap-2 text-xs tabular-nums">
                      <span className="text-success">{batch.sent_count} sent</span>
                      {batch.failed_count > 0 ? (
                        <span className="text-destructive">{batch.failed_count} failed</span>
                      ) : null}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-border px-4 py-3">
                      {batch.failed_count > 0 ? (
                        <ConfirmDialog
                          title={`Resend ${batch.failed_count} failed ${batch.failed_count === 1 ? "message" : "messages"}?`}
                          description={
                            <>
                              Only recipients who failed in this batch will be emailed again, using the same subject
                              line.
                            </>
                          }
                          confirmLabel={retrying ? "Sending…" : "Resend failed"}
                          onConfirm={() => retryFailed(batch.id)}
                          trigger={
                            <Button type="button" size="sm" className="mb-4" disabled={retrying}>
                              <Megaphone className="h-4 w-4" />
                              Resend failed ({batch.failed_count})
                            </Button>
                          }
                        />
                      ) : null}
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[32rem] text-left text-sm">
                          <thead>
                            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                              <th className="pb-2 pr-4 font-medium">Recipient</th>
                              <th className="pb-2 pr-4 font-medium">Status</th>
                              <th className="pb-2 font-medium">Reason</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {[...batch.deliveries]
                              .sort((a, b) => {
                                if (a.status === b.status) return a.email.localeCompare(b.email);
                                return a.status === "failed" ? -1 : 1;
                              })
                              .map((d) => (
                                <tr key={d.id}>
                                  <td className="py-2 pr-4">
                                    <span className="block font-medium">{d.recipient_name || d.email}</span>
                                    <span className="text-xs text-muted-foreground">{d.email}</span>
                                  </td>
                                  <td className="py-2 pr-4">
                                    <StatusPill tone={d.status === "sent" ? "success" : "danger"}>
                                      {d.status === "sent" ? "Sent" : "Failed"}
                                    </StatusPill>
                                  </td>
                                  <td className="py-2 text-muted-foreground">
                                    {d.status === "failed" ? d.error_message ?? "Unknown error" : "—"}
                                    {d.retry_count > 0 ? (
                                      <span className="mt-0.5 block text-[10px] uppercase tracking-wide">
                                        Retries: {d.retry_count}
                                      </span>
                                    ) : null}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={!prevPage} asChild={Boolean(prevPage)}>
                  {prevPage ? (
                    <a href={pageHref(prevPage)}>
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </a>
                  ) : (
                    <span>
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </span>
                  )}
                </Button>
                <Button variant="outline" size="sm" disabled={!nextPage} asChild={Boolean(nextPage)}>
                  {nextPage ? (
                    <a href={pageHref(nextPage)}>
                      Next <ChevronRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span>
                      Next <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}