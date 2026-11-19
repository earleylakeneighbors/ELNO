import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getPublishedNews } from "@/lib/data";
import {
  LIBRARY_DEDICATION_EVENT_PATH,
  LIBRARY_DEDICATION_FEATURED_ALT,
  LIBRARY_DEDICATION_GALLERY,
  LIBRARY_DEDICATION_NEWS_SLUG,
} from "@/lib/content/library-dedication-announcement";
import { ELNO_EVENT_TIME_ZONE } from "@/lib/events/time";
import { formatDate } from "@/lib/utils";
import { ArticleShell } from "@/components/site/article-shell";
import { ArrowLink } from "@/components/site/arrow-link";
import { CommunityPhotoGallery } from "@/components/site/community-photo-gallery";

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
  const isLibraryDedication = slug === LIBRARY_DEDICATION_NEWS_SLUG;
  const dateLabel = formatDate(date, { timeZone: ELNO_EVENT_TIME_ZONE });

  return (
    <>
      <ArticleShell
        backHref="/news"
        backLabel="All news"
        eyebrow={`${dateLabel}${post.author_name ? ` · ${post.author_name}` : ""}`}
        title={post.title}
        lede={post.excerpt}
        image={post.featured_image_url}
        imageAlt={isLibraryDedication ? LIBRARY_DEDICATION_FEATURED_ALT : undefined}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-muted-foreground">Get neighborhood news in your inbox.</p>
            <ArrowLink href="/join">Join the email list</ArrowLink>
          </div>
        }
      >
        {post.content}
        {isLibraryDedication ? (
          <p className="mt-8 text-base leading-relaxed">
            <Link
              href={LIBRARY_DEDICATION_EVENT_PATH}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              View the original event listing
            </Link>
          </p>
        ) : null}
      </ArticleShell>
      {isLibraryDedication ? (
        <CommunityPhotoGallery items={LIBRARY_DEDICATION_GALLERY} className="mt-16 pb-24" />
      ) : null}
    </>
  );
}