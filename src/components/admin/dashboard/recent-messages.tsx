import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowRight } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/admin/page-header";

export function DashboardRecentMessages({ messages }: { messages: ContactMessage[] }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground">Recent messages</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">From the website contact form</p>
        </div>
        <Link
          href="/admin/messages"
          className="group inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          Inbox
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          illustration="inbox"
          title="No messages yet"
          description="When neighbors use the contact form, their notes will show up here."
          className="mt-5 flex-1 border-0 bg-muted/30"
        />
      ) : (
        <ul className="mt-4 -mx-2 space-y-0.5">
          {messages.map((m) => {
            const unread = m.status === "unread";
            return (
              <li key={m.id}>
                <Link
                  href="/admin/messages"
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="relative">
                    <Avatar name={m.name} seed={m.email} />
                    {unread ? (
                      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-amber-500" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={unread ? "truncate text-sm font-semibold" : "truncate text-sm font-medium"}>
                        {m.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDistanceToNowStrict(new Date(m.created_at), { addSuffix: true })}
                      </span>
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">{m.subject}</span>
                  </span>
                  {m.status === "replied" ? (
                    <StatusPill tone="success" className="hidden sm:inline-flex">replied</StatusPill>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
