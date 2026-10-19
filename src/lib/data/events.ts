import type { Event } from "@/lib/types";
import { newId, store } from "./mock/store";
import { createServiceRoleClient } from "@/lib/supabase/server";

function useLiveEvents(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to read/write events when Supabase is configured.",
    );
  }
  return true;
}

function mapRow(row: Record<string, unknown>): Event {
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

function eventInsertPayload(data: Omit<Event, "id" | "created_at" | "updated_at">) {
  return {
    title: data.title.trim(),
    slug: data.slug.trim(),
    description: data.description.trim(),
    location: data.location.trim(),
    start_at: data.start_at,
    end_at: data.end_at,
    image_url: data.image_url?.trim() || null,
    status: data.status,
  };
}

async function fetchAllEvents(): Promise<Event[]> {
  if (useLiveEvents()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  }

  return store.events.map((e) => structuredClone(e));
}

export async function getPublishedEvents(): Promise<Event[]> {
  const events = await fetchAllEvents();
  return events
    .filter((e) => e.status === "published" || e.status === "archived")
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .map((e) => structuredClone(e));
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  const now = Date.now();
  const list = (await fetchAllEvents())
    .filter((e) => e.status === "published" && new Date(e.start_at).getTime() >= now)
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  return (limit ? list.slice(0, limit) : list).map((e) => structuredClone(e));
}

export async function getPastEvents(): Promise<Event[]> {
  const now = Date.now();
  return (await fetchAllEvents())
    .filter(
      (e) =>
        (e.status === "published" || e.status === "archived") &&
        new Date(e.start_at).getTime() < now,
    )
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .map((e) => structuredClone(e));
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (useLiveEvents()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .in("status", ["published", "archived"])
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data as Record<string, unknown>) : null;
  }

  const event = store.events.find(
    (e) => e.slug === slug && (e.status === "published" || e.status === "archived"),
  );
  return event ? structuredClone(event) : null;
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  const events = await fetchAllEvents();
  return events
    .slice()
    .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
    .map((e) => structuredClone(e));
}

export async function getEventById(id: string): Promise<Event | null> {
  if (useLiveEvents()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data as Record<string, unknown>) : null;
  }

  const event = store.events.find((e) => e.id === id);
  return event ? structuredClone(event) : null;
}

export async function createEvent(
  data: Omit<Event, "id" | "created_at" | "updated_at">,
): Promise<Event> {
  if (useLiveEvents()) {
    const supabase = createServiceRoleClient();
    const { data: row, error } = await supabase
      .from("events")
      .insert(eventInsertPayload(data))
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") {
        throw new Error("DUPLICATE_SLUG");
      }
      throw new Error(error.message);
    }
    return mapRow(row as Record<string, unknown>);
  }

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
  if (useLiveEvents()) {
    const supabase = createServiceRoleClient();
    const existing = await getEventById(id);
    if (!existing) return null;

    const merged = { ...existing, ...patch };
    const { data, error } = await supabase
      .from("events")
      .update({
        ...eventInsertPayload(merged),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") {
        throw new Error("DUPLICATE_SLUG");
      }
      throw new Error(error.message);
    }
    return mapRow(data as Record<string, unknown>);
  }

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
  if (useLiveEvents()) {
    const supabase = createServiceRoleClient();
    const { error, count } = await supabase.from("events").delete({ count: "exact" }).eq("id", id);
    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  }

  const before = store.events.length;
  store.events = store.events.filter((e) => e.id !== id);
  return store.events.length < before;
}
