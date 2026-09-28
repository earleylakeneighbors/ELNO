"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { format } from "date-fns";
import { Clock, ExternalLink, MapPin, Pencil, Search } from "lucide-react";
import type { Event } from "@/lib/types";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { StatusPill, contentStatusTone } from "@/components/ui/status-pill";
import { DateTile } from "@/components/admin/date-tile";
import { DeleteEventButton } from "@/components/admin/delete-buttons";
import { EmptyState } from "@/components/admin/page-header";

type Filter = "upcoming" | "past" | "draft" | "all";

export function EventsBoard({ events }: { events: Event[] }) {
  const [now] = useState(() => Date.now());
  const isUpcoming = (e: Event) => e.status !== "draft" && new Date(e.start_at).getTime() >= now;
  const isPast = (e: Event) => e.status !== "draft" && new Date(e.start_at).getTime() < now;

  // Open on the first tab that has something in it.
  const [filter, setFilter] = useState<Filter>(() =>
    events.some(isUpcoming) ? "upcoming" : events.some((e) => e.status === "draft") ? "draft" : "all",
  );
  const [query, setQuery] = useState("");

  const counts = {
    upcoming: events.filter(isUpcoming).length,
    past: events.filter(isPast).length,
    draft: events.filter((e) => e.status === "draft").length,
    all: events.length,
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = events.filter((e) =>
      filter === "upcoming" ? isUpcoming(e) : filter === "past" ? isPast(e) : filter === "draft" ? e.status === "draft" : true,
    );
    if (q) list = list.filter((e) => `${e.title} ${e.location}`.toLowerCase().includes(q));
    // Upcoming reads soonest-first; everything else newest-first.
    return filter === "upcoming"
      ? [...list].sort((a, b) => +new Date(a.start_at) - +new Date(b.start_at))
      : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AnimatedTabs
          ariaLabel="Filter events"
          value={filter}
          onChange={setFilter}
          items={[
            { value: "upcoming", label: "Upcoming", count: counts.upcoming },
            { value: "past", label: "Past", count: counts.past },
            { value: "draft", label: "Drafts", count: counts.draft },
            { value: "all", label: "All", count: counts.all },
          ]}
        />
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search events</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          illustration={query ? "search" : "calendar"}
          title={query ? "No events match" : filter === "draft" ? "No drafts" : "Nothing on this list"}
          description={query ? "Try another title or place." : "Create an event and it'll show up here."}
          action={
            <Link href="/admin/events/new" className="text-sm font-medium text-primary hover:underline">
              + New event
            </Link>
          }
        />
      ) : (
        <motion.ul layout className="grid gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((e, i) => {
              const past = new Date(e.start_at).getTime() < now;
              return (
                <motion.li
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.03 } }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-3 pr-4 shadow-sm transition-[box-shadow,border-color] hover:border-primary/25 hover:shadow-md sm:p-4"
                >
                  <div className="relative hidden h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-muted sm:block">
                    {e.image_url ? (
                      <Image
                        src={e.image_url}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="admin-grid-bg h-full w-full" />
                    )}
                  </div>
                  <DateTile iso={e.start_at} highlight={!past && e.status === "published"} muted={past} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/events/${e.id}`}
                        className="truncate font-medium text-foreground after:absolute after:inset-0 after:rounded-2xl hover:text-primary"
                      >
                        {e.title}
                      </Link>
                      <StatusPill tone={contentStatusTone(e.status)}>{e.status}</StatusPill>
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1" suppressHydrationWarning>
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(e.start_at), "EEE, MMM d · h:mm a")}
                      </span>
                      {e.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {e.location}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div className="relative z-10 flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                    {e.status === "published" ? (
                      <a
                        href={`/events/${e.slug}`}
                        target="_blank"
                        rel="noopener"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`View ${e.title} on site`}
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                    <Link
                      href={`/admin/events/${e.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${e.title}`}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteEventButton id={e.id} title={e.title} />
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
