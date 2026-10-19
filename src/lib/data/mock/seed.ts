import type {
  ContactMessage,
  Event,
  MediaItem,
  NewsPost,
  SiteSettings,
  Subscriber,
} from "@/lib/types";

export const defaultSettings: SiteSettings = {
  org_name: "Earley Lake Neighborhood Organization",
  tagline: "Our Lake. Our Neighborhood. Our Community.",
  location: "Burnsville, MN",
  contact_email: "info@earleylakeneighbors.org",
  signup_notify_email: "admin@earleylakeneighbors.org",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
};

export const seedSubscribers: Subscriber[] = [
  {
    id: "sub-1",
    email: "jordan.hale@example.com",
    first_name: "Jordan",
    last_name: "Hale",
    street_address: null,
    interests: null,
    consent: true,
    created_at: "2026-06-12T14:20:00.000Z",
  },
  {
    id: "sub-2",
    email: "sam.rivera@example.com",
    first_name: "Sam",
    last_name: "Rivera",
    street_address: "123 Example St, Burnsville, MN",
    interests: "Events and volunteer opportunities",
    consent: true,
    created_at: "2026-07-01T09:10:00.000Z",
  },
  {
    id: "sub-3",
    email: "alex.chen@example.com",
    first_name: "Alex",
    last_name: "Chen",
    street_address: null,
    interests: "Neighborhood cleanup days",
    consent: true,
    created_at: "2026-07-18T16:45:00.000Z",
  },
];

import {
  INAUGURAL_LIBRARY_EVENT_SLUG,
} from "@/lib/events/constants";

const inauguralLibraryDescription = `Join your neighbors for our inaugural neighborhood event — a Little Free Library dedication at Day Park.

Celebrate the new Little Free Library and learn about the new Day Park signs. Please bring a gently used or new book for the Little Free Library.

Complimentary Taco John's tacos, coffee, cocoa, and water will be provided by the Earley Lake Neighborhood Organization.

Come meet your neighbors and celebrate together!`;

export const seedEvents: Event[] = [
  {
    id: "evt-inaugural-library",
    title: "Little Free Library Dedication",
    slug: INAUGURAL_LIBRARY_EVENT_SLUG,
    description: inauguralLibraryDescription,
    location: "Day Park pavilion, Burnsville, MN",
    start_at: "2026-11-14T20:00:00.000Z",
    end_at: "2026-11-14T22:00:00.000Z",
    image_url: "/images/poster-hero-ducks.jpg",
    status: "published",
    created_at: "2026-10-19T12:00:00.000Z",
    updated_at: "2026-10-19T12:00:00.000Z",
  },
];

export const seedNews: NewsPost[] = [];

export const seedMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Taylor Brooks",
    email: "taylor.brooks@example.com",
    phone: null,
    subject: "Interested in volunteering",
    message:
      "Hi — I'd love to help with neighborhood events this fall. Could you share how to get involved?",
    status: "unread",
    created_at: "2026-08-16T15:30:00.000Z",
  },
  {
    id: "msg-2",
    name: "Casey Nguyen",
    email: "casey.nguyen@example.com",
    phone: "651-555-0198",
    subject: "Question about the block party",
    message: "Are pets welcome at the summer block party? Thanks!",
    status: "read",
    created_at: "2026-08-14T11:05:00.000Z",
  },
];

export const seedMedia: MediaItem[] = [
  {
    id: "media-1",
    file_path: "gallery/hero-lake.jpg",
    public_url: "/images/hero-lake.jpg",
    filename: "hero-lake.jpg",
    caption: "Earley Lake shoreline in summer light",
    uploaded_by: "admin-1",
    featured: true,
    created_at: "2026-07-01T12:00:00.000Z",
  },
  {
    id: "media-2",
    file_path: "gallery/community-gathering.jpg",
    public_url: "/images/community-gathering.jpg",
    filename: "community-gathering.jpg",
    caption: "Neighbors gathering outdoors",
    uploaded_by: "admin-1",
    featured: true,
    created_at: "2026-07-02T12:00:00.000Z",
  },
  {
    id: "media-3",
    file_path: "gallery/about-neighborhood.jpg",
    public_url: "/images/about-neighborhood.jpg",
    filename: "about-neighborhood.jpg",
    caption: "Neighborhood street in autumn",
    uploaded_by: "admin-1",
    featured: true,
    created_at: "2026-07-03T12:00:00.000Z",
  },
  {
    id: "media-4",
    file_path: "gallery/gallery-winter.jpg",
    public_url: "/images/gallery-winter.jpg",
    filename: "gallery-winter.jpg",
    caption: "Quiet winter morning",
    uploaded_by: "admin-1",
    featured: true,
    created_at: "2026-07-04T12:00:00.000Z",
  },
  {
    id: "media-5",
    file_path: "gallery/gallery-spring.jpg",
    public_url: "/images/gallery-spring.jpg",
    filename: "gallery-spring.jpg",
    caption: "Spring along the lake path",
    uploaded_by: "admin-1",
    featured: true,
    created_at: "2026-07-05T12:00:00.000Z",
  },
  {
    id: "media-6",
    file_path: "gallery/gallery-volunteers.jpg",
    public_url: "/images/gallery-volunteers.jpg",
    filename: "gallery-volunteers.jpg",
    caption: "Neighbors volunteering together",
    uploaded_by: "admin-1",
    featured: true,
    created_at: "2026-07-06T12:00:00.000Z",
  },
];
