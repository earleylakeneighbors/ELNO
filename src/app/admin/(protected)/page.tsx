import type { Metadata } from "next";
import Link from "next/link";
import {
  getDashboardStats,
  getMessages,
  getUpcomingEvents,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [stats, messages, events] = await Promise.all([
    getDashboardStats(),
    getMessages(),
    getUpcomingEvents(5),
  ]);

  const cards = [
    { label: "Email subscribers", value: stats.subscribers, href: "/admin/subscribers" },
    { label: "Upcoming events", value: stats.upcomingEvents, href: "/admin/events" },
    { label: "Published announcements", value: stats.publishedNews, href: "/admin/news" },
    { label: "Unread messages", value: stats.unreadMessages, href: "/admin/messages" },
    { label: "Gallery images", value: stats.galleryImages, href: "/admin/gallery" },
  ];

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of Earley Lake neighborhood activity.
        </p>
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Using mock data until Supabase is connected. Auth is a temporary stub.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-foreground">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-xl">Recent messages</h2>
          <ul className="mt-4 space-y-3">
            {messages.slice(0, 4).map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{m.subject}</p>
                  <Badge variant={m.status === "unread" ? "warning" : "secondary"}>
                    {m.status}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {m.name} · {formatDate(m.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl">Upcoming events</h2>
          <ul className="mt-4 space-y-3">
            {events.length === 0 ? (
              <li className="text-sm text-muted-foreground">No upcoming events.</li>
            ) : (
              events.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
                >
                  <p className="font-medium">{e.title}</p>
                  <p className="mt-1 text-muted-foreground">{formatDate(e.start_at)}</p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
