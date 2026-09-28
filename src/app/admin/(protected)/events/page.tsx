import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { getAllEventsAdmin } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { EventsBoard } from "@/components/admin/events-board";

export const metadata: Metadata = {
  title: "Manage Events",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  const events = await getAllEventsAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community"
        title="Events"
        description="Plan gatherings, publish them to the calendar, and keep past events on record."
        actions={
          <Button asChild>
            <Link href="/admin/events/new">
              <CalendarPlus className="h-4 w-4" /> New event
            </Link>
          </Button>
        }
      />
      <EventsBoard events={events} />
    </div>
  );
}
