import { defaultSettings } from "./mock/seed";
import { store } from "./mock/store";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ROW_ID = "default";

function canQueryLiveSettings(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function useLiveSettings(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for signup notification settings when Supabase is configured.",
    );
  }
  return true;
}

export async function getSignupNotifyEmail(): Promise<string> {
  const fallback =
    store.settings.signup_notify_email || defaultSettings.signup_notify_email;

  if (!canQueryLiveSettings()) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
      console.warn(
        "[signup_notify_settings] Supabase URL set without service role key; using default notify email.",
      );
    }
    return fallback;
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("signup_notify_settings")
      .select("signup_notify_email")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) {
      console.warn("[signup_notify_settings] read failed; using default notify email.", error.message);
      return defaultSettings.signup_notify_email;
    }

    if (data?.signup_notify_email) {
      return String(data.signup_notify_email).trim().toLowerCase();
    }

    console.warn("[signup_notify_settings] no row found; using default notify email.");
    return defaultSettings.signup_notify_email;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn("[signup_notify_settings] unexpected read error; using default notify email.", message);
    return defaultSettings.signup_notify_email;
  }
}

export async function updateSignupNotifyEmail(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();

  if (!useLiveSettings()) {
    store.settings.signup_notify_email = normalized;
    return;
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("signup_notify_settings").upsert(
    {
      id: ROW_ID,
      signup_notify_email: normalized,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw new Error(error.message);
}
