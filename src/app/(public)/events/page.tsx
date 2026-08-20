import type { Metadata } from "next";
import Link from "next/link";
import { PossibleEventCard } from "@/components/home/possible-event-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { possibleEvents } from "@/lib/content/possible-events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Possible upcoming gatherings from Earley Lake Neighborhood Organization—confirmed dates coming soon.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal as="header" className="max-w-2xl">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">Events</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Confirmed dates will be posted here. Meanwhile, here’s a look at the kinds of
          gatherings we’re planning.
        </p>
      </Reveal>

      <Reveal className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Coming soon:</span> specific dates,
        times, and locations will be announced on this page and through our email list.
      </Reveal>

      <Reveal as="section" className="mt-12">
        <h2 className="font-display text-2xl text-foreground">Possible upcoming events</h2>
        <p className="mt-2 text-muted-foreground">
          Ideas for neighborhood gatherings—no fixed dates yet.
        </p>
        <Reveal stagger className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {possibleEvents.map((event) => (
            <div key={event.id}>
              <PossibleEventCard event={event} />
            </div>
          ))}
        </Reveal>
      </Reveal>

      <Reveal className="mt-14 text-center">
        <p className="text-muted-foreground">
          Be the first to know when something is scheduled.
        </p>
        <Button asChild className="mt-4">
          <Link href="/join">Join the email list</Link>
        </Button>
      </Reveal>
    </div>
  );
}
