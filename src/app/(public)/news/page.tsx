import type { Metadata } from "next";
import { Fragment } from "react";
import { PageIntro } from "@/components/site/page-intro";
import { NewsIndex } from "@/components/site/news-index";
import { ArrowLink } from "@/components/site/arrow-link";
import { getPublishedNews } from "@/lib/data";

export const metadata: Metadata = {
  title: "News",
  description: "Neighborhood announcements and updates from Earley Lake Neighborhood Organization.",
};

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return (
    <>
      <PageIntro
        eyebrow="News"
        title={[
          <Fragment key="1">Notes from</Fragment>,
          <Fragment key="2">
            <em className="font-normal">the neighborhood.</em>
          </Fragment>,
        ]}
        lede="Announcements, community updates, and anything neighbors should know about."
      />
      <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        {posts.length === 0 ? (
          <div className="border-y border-foreground/15 py-16">
            <p className="font-display text-2xl text-foreground">Nothing posted yet.</p>
            <p className="mt-2 text-muted-foreground">Announcements will appear here as they&apos;re published.</p>
            <ArrowLink href="/join" className="mt-6">
              Get them by email instead
            </ArrowLink>
          </div>
        ) : (
          <NewsIndex posts={posts} />
        )}
      </section>
    </>
  );
}
