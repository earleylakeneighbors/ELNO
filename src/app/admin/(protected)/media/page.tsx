import type { Metadata } from "next";
import { getMedia } from "@/lib/data";
import { MediaForm } from "@/components/admin/media-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const media = await getMedia();

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl">Media</h1>
        <p className="mt-2 text-muted-foreground">
          Mock media library. When Supabase Storage is connected, uploads will go there.
        </p>
      </header>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <MediaForm />
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Caption</th>
                <th className="px-4 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {media.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <a href={m.public_url} className="text-primary hover:underline">
                      {m.filename}
                    </a>
                  </td>
                  <td className="px-4 py-3">{m.caption ?? "—"}</td>
                  <td className="px-4 py-3">{formatDate(m.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
