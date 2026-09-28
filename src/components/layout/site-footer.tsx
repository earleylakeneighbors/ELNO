import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { getSettings } from "@/lib/data";
import { BOUNDARIES, parseBoundary } from "@/lib/content/neighborhood";

const EXPLORE = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/join", label: "Email list" },
  { href: "/contact", label: "Contact" },
];

export async function SiteFooter() {
  const settings = await getSettings();
  const socials = [
    { label: "Facebook", href: settings.facebook_url },
    { label: "Instagram", href: settings.instagram_url },
    { label: "X / Twitter", href: settings.twitter_url },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto overflow-hidden bg-[#1c2828] text-[#e9ece8]">
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image src="/images/elno-logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
            <p className="mt-6 font-display text-2xl leading-snug">
              Neighbors caring for each other and for the lake we share.
            </p>
          </div>

          <FooterColumn title="Explore">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Our boundaries">
            {BOUNDARIES.map(parseBoundary).map((b) => (
              <li key={b.road} className="flex gap-3">
                <span className="w-3 text-xs font-semibold text-white/40">{b.side[0]}</span>
                {b.road}
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Get in touch">
            {settings.contact_email ? (
              <li>
                <a href={`mailto:${settings.contact_email}`} className="break-all transition-colors hover:text-white">
                  {settings.contact_email}
                </a>
              </li>
            ) : null}
            <li>
              <Link href="/contact" className="transition-colors hover:text-white">
                Send us a note
              </Link>
            </li>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
            <li className="pt-2 text-white/50">{settings.location || SITE.location}</li>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-2 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <p>{SITE.tagline}</p>
        </div>
      </div>

      <p
        aria-hidden
        className="select-none whitespace-nowrap text-center font-display leading-[0.8] tracking-tight text-white/[0.06]"
        style={{ fontSize: "clamp(4rem, 17vw, 16rem)" }}
      >
        Earley Lake
      </p>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{title}</p>
      <ul className="mt-5 space-y-2.5 text-[15px] text-white/80">{children}</ul>
    </div>
  );
}
