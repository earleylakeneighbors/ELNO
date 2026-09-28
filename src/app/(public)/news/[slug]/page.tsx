import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsBySlug, getPublishedNews } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { ArticleShell } from "@/components/site/article-shell";
import { ArrowLink } from "@/components/site/arrow-link";

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

  const date = post.published_at ?? post.created_at;

  return (
    <ArticleShell
      backHref="/news"
      backLabel="All news"
      eyebrow={`${formatDate(date)}${post.author_name ? ` · ${post.author_name}` : ""}`}
      title={post.title}
      lede={post.excerpt}
      image={post.featured_image_url}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-muted-foreground">Get neighborhood news in your inbox.</p>
          <ArrowLink href="/join">Join the email list</ArrowLink>
        </div>
      }
    >
      {post.content}
    </ArticleShell>
  );
}
