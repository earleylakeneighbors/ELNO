import Link from "next/link";
import type { ContactMessage } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Props = {
  messages: ContactMessage[];
};

export function DashboardRecentMessages({ messages }: Props) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground">Recent messages</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact form submissions from the website
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/admin/messages">View all</Link>
        </Button>
      </div>

      {messages.length === 0 ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No messages yet</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            When neighbors use the contact form, their notes will show up here.
          </p>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-border">
          {messages.map((m) => (
            <li key={m.id}>
              <Link
                href="/admin/messages"
                className="flex items-start justify-between gap-3 py-3.5 transition-colors hover:bg-muted/40 -mx-2 rounded-lg px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{m.subject}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {m.name} · {formatDate(m.created_at)}
                  </p>
                </div>
                <Badge
                  variant={
                    m.status === "unread"
                      ? "warning"
                      : m.status === "replied"
                        ? "success"
                        : "secondary"
                  }
                  className="shrink-0"
                >
                  {m.status}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
