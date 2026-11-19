import {
  LIBRARY_DEDICATION_FEATURED_IMAGE,
  LIBRARY_DEDICATION_NEWS_EXCERPT,
  LIBRARY_DEDICATION_NEWS_SLUG,
  LIBRARY_DEDICATION_NEWS_TITLE,
} from "@/lib/content/library-dedication-announcement";
import { SITE } from "@/lib/site";

export const ANNOUNCEMENT_BLAST_PRESETS = ["library-dedication"] as const;

export type AnnouncementBlastPreset = (typeof ANNOUNCEMENT_BLAST_PRESETS)[number];

export type AnnouncementBlastContent = {
  preset: AnnouncementBlastPreset;
  defaultSubject: string;
  title: string;
  excerpt: string;
  url: string;
  heroImageUrl: string | null;
};

function absoluteAsset(path: string): string {
  const base = SITE.url.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getAnnouncementBlastContent(
  preset: AnnouncementBlastPreset,
): AnnouncementBlastContent {
  if (preset === "library-dedication") {
    const url = `${SITE.url.replace(/\/$/, "")}/news/${LIBRARY_DEDICATION_NEWS_SLUG}`;
    return {
      preset,
      defaultSubject: LIBRARY_DEDICATION_NEWS_TITLE,
      title: LIBRARY_DEDICATION_NEWS_TITLE,
      excerpt: LIBRARY_DEDICATION_NEWS_EXCERPT,
      url,
      heroImageUrl: absoluteAsset(LIBRARY_DEDICATION_FEATURED_IMAGE),
    };
  }
  throw new Error(`Unknown announcement preset: ${preset}`);
}