import type { Metadata } from "next";
import { format, startOfWeek, subDays, subWeeks } from "date-fns";
import {
  getDashboardStats,
  getMessages,
  getSubscribers,
  getUpcomingEventsLive,
} from "@/lib/data";
import { getAdminIdentity } from "@/lib/auth/admin-identity";
import { DashboardHero } from "@/components/admin/dashboard/hero";
import { DashboardStatCards, type WeeklySignups } from "@/components/admin/dashboard/stat-cards";
import { DashboardRecentMessages } from "@/components/admin/dashboard/recent-messages";
import { DashboardUpcomingEvents } from "@/components/admin/dashboard/upcoming-events";
import { DashboardQuickActions } from "@/components/admin/dashboard/quick-actions";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const WEEKS = 12;

function weeklySignups(dates: string[]): WeeklySignups {
  const thisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const buckets = Array.from({ length: WEEKS }, (_, i) => {
    const start = subWeeks(thisWeek, WEEKS - 1 - i);
    return { start, label: format(start, "MMM d"), count: 0 };
  });
  for (const iso of dates) {
    const t = new Date(iso).getTime();
    for (let i = buckets.length - 1; i >= 0; i--) {
      if (t >= buckets[i].start.getTime()) {
        buckets[i].count++;
        break;
      }
    }
  }
  return buckets.map(({ label, count }) => ({ label, count }));
}

export default async function AdminDashboardPage() {
  const [stats, messages, events, subscribers, admin] = await Promise.all([
    getDashboardStats(),
    getMessages(),
    getUpcomingEventsLive(5),
    getSubscribers(),
    getAdminIdentity(),
  ]);

  const created = subscribers.map((s) => s.created_at);
  const monthAgo = subDays(new Date(), 30).getTime();
  const newThisMonth = created.filter((d) => new Date(d).getTime() >= monthAgo).length;
  const next = events[0] ?? null;

  return (
    <div className="space-y-8">
      <DashboardHero
        name={admin?.name || null}
        unread={stats.unreadMessages}
        nextEvent={next ? { id: next.id, title: next.title, start_at: next.start_at } : null}
      />

      <DashboardStatCards stats={stats} weeks={weeklySignups(created)} newThisMonth={newThisMonth} />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <DashboardRecentMessages messages={messages.slice(0, 5)} />
        <DashboardUpcomingEvents events={events} />
      </div>

      <DashboardQuickActions />
    </div>
  );
}
