import Link from "next/link";
import { Mail, CalendarDays, HandHeart, Share2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const items = [
  {
    title: "Join the Email List",
    description: "Get announcements and event reminders in your inbox.",
    href: "/join",
    icon: Mail,
  },
  {
    title: "Attend an Event",
    description: "Meet neighbors at gatherings throughout the year.",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Volunteer",
    description: "Lend a hand at cleanups, events, and community projects.",
    href: "/contact",
    icon: HandHeart,
  },
  {
    title: "Stay Connected",
    description: "Reach out with ideas or questions anytime.",
    href: "/contact",
    icon: Share2,
  },
];

export function GetInvolvedSection() {
  return (
    <Reveal as="section" className="section-atmosphere bg-muted/50 py-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">Get involved</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          There are many ways to participate — start with what feels right for you.
        </p>
        <Reveal stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-border bg-card p-5 transition-[transform,box-shadow] duration-[var(--motion-med)] ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <item.icon className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-4 font-display text-lg text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </Reveal>
      </div>
    </Reveal>
  );
}
