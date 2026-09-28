import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { listAdminUsers } from "@/lib/data";
import { UsersClient } from "@/components/admin/users-client";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "User Management",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users: Awaited<ReturnType<typeof listAdminUsers>> = [];
  let loadError: string | null = null;

  try {
    users = await listAdminUsers();
  } catch (err) {
    console.error(err);
    loadError = "Could not load admin users from Supabase.";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System"
        title="Admins"
        description="The people who can sign in and manage the Earley Lake website."
      />
      {loadError ? (
        <p className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" /> {loadError}
        </p>
      ) : null}
      <UsersClient users={users} />
    </div>
  );
}
