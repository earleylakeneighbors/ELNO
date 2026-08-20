import type { MetadataRoute } from "next";
import { getPublishedEvents, getPublishedNews } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, news] = await Promise.all([getPublishedEvents(), getPublishedNews()]);
  const base = SITE.url;

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/events`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/join`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    ...events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: new Date(e.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...news.map((n) => ({
      url: `${base}/news/${n.slug}`,
      lastModified: new Date(n.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
