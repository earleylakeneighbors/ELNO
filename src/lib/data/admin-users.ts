import type { Profile } from "@/lib/types";
import { createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server";

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    email: String(row.email),
    full_name: String(row.full_name ?? ""),
    role: row.role === "admin" ? "admin" : "member",
    created_at: String(row.created_at),
  };
}

export async function listAdminUsers(): Promise<Profile[]> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "admin")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapProfile(row as Record<string, unknown>));
}

export async function getAdminById(id: string): Promise<Profile | null> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProfile(data as Record<string, unknown>) : null;
}

export type CreateAdminInput = {
  email: string;
  full_name: string;
  password: string;
};

export async function createAdminUser(input: CreateAdminInput): Promise<Profile> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured.");
  }

  const supabase = createServiceRoleClient();
  const email = input.email.toLowerCase().trim();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.full_name.trim() },
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message ?? "Could not create auth user.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: authData.user.id,
        email,
        full_name: input.full_name.trim(),
        role: "admin",
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (profileError || !profile) {
    // Roll back auth user if profile insert fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(profileError?.message ?? "Could not create admin profile.");
  }

  return mapProfile(profile as Record<string, unknown>);
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured.");
  }

  const supabase = createServiceRoleClient();

  const { error: profileError } = await supabase.from("profiles").delete().eq("id", id);
  if (profileError) throw new Error(profileError.message);

  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) throw new Error(authError.message);

  return true;
}

export async function getProfileByUserId(id: string): Promise<Profile | null> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProfile(data as Record<string, unknown>) : null;
}
