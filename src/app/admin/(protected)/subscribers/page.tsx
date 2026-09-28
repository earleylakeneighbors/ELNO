import type { Metadata } from "next";
import { listSubscribersAdmin } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SubscribersClient } from "@/components/admin/subscribers-client";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Email List Subscribers",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await listSubscribersAdmin({ sort: "newest" });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community"
        title="Email list"
        description="Neighbors who signed up through the website. Click anyone to see their details."
      />
      <SubscribersClient
        subscribers={subscribers.map((s) => ({
          ...s,
          created_label: formatDate(s.created_at),
        }))}
      />
    </div>
  );
}
