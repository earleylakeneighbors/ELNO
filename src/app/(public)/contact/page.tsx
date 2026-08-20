import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { getSettings } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Earley Lake Neighborhood Organization with questions or ideas.",
};

export default async function ContactPage() {
  const settings = await getSettings();
  const socials = [
    { label: "Facebook", href: settings.facebook_url },
    { label: "Instagram", href: settings.instagram_url },
    { label: "X / Twitter", href: settings.twitter_url },
  ].filter((s) => s.href);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">Contact</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions, ideas, or volunteer interest — we would love to hear from you.
          </p>
          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Location:</span>{" "}
              {settings.location || SITE.location}
            </p>
            {settings.contact_email ? (
              <p>
                <span className="font-medium text-foreground">Email:</span>{" "}
                <a className="text-primary hover:underline" href={`mailto:${settings.contact_email}`}>
                  {settings.contact_email}
                </a>
              </p>
            ) : (
              <p className="placeholder-editable">
                [Editable] Add a public contact email in admin settings when available.
              </p>
            )}
            {socials.length > 0 ? (
              <ul className="space-y-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="placeholder-editable">
                [Editable] Social media links appear here once configured.
              </p>
            )}
          </div>
        </Reveal>
        <Reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
