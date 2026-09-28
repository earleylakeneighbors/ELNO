export type UserRole = "admin" | "member";

export type ContentStatus = "draft" | "published" | "archived";

export type MessageStatus = "unread" | "read" | "replied" | "archived";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  street_address: string | null;
  interests: string | null;
  consent: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  author_id: string | null;
  author_name: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export interface MediaItem {
  id: string;
  file_path: string;
  public_url: string;
  filename: string;
  caption: string | null;
  uploaded_by: string | null;
  featured: boolean;
  created_at: string;
}

export interface SiteSettings {
  org_name: string;
  tagline: string;
  location: string;
  contact_email: string;
  signup_notify_email: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
}

export interface DashboardStats {
  subscribers: number;
  upcomingEvents: number;
  publishedNews: number;
  unreadMessages: number;
  galleryImages: number;
}

export interface CronKeepaliveLog {
  id: string;
  created_at: string;
  success: boolean;
  authorized: boolean;
  has_row: boolean | null;
  detail: string | null;
}
