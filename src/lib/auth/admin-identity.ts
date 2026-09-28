import { cache } from "react";
import { getProfileByUserId } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export type AdminIdentity = { name: string; email: string } | null;

/** Name and email of the signed-in admin, when Supabase Auth has a session. */
export const getAdminIdentity = cache(async (): Promise<AdminIdentity> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    const profile = await getProfileByUserId(data.user.id);
    return {
      name: profile?.full_name ?? "",
      email: profile?.email ?? data.user.email ?? "",
    };
  } catch {
    return null;
  }
});
