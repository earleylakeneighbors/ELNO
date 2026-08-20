"use server";

import { redirect } from "next/navigation";
import {
  createEvent,
  createMedia,
  createNews,
  deleteEvent,
  deleteMedia,
  deleteMessage,
  deleteNews,
  deleteSubscriber,
  isAdminAuthenticated,
  setAdminSession,
  updateEvent,
  updateMedia,
  updateMessageStatus,
  updateNews,
  updateSettings,
} from "@/lib/data";
import { slugify } from "@/lib/utils";
import {
  eventSchema,
  loginSchema,
  newsSchema,
  settingsSchema,
  type ActionResult,
} from "@/lib/validations";
import type { MessageStatus } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
}

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { success: false, error: "Enter a valid email and password." };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "Authentication is not configured." };
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;

  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase/server");
    const { getProfileByUserId } = await import("@/lib/data");
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: "Invalid email or password." };
    }

    const profile = await getProfileByUserId(data.user.id);
    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      return { success: false, error: "This account is not an admin." };
    }

    await setAdminSession(true);
  } catch (err) {
    console.error("Supabase admin login", err);
    return { success: false, error: "Could not sign in. Please try again." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await setAdminSession(false);
  if (isSupabaseConfigured()) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase/server");
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Supabase admin logout", err);
    }
  }
  redirect("/admin/login");
}

export async function saveEventAction(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const startRaw = String(formData.get("start_at") ?? "");
  const endRaw = String(formData.get("end_at") ?? "");
  const raw = {
    title,
    slug: String(formData.get("slug") ?? "") || slugify(title),
    description: String(formData.get("description") ?? ""),
    location: String(formData.get("location") ?? ""),
    start_at: startRaw ? new Date(startRaw).toISOString() : "",
    end_at: endRaw ? new Date(endRaw).toISOString() : "",
    image_url: String(formData.get("image_url") ?? ""),
    status: String(formData.get("status") ?? "draft"),
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the event form.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const payload = {
    ...parsed.data,
    end_at: parsed.data.end_at || null,
    image_url: parsed.data.image_url || null,
  };

  if (id) {
    const updated = await updateEvent(id, payload);
    if (!updated) return { success: false, error: "Event not found." };
    return { success: true, data: { id }, message: "Event saved." };
  }

  const created = await createEvent(payload);
  return { success: true, data: { id: created.id }, message: "Event created." };
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ok = await deleteEvent(id);
  return ok
    ? { success: true, message: "Event deleted." }
    : { success: false, error: "Could not delete event." };
}

export async function saveNewsAction(
  _prev: ActionResult<{ id: string }> | null,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const raw = {
    title,
    slug: String(formData.get("slug") ?? "") || slugify(title),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    featured_image_url: String(formData.get("featured_image_url") ?? ""),
    status,
  };

  const parsed = newsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the news form.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    featured_image_url: parsed.data.featured_image_url || null,
    status: parsed.data.status,
    author_id: "admin-1",
    author_name: "Earley Lake Organizers",
    published_at:
      parsed.data.status === "published" ? new Date().toISOString() : null,
  };

  if (id) {
    const existingPublishedAt =
      parsed.data.status === "published" ? new Date().toISOString() : null;
    const updated = await updateNews(id, {
      ...payload,
      published_at:
        parsed.data.status === "published"
          ? existingPublishedAt
          : null,
    });
    if (!updated) return { success: false, error: "Post not found." };
    return { success: true, data: { id }, message: "Post saved." };
  }

  const created = await createNews(payload);
  return { success: true, data: { id: created.id }, message: "Post created." };
}

export async function deleteNewsAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ok = await deleteNews(id);
  return ok
    ? { success: true, message: "Post deleted." }
    : { success: false, error: "Could not delete post." };
}

export async function deleteSubscriberAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ok = await deleteSubscriber(id);
  return ok
    ? { success: true, message: "Subscriber removed." }
    : { success: false, error: "Could not remove subscriber." };
}

export async function updateMessageStatusAction(
  id: string,
  status: MessageStatus,
): Promise<ActionResult> {
  await requireAdmin();
  const updated = await updateMessageStatus(id, status);
  return updated
    ? { success: true, message: "Message updated." }
    : { success: false, error: "Message not found." };
}

export async function deleteMessageAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ok = await deleteMessage(id);
  return ok
    ? { success: true, message: "Message deleted." }
    : { success: false, error: "Could not delete message." };
}

export async function saveMediaAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const caption = String(formData.get("caption") ?? "");
  const public_url = String(formData.get("public_url") ?? "");
  const filename = String(formData.get("filename") ?? "image.jpg");
  const featured = formData.get("featured") === "on";

  if (!public_url) {
    return { success: false, error: "Image URL is required (mock storage)." };
  }

  await createMedia({
    file_path: `uploads/${filename}`,
    public_url,
    filename,
    caption: caption || null,
    uploaded_by: "admin-1",
    featured,
  });

  return { success: true, message: "Media added." };
}

export async function updateMediaAction(
  id: string,
  patch: { caption?: string; featured?: boolean },
): Promise<ActionResult> {
  await requireAdmin();
  const updated = await updateMedia(id, patch);
  return updated
    ? { success: true, message: "Media updated." }
    : { success: false, error: "Media not found." };
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ok = await deleteMedia(id);
  return ok
    ? { success: true, message: "Media deleted." }
    : { success: false, error: "Could not delete media." };
}

export async function saveSettingsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const raw = {
    org_name: String(formData.get("org_name") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    location: String(formData.get("location") ?? ""),
    contact_email: String(formData.get("contact_email") ?? ""),
    facebook_url: String(formData.get("facebook_url") ?? ""),
    instagram_url: String(formData.get("instagram_url") ?? ""),
    twitter_url: String(formData.get("twitter_url") ?? ""),
  };

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check settings fields (URLs must be valid if provided).",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await updateSettings(parsed.data);
  return { success: true, message: "Settings saved." };
}
