import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getPublishedNews } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedNews();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return { title: "News" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      {post.featured_image_url ? (
        <div className="relative isolate min-h-[40vh] overflow-hidden">
          <Image
            src={post.featured_image_url}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      ) : null}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <time
          dateTime={post.published_at ?? post.created_at}
          className="text-sm text-muted-foreground"
        >
          {formatDate(post.published_at ?? post.created_at)}
          {post.author_name ? ` · ${post.author_name}` : ""}
        </time>
        <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-foreground/90">
          {post.content}
        </div>
        <Button asChild variant="outline" className="mt-10">
          <Link href="/news">Back to news</Link>
        </Button>
      </div>
    </article>
  );
}
