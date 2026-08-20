import type {
  ContactMessage,
  Event,
  MediaItem,
  NewsPost,
  SiteSettings,
  Subscriber,
} from "@/lib/types";
import {
  defaultSettings,
  seedEvents,
  seedMedia,
  seedMessages,
  seedNews,
  seedSubscribers,
} from "./seed";

/**
 * In-memory mock store for frontend development.
 * Replace with Supabase repositories when the project is connected.
 */
class MockStore {
  subscribers: Subscriber[] = structuredClone(seedSubscribers);
  events: Event[] = structuredClone(seedEvents);
  news: NewsPost[] = structuredClone(seedNews);
  messages: ContactMessage[] = structuredClone(seedMessages);
  media: MediaItem[] = structuredClone(seedMedia);
  settings: SiteSettings = structuredClone(defaultSettings);
  adminSession = false;
}

const globalForStore = globalThis as unknown as { __elnoStore?: MockStore };

export const store = globalForStore.__elnoStore ?? new MockStore();

if (process.env.NODE_ENV !== "production") {
  globalForStore.__elnoStore = store;
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
