import type { Subscriber } from "@/lib/types";
import { newId, store } from "./mock/store";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type SubscriberSort = "newest" | "oldest" | "name_asc" | "name_desc";

export type ListSubscribersOptions = {
  search?: string;
  sort?: SubscriberSort;
};

/** Use live Supabase whenever the project URL is set; require the service role key. */
function useLiveSubscribers(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to read/write subscribers when Supabase is configured.",
    );
  }
  return true;
}

function mapRow(row: Record<string, unknown>): Subscriber {
  return {
    id: String(row.id),
    email: String(row.email),
    first_name: String(row.first_name),
    last_name: (row.last_name as string | null) ?? null,
    street_address: (row.street_address as string | null) ?? null,
    interests: (row.interests as string | null) ?? null,
    consent: Boolean(row.consent),
    created_at: String(row.created_at),
  };
}

function displayName(s: Subscriber) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ").toLowerCase();
}

function filterAndSort(
  rows: Subscriber[],
  options: ListSubscribersOptions = {},
): Subscriber[] {
  const search = options.search?.trim().toLowerCase() ?? "";
  const sort = options.sort ?? "newest";

  let list = rows;
  if (search) {
    list = list.filter(
      (s) =>
        displayName(s).includes(search) ||
        s.email.toLowerCase().includes(search) ||
        (s.street_address ?? "").toLowerCase().includes(search) ||
        (s.interests ?? "").toLowerCase().includes(search),
    );
  }

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "name_asc":
        return displayName(a).localeCompare(displayName(b));
      case "name_desc":
        return displayName(b).localeCompare(displayName(a));
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return list;
}

async function fetchAllSubscribers(): Promise<Subscriber[]> {
  if (useLiveSubscribers()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  }

  return store.subscribers.map((s) => structuredClone(s));
}

export async function getSubscribers(): Promise<Subscriber[]> {
  return listSubscribersAdmin({ sort: "newest" });
}

export async function listSubscribersAdmin(
  options: ListSubscribersOptions = {},
): Promise<Subscriber[]> {
  const rows = await fetchAllSubscribers();
  return filterAndSort(rows, options);
}

export async function getSubscriberById(id: string): Promise<Subscriber | null> {
  if (useLiveSubscribers()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data as Record<string, unknown>) : null;
  }

  const found = store.subscribers.find((s) => s.id === id);
  return found ? structuredClone(found) : null;
}

export async function findSubscriberByEmail(email: string): Promise<Subscriber | null> {
  if (useLiveSubscribers()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data as Record<string, unknown>) : null;
  }

  const found = store.subscribers.find(
    (s) => s.email.toLowerCase() === email.toLowerCase(),
  );
  return found ? structuredClone(found) : null;
}

export async function createSubscriber(
  data: Omit<Subscriber, "id" | "created_at">,
): Promise<Subscriber> {
  if (useLiveSubscribers()) {
    const supabase = createServiceRoleClient();
    const { data: row, error } = await supabase
      .from("subscribers")
      .insert({
        email: data.email.toLowerCase().trim(),
        first_name: data.first_name.trim(),
        last_name: data.last_name?.trim() || null,
        street_address: data.street_address?.trim() || null,
        interests: data.interests?.trim() || null,
        consent: data.consent,
      })
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") {
        throw new Error("DUPLICATE_EMAIL");
      }
      throw new Error(error.message);
    }
    return mapRow(row as Record<string, unknown>);
  }

  const subscriber: Subscriber = {
    ...data,
    id: newId("sub"),
    created_at: new Date().toISOString(),
  };
  store.subscribers.unshift(subscriber);
  return structuredClone(subscriber);
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  if (useLiveSubscribers()) {
    const supabase = createServiceRoleClient();
    const { error, count } = await supabase
      .from("subscribers")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  }

  const before = store.subscribers.length;
  store.subscribers = store.subscribers.filter((s) => s.id !== id);
  return store.subscribers.length < before;
}

export async function deleteSubscribersBulk(ids: string[]): Promise<number> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return 0;

  if (useLiveSubscribers()) {
    const supabase = createServiceRoleClient();
    const { error, count } = await supabase
      .from("subscribers")
      .delete({ count: "exact" })
      .in("id", unique);
    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  const before = store.subscribers.length;
  const idSet = new Set(unique);
  store.subscribers = store.subscribers.filter((s) => !idSet.has(s.id));
  return before - store.subscribers.length;
}

export function subscribersToExcelRows(subscribers: Subscriber[]) {
  return subscribers.map((s) => ({
    "First name": s.first_name,
    "Last name": s.last_name ?? "",
    Email: s.email,
    "Street address": s.street_address ?? "",
    Interests: s.interests ?? "",
    Consent: s.consent ? "Yes" : "No",
    Submitted: s.created_at,
  }));
}
