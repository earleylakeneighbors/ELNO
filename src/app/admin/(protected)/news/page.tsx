import type { Metadata } from "next";
import Link from "next/link";
import { FilePlus2 } from "lucide-react";
import { getAllNewsAdmin } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { NewsBoard } from "@/components/admin/news-board";

export const metadata: Metadata = {
  title: "Manage News",
  robots: { index: false, follow: false },
};

export default async function AdminNewsPage() {
  const posts = await getAllNewsAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community"
        title="News"
        description="Announcements and updates for neighbors. Drafts stay private until you publish."
        actions={
          <Button asChild>
            <Link href="/admin/news/new">
              <FilePlus2 className="h-4 w-4" /> New post
            </Link>
          </Button>
        }
      />
      <NewsBoard posts={posts} />
    </div>
  );
}
