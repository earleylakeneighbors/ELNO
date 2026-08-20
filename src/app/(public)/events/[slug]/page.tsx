import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventBySlug, getPastEvents, getPublishedEvents } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const events = await getPublishedEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      images: event.image_url ? [event.image_url] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const pastEvents = await getPastEvents();
  const isPast =
    event.status === "archived" || pastEvents.some((e) => e.id === event.id);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.start_at,
    endDate: event.end_at ?? undefined,
    eventStatus: isPast
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressRegion: "MN",
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    image: event.image_url ? [`${SITE.url}${event.image_url}`] : undefined,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <div className="relative isolate min-h-[42vh] overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-3xl items-end px-4 pb-10 sm:px-6">
          <div>
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Past event" : "Upcoming"}
            </Badge>
            <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Date</dt>
            <dd className="mt-1 font-medium">{formatDate(event.start_at)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Time</dt>
            <dd className="mt-1 font-medium">
              {formatTime(event.start_at)}
              {event.end_at ? ` – ${formatTime(event.end_at)}` : ""}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Location</dt>
            <dd className="mt-1 font-medium">{event.location}</dd>
          </div>
        </dl>
        <div className="prose-like mt-8 whitespace-pre-wrap leading-relaxed text-muted-foreground">
          {event.description}
        </div>
        <p className="placeholder-editable mt-8 text-sm">
          [Editable] Registration details can be added here when event signup is enabled.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/join">Join Our Community</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/events">Back to events</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
