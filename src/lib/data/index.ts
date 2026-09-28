import type {
  ContentStatus,
  Event,
  MediaItem,
  NewsPost,
  SiteSettings,
} from "@/lib/types";
import { newId, store } from "./mock/store";
import {
  isAdminAuthenticated as cookieIsAdminAuthenticated,
  setAdminSession as cookieSetAdminSession,
} from "@/lib/auth/admin-session";

export {
  getDashboardStats,
  getUpcomingEventsLive,
  isDashboardLive,
} from "./dashboard";

// ——— Settings ———

export async function getSettings(): Promise<SiteSettings> {
  return structuredClone(store.settings);
}

export async function updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  store.settings = { ...store.settings, ...patch };
  return structuredClone(store.settings);
}

// ——— Events ———

export async function getPublishedEvents(): Promise<Event[]> {
  return store.events
    .filter((e) => e.status === "published" || e.status === "archived")
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .map((e) => structuredClone(e));
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const now = Date.now();
  const list = store.events
    .filter((e) => e.status === "published" && new Date(e.start_at).getTime() >= now)
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  return (limit ? list.slice(0, limit) : list).map((e) => structuredClone(e));
}

export async function getPastEvents(): Promise<Event[]> {
  const now = Date.now();
  return store.events
    .filter(
      (e) =>
        (e.status === "published" || e.status === "archived") &&
        new Date(e.start_at).getTime() < now,
    )
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .map((e) => structuredClone(e));
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const event = store.events.find(
    (e) => e.slug === slug && (e.status === "published" || e.status === "archived"),
  );
  return event ? structuredClone(event) : null;
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  return store.events
    .slice()
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .map((e) => structuredClone(e));
}

export async function getEventById(id: string): Promise<Event | null> {
  const event = store.events.find((e) => e.id === id);
  return event ? structuredClone(event) : null;
}

export async function createEvent(
  data: Omit<Event, "id" | "created_at" | "updated_at">,
): Promise<Event> {
  const now = new Date().toISOString();
  const event: Event = {
    ...data,
    id: newId("evt"),
    created_at: now,
    updated_at: now,
  };
  store.events.unshift(event);
  return structuredClone(event);
}

export async function updateEvent(
  id: string,
  patch: Partial<Omit<Event, "id" | "created_at">>,
): Promise<Event | null> {
  const idx = store.events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  store.events[idx] = {
    ...store.events[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return structuredClone(store.events[idx]);
}

export async function deleteEvent(id: string): Promise<boolean> {
  const before = store.events.length;
  store.events = store.events.filter((e) => e.id !== id);
  return store.events.length < before;
}

// ——— News ———

export async function getPublishedNews(limit?: number): Promise<NewsPost[]> {
  const list = store.news
    .filter((n) => n.status === "published")
    .sort(
      (a, b) =>
        new Date(b.published_at ?? b.created_at).getTime() -
        new Date(a.published_at ?? a.created_at).getTime(),
    );
  return (limit ? list.slice(0, limit) : list).map((n) => structuredClone(n));
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const post = store.news.find((n) => n.slug === slug && n.status === "published");
  return post ? structuredClone(post) : null;
}

export async function getAllNewsAdmin(): Promise<NewsPost[]> {
  return store.news
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((n) => structuredClone(n));
}

export async function getNewsById(id: string): Promise<NewsPost | null> {
  const post = store.news.find((n) => n.id === id);
  return post ? structuredClone(post) : null;
}

export async function createNews(
  data: Omit<NewsPost, "id" | "created_at" | "updated_at">,
): Promise<NewsPost> {
  const now = new Date().toISOString();
  const post: NewsPost = {
    ...data,
    id: newId("news"),
    created_at: now,
    updated_at: now,
  };
  store.news.unshift(post);
  return structuredClone(post);
}

export async function updateNews(
  id: string,
  patch: Partial<Omit<NewsPost, "id" | "created_at">>,
): Promise<NewsPost | null> {
  const idx = store.news.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  store.news[idx] = {
    ...store.news[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  return structuredClone(store.news[idx]);
}

export async function deleteNews(id: string): Promise<boolean> {
  const before = store.news.length;
  store.news = store.news.filter((n) => n.id !== id);
  return store.news.length < before;
}

// ——— Subscribers ———
export {
  getSubscribers,
  listSubscribersAdmin,
  getSubscriberById,
  findSubscriberByEmail,
  createSubscriber,
  deleteSubscriber,
  deleteSubscribersBulk,
  subscribersToExcelRows,
} from "./subscribers";
export type { SubscriberSort, ListSubscribersOptions } from "./subscribers";

// ——— Messages ———
export {
  getMessages,
  createMessage,
  updateMessageStatus,
  deleteMessage,
  countUnreadMessages,
} from "./messages";

export {
  insertCronKeepaliveLog,
  listCronKeepaliveLogs,
  isCronKeepaliveLogsConfigured,
  CRON_KEEPALIVE_LOG_PAGE_SIZE,
} from "./cron-keepalive-logs";
export type { CronKeepaliveLogInsert, CronKeepaliveLogListResult } from "./cron-keepalive-logs";

// ——— Media ———

export async function getMedia(): Promise<MediaItem[]> {
  return store.media
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((m) => structuredClone(m));
}

export async function getFeaturedGallery(): Promise<MediaItem[]> {
  return store.media
    .filter((m) => m.featured)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((m) => structuredClone(m));
}

export async function createMedia(
  data: Omit<MediaItem, "id" | "created_at">,
): Promise<MediaItem> {
  const item: MediaItem = {
    ...data,
    id: newId("media"),
    created_at: new Date().toISOString(),
  };
  store.media.unshift(item);
  return structuredClone(item);
}

export async function updateMedia(
  id: string,
  patch: Partial<Omit<MediaItem, "id" | "created_at">>,
): Promise<MediaItem | null> {
  const idx = store.media.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  store.media[idx] = { ...store.media[idx], ...patch };
  return structuredClone(store.media[idx]);
}

export async function deleteMedia(id: string): Promise<boolean> {
  const before = store.media.length;
  store.media = store.media.filter((m) => m.id !== id);
  return store.media.length < before;
}

// ——— Dashboard (see ./dashboard.ts) ———

// ——— Auth session (httpOnly cookie) ———

export async function isAdminAuthenticated(): Promise<boolean> {
  return cookieIsAdminAuthenticated();
}

export async function setAdminSession(value: boolean): Promise<void> {
  await cookieSetAdminSession(value);
}

// ——— Admin users ———
export {
  listAdminUsers,
  getAdminById,
  createAdminUser,
  deleteAdminUser,
  getProfileByUserId,
} from "./admin-users";
export type { CreateAdminInput } from "./admin-users";

export type { ContentStatus };
