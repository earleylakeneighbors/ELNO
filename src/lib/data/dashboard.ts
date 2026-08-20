import type { DashboardStats, Event } from "@/lib/types";
import { store } from "./mock/store";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSubscribers } from "./subscribers";
import { countUnreadMessages } from "./messages";

function useLiveDashboard(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for dashboard stats when Supabase is configured.",
    );
  }
  return true;
}

function mapEvent(row: Record<string, unknown>): Event {
  const status = String(row.status);
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    location: String(row.location ?? ""),
    start_at: String(row.start_at),
    end_at: (row.end_at as string | null) ?? null,
    image_url: (row.image_url as string | null) ?? null,
    status:
      status === "draft" || status === "published" || status === "archived"
        ? status
        : "draft",
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

async function countTable(
  table: "news_posts" | "media",
  filters?: { column: string; value: string }[],
): Promise<number> {
  const supabase = createServiceRoleClient();
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  for (const f of filters ?? []) {
    query = query.eq(f.column, f.value);
  }
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function countUpcomingEventsLive(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .gte("start_at", new Date().toISOString());
  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Upcoming published events for the admin dashboard. */
export async function getUpcomingEventsLive(limit = 5): Promise<Event[]> {
  if (useLiveDashboard()) {
    const supabase = createServiceRoleClient();
    let query = supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapEvent(row as Record<string, unknown>));
  }

  const now = Date.now();
  const list = store.events
    .filter((e) => e.status === "published" && new Date(e.start_at).getTime() >= now)
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  return (limit ? list.slice(0, limit) : list).map((e) => structuredClone(e));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (useLiveDashboard()) {
    const [subscribers, unreadMessages, upcomingEvents, publishedNews, galleryImages] =
      await Promise.all([
        getSubscribers(),
        countUnreadMessages(),
        countUpcomingEventsLive(),
        countTable("news_posts", [{ column: "status", value: "published" }]),
        countTable("media"),
      ]);

    return {
      subscribers: subscribers.length,
      upcomingEvents,
      publishedNews,
      unreadMessages,
      galleryImages,
    };
  }

  const now = Date.now();
  const [subscribers, unreadMessages] = await Promise.all([
    getSubscribers(),
    countUnreadMessages(),
  ]);

  return {
    subscribers: subscribers.length,
    upcomingEvents: store.events.filter(
      (e) => e.status === "published" && new Date(e.start_at).getTime() >= now,
    ).length,
    publishedNews: store.news.filter((n) => n.status === "published").length,
    unreadMessages,
    galleryImages: store.media.length,
  };
}

/** Whether the dashboard is reading from Supabase. */
export function isDashboardLive(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
