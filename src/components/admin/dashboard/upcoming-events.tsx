import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";
import { ArrowRight, MapPin } from "lucide-react";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/admin/page-header";
import { DateTile } from "@/components/admin/date-tile";

function countdown(iso: string) {
  const days = differenceInCalendarDays(new Date(iso), new Date());
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 14) return `In ${days} days`;
  return `In ${Math.round(days / 7)} weeks`;
}

export function DashboardUpcomingEvents({ events }: { events: Event[] }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground">Upcoming events</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Published and on the calendar</p>
        </div>
        <Link href="/admin/events" className="group inline-flex items-center gap-1 text-sm font-medium text-primary">
          Manage
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          illustration="calendar"
          title="No upcoming events"
          description="Publish an event with a future date to feature it here and on the public site."
          action={
            <Button asChild size="sm">
              <Link href="/admin/events/new">Create event</Link>
            </Button>
          }
          className="mt-5 flex-1 border-0 bg-muted/30"
        />
      ) : (
        <ol className="relative mt-4 space-y-1">
          {events.map((e, i) => (
            <li key={e.id} className="relative">
              {i < events.length - 1 ? (
                <span aria-hidden className="absolute left-[1.6rem] top-14 h-[calc(100%-2.5rem)] w-px bg-border" />
              ) : null}
              <Link
                href={`/admin/events/${e.id}`}
                className="group -mx-2 flex items-center gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <DateTile iso={e.start_at} highlight={i === 0} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">{e.title}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {format(new Date(e.start_at), "EEE · h:mm a")}
                    {e.location ? (
                      <>
                        <span aria-hidden>·</span>
                        <MapPin className="h-3 w-3" aria-hidden />
                        <span className="truncate">{e.location}</span>
                      </>
                    ) : null}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  {countdown(e.start_at)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
