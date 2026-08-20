import type { Metadata } from "next";
import { listSubscribersAdmin } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SubscribersClient } from "@/components/admin/subscribers-client";

export const metadata: Metadata = {
  title: "Email List Subscribers",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await listSubscribersAdmin({ sort: "newest" });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Email list</h1>
          <p className="mt-2 text-muted-foreground">
            {subscribers.length}{" "}
            {subscribers.length === 1 ? "person" : "people"} signed up through the website
          </p>
        </div>
      </header>
      <div className="mt-8">
        <SubscribersClient
          subscribers={subscribers.map((s) => ({
            ...s,
            created_label: formatDate(s.created_at),
          }))}
        />
      </div>
    </div>
  );
}
