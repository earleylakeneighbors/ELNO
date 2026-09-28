"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { format } from "date-fns";
import { ArrowRight, CalendarPlus, Search } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { LakeScene } from "@/components/admin/illustrations";
import { openCommandPalette } from "@/components/admin/command-palette";

function subscribeToMinute(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

function greetingFor(date: Date) {
  const h = date.getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero({
  name,
  unread,
  nextEvent,
}: {
  name: string | null;
  unread: number;
  nextEvent: { title: string; start_at: string; id: string } | null;
}) {
  // Greeting depends on the viewer's clock, so it only resolves in the browser.
  const minute = useSyncExternalStore(
    subscribeToMinute,
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
  const now = minute === null ? null : new Date(minute * 60_000);

  const first = name?.trim().split(/\s+/)[0];

  return (
    <BlurFade>
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#eef3f2] via-card to-[#f6efe2] shadow-sm">
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-full sm:left-auto sm:w-[58%]">
          <LakeScene />
          <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-card sm:via-card/30 sm:to-transparent" />
        </div>
        <div className="relative px-6 pb-44 pt-7 sm:max-w-[60%] sm:px-8 sm:py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {now ? format(now, "EEEE, MMMM d") : " "}
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            {now ? greetingFor(now) : "Welcome back"}
            {first ? `, ${first}` : ""}.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {unread > 0 ? (
              <>
                You have{" "}
                <Link href="/admin/messages" className="font-semibold text-foreground underline decoration-amber-400 decoration-2 underline-offset-4 hover:decoration-amber-500">
                  {unread} unread {unread === 1 ? "message" : "messages"}
                </Link>
              </>
            ) : (
              <>The inbox is clear</>
            )}
            {nextEvent ? (
              <>
                {" "}and{" "}
                <Link href={`/admin/events/${nextEvent.id}`} className="font-semibold text-foreground underline decoration-primary/40 decoration-2 underline-offset-4 hover:decoration-primary">
                  {nextEvent.title}
                </Link>{" "}
                is coming up on {format(new Date(nextEvent.start_at), "MMM d")}.
              </>
            ) : (
              <>. No events are on the calendar yet.</>
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild className="group">
              <Link href={unread > 0 ? "/admin/messages" : "/admin/events/new"}>
                {unread > 0 ? "Open inbox" : (
                  <>
                    <CalendarPlus className="h-4 w-4" /> Plan an event
                  </>
                )}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button type="button" variant="outline" className="bg-card/70" onClick={openCommandPalette}>
              <Search className="h-4 w-4" /> Quick jump
              <kbd className="ml-1 hidden rounded border border-border px-1 text-[10px] text-muted-foreground sm:inline">Ctrl K</kbd>
            </Button>
          </div>
        </div>
      </section>
    </BlurFade>
  );
}
