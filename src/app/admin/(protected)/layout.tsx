import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/data";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 md:py-8">{children}</div>
      </div>
    </div>
  );
}
