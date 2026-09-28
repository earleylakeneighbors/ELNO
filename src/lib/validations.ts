import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(1, "Please enter your first name").max(80),
  last_name: z.string().max(80).optional().or(z.literal("")),
  street_address: z.string().max(240).optional().or(z.literal("")),
  interests: z.string().max(2000).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please confirm you agree to receive emails",
  }),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().min(3, "Please enter a subject").max(160),
  message: z.string().min(10, "Please enter a message (at least 10 characters)").max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const eventSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(160),
  description: z.string().min(10).max(5000),
  location: z.string().min(2).max(240),
  start_at: z.string().min(1),
  end_at: z.string().optional().or(z.literal("")),
  image_url: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

export const newsSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(400),
  content: z.string().min(20).max(20000),
  featured_image_url: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const createAdminSchema = z.object({
  full_name: z.string().min(2, "Enter a name").max(120),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72),
});

export const settingsSchema = z.object({
  org_name: z.string().min(2).max(160),
  tagline: z.string().max(240),
  location: z.string().max(120),
  contact_email: z.union([z.string().email(), z.literal("")]),
  signup_notify_email: z.string().email("Enter a valid notification email"),
  facebook_url: z.union([z.string().url(), z.literal("")]),
  instagram_url: z.union([z.string().url(), z.literal("")]),
  twitter_url: z.union([z.string().url(), z.literal("")]),
});

export type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
