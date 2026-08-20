import Link from "next/link";
import Image from "next/image";
import type { NewsPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="group border-b border-border py-6 transition-colors first:pt-0 last:border-0 hover:bg-muted/30">
      <Link href={`/news/${post.slug}`} className="grid gap-4 sm:grid-cols-[140px_1fr] sm:gap-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted sm:aspect-square">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
              sizes="140px"
            />
          ) : null}
        </div>
        <div>
          <time
            dateTime={post.published_at ?? post.created_at}
            className="text-sm text-muted-foreground"
          >
            {formatDate(post.published_at ?? post.created_at)}
          </time>
          <h3 className="mt-1 font-display text-xl text-foreground group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
