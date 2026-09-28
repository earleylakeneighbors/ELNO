import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";
import { getMedia } from "@/lib/data";
import { MediaForm } from "@/components/admin/media-form";
import { PageHeader, EmptyState } from "@/components/admin/page-header";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const media = await getMedia();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Media"
        description="Every image the site can use. Supabase Storage uploads will land here once it's connected."
      />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <MediaForm />
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-lg">Library</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
              {media.length} {media.length === 1 ? "file" : "files"}
            </span>
          </div>
          {media.length === 0 ? (
            <EmptyState
              illustration="photos"
              title="No media yet"
              description="Add your first image with the form."
              className="m-5 border-0 bg-muted/30"
            />
          ) : (
            <ul className="divide-y divide-border">
              {media.map((m) => (
                <li key={m.id} className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={m.public_url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={m.public_url}
                      target="_blank"
                      rel="noopener"
                      className="block truncate text-sm font-medium text-foreground hover:text-primary"
                    >
                      {m.filename}
                    </a>
                    <p className="truncate text-xs text-muted-foreground">{m.caption || "No caption"}</p>
                  </div>
                  {m.featured ? (
                    <span className="hidden items-center gap-1 rounded-full bg-amber-100/70 px-2 py-0.5 text-[11px] font-medium text-amber-800 sm:inline-flex">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Featured
                    </span>
                  ) : null}
                  <span className="hidden shrink-0 text-xs text-muted-foreground md:block">
                    {formatDate(m.created_at, { month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
