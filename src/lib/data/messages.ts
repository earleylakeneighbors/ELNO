import type { ContactMessage, MessageStatus } from "@/lib/types";
import { newId, store } from "./mock/store";
import { createServiceRoleClient } from "@/lib/supabase/server";

/** Use live Supabase whenever the project URL is set; require the service role key. */
function useLiveMessages(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to read/write contact messages when Supabase is configured.",
    );
  }
  return true;
}

function mapRow(row: Record<string, unknown>): ContactMessage {
  const status = String(row.status);
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: (row.phone as string | null) ?? null,
    subject: String(row.subject),
    message: String(row.message),
    status:
      status === "read" ||
      status === "replied" ||
      status === "archived" ||
      status === "unread"
        ? status
        : "unread",
    created_at: String(row.created_at),
  };
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (useLiveMessages()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  }

  return store.messages
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((m) => structuredClone(m));
}

export async function countUnreadMessages(): Promise<number> {
  if (useLiveMessages()) {
    const supabase = createServiceRoleClient();
    const { count, error } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread");
    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  return store.messages.filter((m) => m.status === "unread").length;
}

export async function createMessage(
  data: Omit<ContactMessage, "id" | "created_at" | "status">,
): Promise<ContactMessage> {
  if (useLiveMessages()) {
    const supabase = createServiceRoleClient();
    const { data: row, error } = await supabase
      .from("contact_messages")
      .insert({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        subject: data.subject.trim(),
        message: data.message.trim(),
        status: "unread",
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapRow(row as Record<string, unknown>);
  }

  const message: ContactMessage = {
    ...data,
    id: newId("msg"),
    status: "unread",
    created_at: new Date().toISOString(),
  };
  store.messages.unshift(message);
  return structuredClone(message);
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<ContactMessage | null> {
  if (useLiveMessages()) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data as Record<string, unknown>) : null;
  }

  const idx = store.messages.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  store.messages[idx] = { ...store.messages[idx], status };
  return structuredClone(store.messages[idx]);
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (useLiveMessages()) {
    const supabase = createServiceRoleClient();
    const { error, count } = await supabase
      .from("contact_messages")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw new Error(error.message);
    return (count ?? 0) > 0;
  }

  const before = store.messages.length;
  store.messages = store.messages.filter((m) => m.id !== id);
  return store.messages.length < before;
}
