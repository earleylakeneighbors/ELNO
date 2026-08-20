import type { Metadata } from "next";
import { EventForm } from "@/components/admin/event-form";

export const metadata: Metadata = {
  title: "New Event",
  robots: { index: false, follow: false },
};

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">New event</h1>
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}
