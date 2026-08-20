import type { Metadata } from "next";
import { listAdminUsers } from "@/lib/data";
import { UsersClient } from "@/components/admin/users-client";

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
    <div>
      <header>
        <h1 className="font-display text-3xl">User management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage who can access the Earley Lake admin dashboard.
        </p>
      </header>
      {loadError ? (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : null}
      <div className="mt-8">
        <UsersClient users={users} />
      </div>
    </div>
  );
}
