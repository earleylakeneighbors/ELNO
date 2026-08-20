import type { Metadata } from "next";
import Link from "next/link";
import { getAllEventsAdmin } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteEventButton } from "@/components/admin/delete-buttons";

export const metadata: Metadata = {
  title: "Manage Events",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  const events = await getAllEventsAdmin();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Events</h1>
          <p className="mt-2 text-muted-foreground">Create and publish community events.</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">New event</Link>
        </Button>
      </header>
      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{e.title}</td>
                <td className="px-4 py-3">{formatDate(e.start_at)}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      e.status === "published"
                        ? "success"
                        : e.status === "draft"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {e.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/events/${e.id}`}>Edit</Link>
                    </Button>
                    <DeleteEventButton id={e.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
