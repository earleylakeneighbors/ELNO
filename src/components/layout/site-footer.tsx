import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { getSettings } from "@/lib/data";
import { Reveal } from "@/components/motion/reveal";

export async function SiteFooter() {
  const settings = await getSettings();
  const socials = [
    { label: "Facebook", href: settings.facebook_url },
    { label: "Instagram", href: settings.instagram_url },
    { label: "X / Twitter", href: settings.twitter_url },
  ].filter((s) => s.href);

  return (
    <Reveal
      as="footer"
      className="mt-auto border-t border-border bg-muted/40"
      rootMargin="0px 0px 0px 0px"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <p className="font-display text-lg text-foreground">{SITE.name}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SITE.description}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{SITE.location}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-foreground">
                Events
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-foreground">
                News
              </Link>
            </li>
            <li>
              <Link href="/join" className="hover:text-foreground">
                Join the email list
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">Stay connected</p>
          {socials.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="placeholder-editable mt-3 text-sm">
              Social links will appear here once added in admin settings.
            </p>
          )}
          <Link
            href="/join"
            className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
          >
            Join our email list →
          </Link>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {SITE.name}. Built for neighbors in Burnsville, MN.
        </p>
      </div>
    </Reveal>
  );
}
