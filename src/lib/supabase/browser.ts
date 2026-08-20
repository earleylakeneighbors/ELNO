/**
 * Browser Supabase client — use only after env vars are configured.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars are not configured yet.");
  }
  return createBrowserClient(url, key);
}
