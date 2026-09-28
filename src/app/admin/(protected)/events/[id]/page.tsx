import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data";
import { EventForm } from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/page-header";
import { BackLink } from "@/components/admin/back-link";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit Event",
  robots: { index: false, follow: false },
};

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div>
      <BackLink href="/admin/events" label="All events" />
      <PageHeader eyebrow="Edit event" title={event.title} />
      <div className="mt-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}
