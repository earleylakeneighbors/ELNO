import type { Metadata } from "next";
import {
  getDashboardStats,
  getMessages,
  getUpcomingEventsLive,
} from "@/lib/data";
import { DashboardStatCards } from "@/components/admin/dashboard/stat-cards";
import { DashboardRecentMessages } from "@/components/admin/dashboard/recent-messages";
import { DashboardUpcomingEvents } from "@/components/admin/dashboard/upcoming-events";
import { DashboardQuickActions } from "@/components/admin/dashboard/quick-actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, messages, events] = await Promise.all([
    getDashboardStats(),
    getMessages(),
    getUpcomingEventsLive(5),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Overview
        </p>
        <h1 className="mt-1 font-display text-3xl text-foreground sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Live snapshot of Earley Lake neighborhood activity across email, events,
          news, and messages.
        </p>
      </header>

      <DashboardStatCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <DashboardRecentMessages messages={messages.slice(0, 5)} />
        <DashboardUpcomingEvents events={events} />
      </div>

      <DashboardQuickActions />
    </div>
  );
}
