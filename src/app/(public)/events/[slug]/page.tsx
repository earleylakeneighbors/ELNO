import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getPastEvents, getPublishedEvents } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/utils";
import { ArticleShell } from "@/components/site/article-shell";
import { ArrowLink } from "@/components/site/arrow-link";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <ArticleShell
        backHref="/events"
        backLabel="All events"
        eyebrow={isPast ? "Past event" : "Upcoming event"}
        title={event.title}
        image={event.image_url}
        facts={[
          { label: "Date", value: formatDate(event.start_at) },
          {
            label: "Time",
            value: `${formatTime(event.start_at)}${event.end_at ? ` – ${formatTime(event.end_at)}` : ""}`,
          },
          { label: "Where", value: event.location },
        ]}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-muted-foreground">Want reminders for gatherings like this?</p>
            <ArrowLink href="/join">Join the email list</ArrowLink>
          </div>
        }
      >
        {event.description}
      </ArticleShell>
    </>
  );
}
