import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || key.includes("xxxxxxxx")) return null;
  if (!client) client = new Resend(key);
  return client;
}

export function getResendFromAddress(): string | null {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) return null;
  if (from.includes("<")) return from;
  return `Earley Lake Neighborhood <${from}>`;
}
