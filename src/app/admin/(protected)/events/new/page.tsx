import type { Metadata } from "next";
import { EventForm } from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/page-header";
import { BackLink } from "@/components/admin/back-link";

export const metadata: Metadata = {
  title: "New Event",
  robots: { index: false, follow: false },
};

export default function NewEventPage() {
  return (
    <div>
      <BackLink href="/admin/events" label="All events" />
      <PageHeader eyebrow="Events" title="New event" description="Save as a draft while you plan, then publish when it's ready." />
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}
