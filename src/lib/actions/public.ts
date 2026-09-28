"use server";

import {
  createMessage,
  createSubscriber,
  findSubscriberByEmail,
  getSignupNotifyEmail,
} from "@/lib/data";
import { sendSignupAdminNotifyEmail } from "@/lib/email/send-signup-admin-notify";
import { sendWelcomeSubscriberEmail } from "@/lib/email/send-welcome";
import { contactSchema, subscribeSchema, type ActionResult } from "@/lib/validations";

const rateLimitMap = new Map<string, number>();

function checkRateLimit(key: string, windowMs = 30_000) {
  const now = Date.now();
  const last = rateLimitMap.get(key) ?? 0;
  if (now - last < windowMs) return false;
  rateLimitMap.set(key, now);
  return true;
}

export async function subscribeAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const consentRaw = formData.get("consent");
  const raw = {
    email: String(formData.get("email") ?? ""),
    first_name: String(formData.get("first_name") ?? ""),
    last_name: String(formData.get("last_name") ?? ""),
    street_address: String(formData.get("street_address") ?? ""),
    interests: String(formData.get("interests") ?? ""),
    consent:
      consentRaw === "on" || consentRaw === "true" || consentRaw === "1",
    // Honeypot — obscure name so browsers don't autofill and fake a success
    company_url: String(formData.get("company_url") ?? ""),
  };

  if (raw.company_url.trim()) {
    return { success: true, message: "Thanks for joining!" };
  }

  if (!checkRateLimit(`sub:${raw.email.toLowerCase()}`)) {
    return { success: false, error: "Please wait a moment before trying again." };
  }

  const parsed = subscribeSchema.safeParse({
    email: raw.email,
    first_name: raw.first_name,
    last_name: raw.last_name,
    street_address: raw.street_address,
    interests: raw.interests,
    consent: raw.consent ? true : false,
    website: "",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const existing = await findSubscriberByEmail(parsed.data.email);
    if (existing) {
      return {
        success: false,
        error: "This email is already on our list. Thank you!",
        fieldErrors: { email: ["This email is already subscribed"] },
      };
    }

    const subscriber = await createSubscriber({
      email: parsed.data.email.toLowerCase(),
      first_name: parsed.data.first_name.trim(),
      last_name: parsed.data.last_name?.trim() || null,
      street_address: parsed.data.street_address?.trim() || null,
      interests: parsed.data.interests?.trim() || null,
      consent: true,
    });

    await sendWelcomeSubscriberEmail({
      to: parsed.data.email.toLowerCase(),
      firstName: parsed.data.first_name.trim(),
    });

    const notifyTo = await getSignupNotifyEmail();
    await sendSignupAdminNotifyEmail({ to: notifyTo, subscriber });

    return { success: true, message: "You're on the list — welcome to Earley Lake!" };
  } catch (err) {
    console.error("subscribeAction failed", err);
    if (err instanceof Error && err.message === "DUPLICATE_EMAIL") {
      return {
        success: false,
        error: "This email is already on our list. Thank you!",
        fieldErrors: { email: ["This email is already subscribed"] },
      };
    }
    return {
      success: false,
      error: "We couldn't save your signup right now. Please try again shortly.",
    };
  }
}

export async function contactAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  if (raw.website) {
    return { success: true, message: "Message sent." };
  }

  if (!checkRateLimit(`contact:${raw.email.toLowerCase()}`)) {
    return { success: false, error: "Please wait a moment before trying again." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await createMessage({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
  } catch (err) {
    console.error("contactAction createMessage", err);
    return {
      success: false,
      error: "We couldn't send your message right now. Please try again shortly.",
    };
  }

  return {
    success: true,
    message: "Thanks for reaching out. We'll get back to you soon.",
  };
}
