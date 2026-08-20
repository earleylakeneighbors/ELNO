import type { Metadata } from "next";
import { getMessages } from "@/lib/data";
import { MessagesClient } from "@/components/admin/messages-client";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl">Messages</h1>
        <p className="mt-2 text-muted-foreground">Contact form submissions from the website.</p>
      </header>
      <div className="mt-8">
        <MessagesClient
          messages={messages.map((m) => ({
            ...m,
            created_label: formatDate(m.created_at),
          }))}
        />
      </div>
    </div>
  );
}
