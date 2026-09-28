import type { Metadata } from "next";
import { getMessages } from "@/lib/data";
import { MessagesClient } from "@/components/admin/messages-client";
import { PageHeader } from "@/components/admin/page-header";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description={
          unread > 0
            ? `${unread} ${unread === 1 ? "note is" : "notes are"} waiting to be read. Replies open in your own email app.`
            : "Every note from the website contact form, ready to read and answer."
        }
      />
      <MessagesClient messages={messages} />
    </div>
  );
}
