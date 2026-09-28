"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { format } from "date-fns";
import { ExternalLink, Pencil, Search } from "lucide-react";
import type { ContentStatus, NewsPost } from "@/lib/types";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { StatusPill, contentStatusTone } from "@/components/ui/status-pill";
import { DeleteNewsButton } from "@/components/admin/delete-buttons";
import { EmptyState } from "@/components/admin/page-header";

type Filter = "all" | ContentStatus;

export function NewsBoard({ posts }: { posts: NewsPost[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const count = (s: ContentStatus) => posts.filter((p) => p.status === s).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (filter === "all" || p.status === filter) &&
        (!q || `${p.title} ${p.excerpt}`.toLowerCase().includes(q)),
    );
  }, [posts, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AnimatedTabs
          ariaLabel="Filter posts"
          value={filter}
          onChange={setFilter}
          items={[
            { value: "all", label: "All", count: posts.length },
            { value: "published", label: "Published", count: count("published") },
            { value: "draft", label: "Drafts", count: count("draft") },
            { value: "archived", label: "Archived", count: count("archived") },
          ]}
        />
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search posts</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          illustration={query ? "search" : "news"}
          title={query ? "No posts match" : "No posts here yet"}
          description={query ? "Try another word from the title or excerpt." : "Share neighborhood news, updates, and reminders."}
          action={
            <Link href="/admin/news/new" className="text-sm font-medium text-primary hover:underline">
              + Write a post
            </Link>
          }
        />
      ) : (
        <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 9) * 0.035 } }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg motion-reduce:transform-none"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {p.featured_image_url ? (
                    <Image
                      src={p.featured_image_url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="admin-grid-bg flex h-full items-center justify-center">
                      <span className="font-display text-4xl text-primary/30">ELNO</span>
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    <StatusPill tone={contentStatusTone(p.status)} className="bg-card/90 backdrop-blur">
                      {p.status}
                    </StatusPill>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {p.published_at && p.status === "published"
                      ? `Published ${format(new Date(p.published_at), "MMM d, yyyy")}`
                      : `Updated ${format(new Date(p.updated_at), "MMM d, yyyy")}`}
                  </p>
                  <Link
                    href={`/admin/news/${p.id}`}
                    className="mt-1.5 font-display text-lg leading-snug text-foreground after:absolute after:inset-0 group-hover:text-primary"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="relative z-10 mt-auto flex items-center justify-between pt-4">
                    <span className="text-xs text-muted-foreground">{p.author_name ?? "ELNO"}</span>
                    <div className="flex items-center gap-0.5">
                      {p.status === "published" ? (
                        <a
                          href={`/news/${p.slug}`}
                          target="_blank"
                          rel="noopener"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label={`View ${p.title} on site`}
                          title="View on site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                      <Link
                        href={`/admin/news/${p.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={`Edit ${p.title}`}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteNewsButton id={p.id} title={p.title} />
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
