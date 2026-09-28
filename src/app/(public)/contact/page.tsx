import type { Metadata } from "next";
import { Fragment } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { PageIntro } from "@/components/site/page-intro";
import { ArrowLink } from "@/components/site/arrow-link";
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

  const details: { label: string; value: React.ReactNode }[] = [
    ...(settings.contact_email
      ? [
          {
            label: "Email",
            value: (
              <a href={`mailto:${settings.contact_email}`} className="break-all border-b border-foreground/30 pb-0.5 hover:border-foreground">
                {settings.contact_email}
              </a>
            ),
          },
        ]
      : []),
    { label: "Based in", value: settings.location || SITE.location },
    ...(socials.length
      ? [
          {
            label: "Elsewhere",
            value: (
              <span className="flex flex-wrap gap-x-4">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="border-b border-foreground/30 pb-0.5 hover:border-foreground">
                    {s.label}
                  </a>
                ))}
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title={[
          <Fragment key="1">Write to</Fragment>,
          <Fragment key="2">
            <em className="font-normal">your neighbors.</em>
          </Fragment>,
        ]}
        lede="Questions, ideas, or an offer to help. We would love to hear from you."
      />
      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-28 sm:px-8 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <dl className="border-t border-foreground/15">
            {details.map((d) => (
              <div key={d.label} className="border-b border-foreground/15 py-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{d.label}</dt>
                <dd className="mt-2 font-display text-xl text-foreground">{d.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-muted-foreground">Just want the news?</p>
          <ArrowLink href="/join" className="mt-2">
            Join the email list
          </ArrowLink>
        </div>
        <div className="rounded-sm bg-card p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(28,40,40,0.25)] sm:p-10 lg:col-span-8">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
