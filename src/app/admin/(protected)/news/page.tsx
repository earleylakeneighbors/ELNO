import type { Metadata } from "next";
import Link from "next/link";
import { getAllNewsAdmin } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteNewsButton } from "@/components/admin/delete-buttons";

export const metadata: Metadata = {
  title: "Manage News",
  robots: { index: false, follow: false },
};

export default async function AdminNewsPage() {
  const posts = await getAllNewsAdmin();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">News</h1>
          <p className="mt-2 text-muted-foreground">Announcements and community updates.</p>
        </div>
        <Button asChild>
          <Link href="/admin/news/new">New post</Link>
        </Button>
      </header>
      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">{formatDate(p.updated_at)}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      p.status === "published"
                        ? "success"
                        : p.status === "draft"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/news/${p.id}`}>Edit</Link>
                    </Button>
                    <DeleteNewsButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
