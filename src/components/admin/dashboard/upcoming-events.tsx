import Link from "next/link";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Props = {
  events: Event[];
};

export function DashboardUpcomingEvents({ events }: Props) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground">Upcoming events</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Published gatherings on the calendar
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/admin/events">Manage</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No upcoming events</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Publish an event with a future date to feature it here and on the public site.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/admin/events/new">Create event</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-border">
          {events.map((e) => (
            <li key={e.id}>
              <Link
                href={`/admin/events/${e.id}`}
                className="block py-3.5 transition-colors hover:bg-muted/40 -mx-2 rounded-lg px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="font-medium text-foreground">{e.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(e.start_at)}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
