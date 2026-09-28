import { defaultSettings } from "./mock/seed";
import { store } from "./mock/store";
import { createServiceRoleClient } from "@/lib/supabase/server";

const ROW_ID = "default";

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
  if (!useLiveSettings()) {
    return store.settings.signup_notify_email || defaultSettings.signup_notify_email;
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("signup_notify_settings")
    .select("signup_notify_email")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (data?.signup_notify_email) {
    return String(data.signup_notify_email).trim().toLowerCase();
  }

  return defaultSettings.signup_notify_email;
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
