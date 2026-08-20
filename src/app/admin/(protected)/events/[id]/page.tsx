import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data";
import { EventForm } from "@/components/admin/event-form";

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
      <h1 className="font-display text-3xl">Edit event</h1>
      <div className="mt-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}
