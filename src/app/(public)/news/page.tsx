import type { Metadata } from "next";
import { NewsCard } from "@/components/home/news-card";
import { Reveal } from "@/components/motion/reveal";
import { getPublishedNews } from "@/lib/data";

export const metadata: Metadata = {
  title: "News",
  description: "Neighborhood announcements and updates from Earley Lake Neighborhood Organization.",
};

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal as="header">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">News</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Announcements, community updates, and important notices.
        </p>
      </Reveal>
      <div className="mt-10">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No published announcements yet.</p>
        ) : (
          <Reveal stagger>
            {posts.map((post) => (
              <div key={post.id}>
                <NewsCard post={post} />
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </div>
  );
}
