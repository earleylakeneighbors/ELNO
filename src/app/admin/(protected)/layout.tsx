import { redirect } from "next/navigation";
import { countUnreadMessages, isAdminAuthenticated } from "@/lib/data";
import { getAdminIdentity } from "@/lib/auth/admin-identity";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { CommandPalette } from "@/components/admin/command-palette";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  const [unreadCount, admin] = await Promise.all([
    countUnreadMessages().catch(() => 0),
    getAdminIdentity(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminNav unreadCount={unreadCount} admin={admin} />
      <div className="min-w-0 flex-1">
        <AdminTopbar />
        <main className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6 md:pb-16 md:pt-8">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
