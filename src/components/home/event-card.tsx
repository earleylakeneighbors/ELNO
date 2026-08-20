import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function EventCard({
  event,
  isPast = false,
}: {
  event: Event;
  isPast?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-[var(--motion-med)] ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/events/${event.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : null}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Past" : "Upcoming"}
            </Badge>
            <time
              dateTime={event.start_at}
              className="text-sm text-muted-foreground"
            >
              {formatDate(event.start_at)} · {formatTime(event.start_at)}
            </time>
          </div>
          <h3 className="mt-3 font-display text-xl text-foreground group-hover:text-primary">
            {event.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{event.location}</p>
        </div>
      </Link>
    </article>
  );
}

export function EventsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <p className="font-display text-xl text-foreground">No upcoming events yet</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Check back soon, or join the email list so you hear about the next gathering first.
      </p>
      <Button asChild className="mt-6">
        <Link href="/join">Join Our Community</Link>
      </Button>
    </div>
  );
}
