import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { WildlifeGrid } from "@/components/about/wildlife-grid";
import { SITE } from "@/lib/site";
import {
  BOUNDARIES,
  BOUNDARIES_SUMMARY,
  MISSION,
  SLOGAN,
  VISION,
  WILDLIFE_GALLERY,
} from "@/lib/content/neighborhood";

export const metadata: Metadata = {
  title: "About",
  description:
    "Earley Lake Neighborhood Organization in Burnsville, MN brings neighbors together for a safe, welcoming, and inclusive community around Earley Lake.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative isolate min-h-[48vh] overflow-hidden">
        <Image
          src="/images/poster-hero-ducks.jpg"
          alt="Mallard ducks on Earley Lake with autumn shoreline in Burnsville, Minnesota"
          fill
          className="animate-ken-burns object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-6xl items-end px-4 pb-12 sm:px-6 lg:px-8">
          <div className="animate-fade-up">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              About
            </p>
            <h1 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
              {SITE.name}
            </h1>
            <p className="mt-3 max-w-xl font-display text-xl text-foreground/85 sm:text-2xl">
              {SLOGAN}
            </p>
          </div>
        </div>
      </section>

      <Reveal as="section" className="section-atmosphere py-20">
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {MISSION}
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Our Vision
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {VISION}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal
        as="section"
        className="section-atmosphere border-y border-border bg-card/40 py-20"
      >
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="img-soft-edge relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/neighborhood-map.jpg"
              alt="Map of Earley Lake neighborhood boundaries in Burnsville, Minnesota"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Our Boundaries
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {BOUNDARIES_SUMMARY}
            </p>
            <ul className="mt-6 space-y-3 text-lg text-foreground/90">
              {BOUNDARIES.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              A Special Place We Share
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Wildlife and seasonal beauty around Earley Lake — the natural heart
              of our neighborhood.
            </p>
          </div>
          <WildlifeGrid items={WILDLIFE_GALLERY} className="mt-10" />
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Stay connected. Get involved.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Join our email list to receive updates on neighborhood news, events,
            meetings, projects, and ways to get involved. We&apos;re stronger
            together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/join">Join Our Community</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
