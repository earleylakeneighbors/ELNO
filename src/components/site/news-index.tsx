import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { NewsPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** Journal-style list: date column, headline and excerpt, thumbnail on wide screens. */
export function NewsIndex({ posts }: { posts: NewsPost[] }) {
  return (
    <ol className="border-t border-foreground/15">
      {posts.map((post) => {
        const date = post.published_at ?? post.created_at;
        return (
          <li key={post.id} className="border-b border-foreground/15">
            <Link
              href={`/news/${post.slug}`}
              className="group grid gap-x-10 gap-y-3 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[9rem_1fr] lg:grid-cols-[9rem_1fr_11rem]"
            >
              <time dateTime={date} className="pt-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {formatDate(date, { month: "short" })}
              </time>
              <div className="max-w-2xl">
                <h3 className="font-display text-2xl leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[1.75rem]">
                  {post.title}
                  <ArrowUpRight className="ml-2 inline h-5 w-5 -translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </div>
              {post.featured_image_url ? (
                <div className="relative hidden aspect-[4/3] overflow-hidden rounded-sm bg-muted lg:block">
                  <Image
                    src={post.featured_image_url}
                    alt=""
                    fill
                    sizes="176px"
                    className="object-cover grayscale-[35%] transition-[filter,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
