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

export const seedEvents: Event[] = [
  {
    id: "evt-1",
    title: "Summer Block Party",
    slug: "summer-block-party",
    description:
      "Join neighbors for an evening of food, games, and conversation. Bring a dish to share if you can — or just bring yourself. All residents and friends are welcome.",
    location: "Neighborhood park pavilion — [Editable: exact address]",
    start_at: "2026-09-12T17:00:00.000Z",
    end_at: "2026-09-12T21:00:00.000Z",
    image_url: "/images/event-block-party.jpg",
    status: "draft",
    created_at: "2026-07-01T12:00:00.000Z",
    updated_at: "2026-07-01T12:00:00.000Z",
  },
  {
    id: "evt-2",
    title: "Lakeside Cleanup Morning",
    slug: "lakeside-cleanup-morning",
    description:
      "Help keep our shoreline welcoming. Gloves and bags provided. Meet at the trailhead for a short briefing, then we'll work together along the path.",
    location: "Earley Lake trailhead — [Editable: exact meeting point]",
    start_at: "2026-09-27T09:00:00.000Z",
    end_at: "2026-09-27T11:30:00.000Z",
    image_url: "/images/event-cleanup.jpg",
    status: "draft",
    created_at: "2026-07-10T12:00:00.000Z",
    updated_at: "2026-07-10T12:00:00.000Z",
  },
  {
    id: "evt-3",
    title: "Fall Neighborhood Meetup",
    slug: "fall-neighborhood-meetup",
    description:
      "A casual evening to share updates, hear from neighbors, and plan fall activities together. Light refreshments provided.",
    location: "Community gathering space — [Editable]",
    start_at: "2026-10-18T18:30:00.000Z",
    end_at: "2026-10-18T20:00:00.000Z",
    image_url: "/images/community-gathering.jpg",
    status: "draft",
    created_at: "2026-08-01T12:00:00.000Z",
    updated_at: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "evt-4",
    title: "Spring Planting Day",
    slug: "spring-planting-day",
    description:
      "Past event: neighbors planted flowers and refreshed shared garden beds around the neighborhood.",
    location: "Neighborhood garden beds",
    start_at: "2026-05-10T10:00:00.000Z",
    end_at: "2026-05-10T13:00:00.000Z",
    image_url: "/images/gallery-volunteers.jpg",
    status: "draft",
    created_at: "2026-04-01T12:00:00.000Z",
    updated_at: "2026-05-11T12:00:00.000Z",
  },
  {
    id: "evt-5",
    title: "Draft: Winter Social",
    slug: "draft-winter-social",
    description: "Placeholder draft event for admin testing. Not visible on the public site.",
    location: "TBD",
    start_at: "2027-01-15T18:00:00.000Z",
    end_at: "2027-01-15T20:00:00.000Z",
    image_url: "/images/gallery-winter.jpg",
    status: "draft",
    created_at: "2026-08-15T12:00:00.000Z",
    updated_at: "2026-08-15T12:00:00.000Z",
  },
];

export const seedNews: NewsPost[] = [
  {
    id: "news-1",
    title: "Welcome to Our New Neighborhood Website",
    slug: "welcome-to-our-new-website",
    excerpt:
      "We're glad you're here. This site is our shared place for announcements, events, and ways to stay connected.",
    content: `We're excited to launch the Earley Lake Neighborhood Organization website — a simple, welcoming home for neighbors to stay informed and involved.

Here you can:
- Join our email list for updates
- See upcoming community events
- Read neighborhood announcements
- Reach us through the contact form

[Editable: Add a short welcome message from organizers when ready.]

Thank you for being part of Earley Lake.`,
    featured_image_url: "/images/hero-lake.jpg",
    author_id: "admin-1",
    author_name: "Earley Lake Organizers",
    status: "published",
    published_at: "2026-08-01T12:00:00.000Z",
    created_at: "2026-08-01T12:00:00.000Z",
    updated_at: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "news-2",
    title: "How to Stay Connected This Season",
    slug: "how-to-stay-connected-this-season",
    excerpt:
      "A quick guide to joining the email list, attending events, and sharing ideas with the organization.",
    content: `Staying involved is simple:

1. Join the email list so you hear about gatherings and important notices.
2. Check the Events page for dates and details.
3. Use the Contact form if you have questions or ideas.

[Editable: Add seasonal specifics when available.]

Your participation helps strengthen Earley Lake for everyone.`,
    featured_image_url: "/images/community-gathering.jpg",
    author_id: "admin-1",
    author_name: "Earley Lake Organizers",
    status: "published",
    published_at: "2026-08-10T12:00:00.000Z",
    created_at: "2026-08-10T12:00:00.000Z",
    updated_at: "2026-08-10T12:00:00.000Z",
  },
  {
    id: "news-3",
    title: "Draft: Neighborhood Meeting Notes",
    slug: "draft-neighborhood-meeting-notes",
    excerpt: "Draft announcement — not published.",
    content: "Placeholder draft content for admin testing.",
    featured_image_url: null,
    author_id: "admin-1",
    author_name: "Earley Lake Organizers",
    status: "draft",
    published_at: null,
    created_at: "2026-08-18T12:00:00.000Z",
    updated_at: "2026-08-18T12:00:00.000Z",
  },
];

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
