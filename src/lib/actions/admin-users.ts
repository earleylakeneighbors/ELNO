"use server";

import {
  createAdminUser,
  deleteAdminUser,
  getProfileByUserId,
  listAdminUsers,
} from "@/lib/data";
import { requireAdmin } from "@/lib/actions/admin";
import { createAdminSchema, type ActionResult } from "@/lib/validations";
import type { Profile } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function listAdminsAction(): Promise<ActionResult<Profile[]>> {
  await requireAdmin();
  try {
    const data = await listAdminUsers();
    return { success: true, data };
  } catch (err) {
    console.error("listAdminsAction", err);
    return { success: false, error: "Could not load admin users." };
  }
}

export async function createAdminAction(
  _prev: ActionResult<Profile> | null,
  formData: FormData,
): Promise<ActionResult<Profile>> {
  await requireAdmin();

  const parsed = createAdminSchema.safeParse({
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const profile = await createAdminUser(parsed.data);
    revalidatePath("/admin/users");
    return {
      success: true,
      data: profile,
      message: "Admin account created. They can sign in with this email and password.",
    };
  } catch (err) {
    console.error("createAdminAction", err);
    const message = err instanceof Error ? err.message : "Could not create admin.";
    return { success: false, error: message };
  }
}

export async function deleteAdminAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await deleteAdminUser(id);
    revalidatePath("/admin/users");
    return { success: true, message: "Admin removed." };
  } catch (err) {
    console.error("deleteAdminAction", err);
    const message = err instanceof Error ? err.message : "Could not remove admin.";
    return { success: false, error: message };
  }
}

export async function verifyAdminProfile(userId: string): Promise<boolean> {
  const profile = await getProfileByUserId(userId);
  return profile?.role === "admin";
}
