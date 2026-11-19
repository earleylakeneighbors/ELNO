import { INAUGURAL_LIBRARY_EVENT_SLUG } from "@/lib/events/constants";

export const LIBRARY_DEDICATION_NEWS_SLUG = "neighbors-books-community";

/**
 * To add event photos: place files under public/images/librarydedication/ (subfolders ok, e.g. earley2/),
 * then append an entry to LIBRARY_DEDICATION_GALLERY below (src, alt, optional caption, optional objectPosition).
 */

const IMAGE_DIR = "/images/librarydedication";

/** Path relative to librarydedication/, e.g. "earley2/WhatsApp Image ….jpeg" */
function dedicationImagePath(relativePath: string): string {
  return `${IMAGE_DIR}/${encodeURI(relativePath)}`;
}

export const LIBRARY_DEDICATION_FEATURED_FILENAME =
  "WhatsApp Image 2026-11-19 at 2.49.29 AM.jpeg";

export const LIBRARY_DEDICATION_FEATURED_IMAGE = dedicationImagePath(
  LIBRARY_DEDICATION_FEATURED_FILENAME,
);

export const LIBRARY_DEDICATION_FEATURED_ALT =
  "Neighbors gathered at Day Park for the Little Free Library dedication and first neighborhood social.";

export type CommunityGalleryItem = {
  src: string;
  alt: string;
  caption?: string;
  /** CSS object-position when object-fit: cover crops awkwardly (e.g. "center 18%"). */
  objectPosition?: string;
};

const GALLERY_FILENAMES = [
  "WhatsApp Image 2026-11-19 at 2.49.29 AM (1).jpeg",
  "WhatsApp Image 2026-11-19 at 2.49.29 AM (2).jpeg",
  "WhatsApp Image 2026-11-19 at 2.49.29 AM (3).jpeg",
  "WhatsApp Image 2026-11-19 at 2.49.29 AM (4).jpeg",
] as const;

export const LIBRARY_DEDICATION_GALLERY: CommunityGalleryItem[] = [
  {
    src: dedicationImagePath(GALLERY_FILENAMES[0]),
    alt: "Anne McLarnen at Day Park during the Little Free Library dedication and first neighborhood social.",
    caption: "Anne McLarnen · Little Free Library project",
    objectPosition: "center 18%",
  },
  {
    src: dedicationImagePath(GALLERY_FILENAMES[1]),
    alt: "Community members at the Little Free Library dedication at Day Park.",
    caption: "Library dedication",
  },
  {
    src: dedicationImagePath(GALLERY_FILENAMES[2]),
    alt: "Book donations received for the Little Free Library.",
    caption: "Book donations",
  },
  {
    src: dedicationImagePath(GALLERY_FILENAMES[3]),
    alt: "Neighbors connecting and celebrating the new Little Free Library initiative.",
    caption: "Celebrating together",
  },
  {
    src: dedicationImagePath("earley2/WhatsApp Image 2026-11-20 at 2.19.49 AM.jpeg"),
    alt: "Two neighbors smiling under the Day Park pavilion during the social gathering.",
    caption: "Neighbors at the pavilion",
    objectPosition: "center 22%",
  },
  {
    src: dedicationImagePath("earley2/WhatsApp Image 2026-11-20 at 2.19.49 AM (1).jpeg"),
    alt: "Neighbors conversing under the pavilion at the Little Free Library dedication.",
    caption: "Conversation at Day Park",
    objectPosition: "center 38%",
  },
  {
    src: dedicationImagePath("earley2/WhatsApp Image 2026-11-20 at 2.19.51 AM.jpeg"),
    alt: "Neighbors chatting with Earley Lake visible in the background on a sunny afternoon.",
    caption: "Coffee and conversation",
    objectPosition: "center 32%",
  },
  {
    src: dedicationImagePath("earley2/WhatsApp Image 2026-11-20 at 2.19.52 AM.jpeg"),
    alt: "Neighbors gathered near refreshments with the lake path visible beyond the pavilion.",
    caption: "Social gathering",
    objectPosition: "center 42%",
  },
  {
    src: dedicationImagePath("earley2/WhatsApp Image 2026-11-20 at 2.19.53 AM.jpeg"),
    alt: "Three neighbors enjoying coffee and conversation at the first neighborhood social.",
    caption: "Warm welcomes",
    objectPosition: "center 35%",
  },
  {
    src: dedicationImagePath("earley2/WhatsApp Image 2026-11-20 at 2.19.54 AM.jpeg"),
    alt: "A group of neighbors visiting under the pavilion at Day Park.",
    caption: "Neighbors visiting",
    objectPosition: "center 38%",
  },
  {
    src: dedicationImagePath("earley2/WhatsApp Image 2026-11-20 at 2.19.55 AM.jpeg"),
    alt: "Coffee, cocoa, and neighbors gathered inside the Day Park pavilion.",
    caption: "Refreshments and neighbors",
    objectPosition: "center 40%",
  },
];

export const LIBRARY_DEDICATION_NEWS_TITLE =
  "A Wonderful Afternoon of Neighbors, Books & Community!";

export const LIBRARY_DEDICATION_NEWS_EXCERPT =
  "On November 14, the Earley Lake Neighborhood Organization celebrated a neighborhood social gathering and the dedication of our Little Free Library at Day Park.";

export const LIBRARY_DEDICATION_NEWS_CONTENT = `The Earley Lake Neighborhood Organization celebrated a special milestone on November 14 with a neighborhood social gathering and the dedication of our Little Free Library!

Neighbors came together for a wonderful afternoon of friendship, conversation, and community spirit.

Anne McLarnen, who leads the Little Free Library project, shared updates on the project's progress. We were also delighted to receive new book donations that will help our library continue bringing stories and reading opportunities to our neighborhood.

Thank you to everyone who joined us and helped make this first gathering such a memorable occasion. Your participation and support mean so much to our community.

We look forward to seeing everyone at our future neighborhood events!`;

export const LIBRARY_DEDICATION_NEWS_PUBLISHED_AT = "2026-11-14T18:00:00.000Z";

export const LIBRARY_DEDICATION_EVENT_PATH = `/events/${INAUGURAL_LIBRARY_EVENT_SLUG}`;