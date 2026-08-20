import Image from "next/image";
import type { PossibleEvent } from "@/lib/content/possible-events";
import { Badge } from "@/components/ui/badge";

export function PossibleEventCard({ event }: { event: PossibleEvent }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-[var(--motion-med)] ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={event.image}
          alt=""
          fill
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <Badge variant="secondary">Coming soon</Badge>
        <h3 className="mt-3 font-display text-xl text-foreground">{event.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      </div>
    </article>
  );
}
