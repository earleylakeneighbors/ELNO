import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/home/hero-section";
import { PossibleEventCard } from "@/components/home/possible-event-card";
import { NewsCard } from "@/components/home/news-card";
import { GetInvolvedSection } from "@/components/home/get-involved";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { WildlifeGrid } from "@/components/about/wildlife-grid";
import { possibleEvents } from "@/lib/content/possible-events";
import { MISSION, VISION, WILDLIFE_GALLERY } from "@/lib/content/neighborhood";
import { getPublishedNews } from "@/lib/data";

export default async function HomePage() {
  const news = await getPublishedNews(3);

  return (
    <>
      <HeroSection />

      <Reveal as="section" className="section-atmosphere py-20">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">Who we are</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {MISSION}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you are new to the area or have lived here for years, you are welcome.
              Join the email list, come to an event, or reach out — we are better when we
              connect.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/about">Learn more about us</Link>
            </Button>
          </div>
          <div className="img-soft-edge relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/community-gathering.jpg"
              alt="Neighbors gathering outdoors in a Minnesota community park"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section-atmosphere border-y border-border bg-card/40 py-20">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Possible upcoming events
              </h2>
              <p className="mt-3 text-muted-foreground">
                Here’s the kind of gatherings we’re planning—dates coming soon.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/events">View all events</Link>
            </Button>
          </div>
          <Reveal stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {possibleEvents.map((event) => (
              <div key={event.id}>
                <PossibleEventCard event={event} />
              </div>
            ))}
          </Reveal>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Want to hear when dates are set?{" "}
            <Link href="/join" className="font-medium text-primary hover:underline">
              Join the email list
            </Link>
            .
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="img-soft-edge relative order-2 aspect-[4/3] overflow-hidden rounded-2xl lg:order-1">
            <Image
              src="/images/about-neighborhood.jpg"
              alt="Tree-lined Minnesota neighborhood street in autumn"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">Our vision</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {VISION}
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/about">Read more about us</Link>
            </Button>
          </div>
        </div>
      </Reveal>

      <GetInvolvedSection />

      <Reveal as="section" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Latest announcements
              </h2>
              <p className="mt-3 text-muted-foreground">
                Neighborhood updates and important notices.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/news">All news</Link>
            </Button>
          </div>
          <div className="mt-8 max-w-3xl">
            {news.length === 0 ? (
              <p className="text-muted-foreground">No announcements yet. Check back soon.</p>
            ) : (
              <Reveal stagger>
                {news.map((post) => (
                  <div key={post.id}>
                    <NewsCard post={post} />
                  </div>
                ))}
              </Reveal>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section-atmosphere border-t border-border bg-muted/40 py-20">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                A Special Place We Share
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Wildlife and seasonal beauty around Earley Lake — the natural heart of our
                neighborhood.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/about">See more on About</Link>
            </Button>
          </div>
          <WildlifeGrid items={WILDLIFE_GALLERY.slice(0, 4)} className="mt-10" />
        </div>
      </Reveal>

      <Reveal as="section" className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Your neighborhood is stronger when neighbors connect.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join our email list for announcements, events, and ways to get involved.
          </p>
          <div className="mt-8 text-left">
            <SubscribeForm />
          </div>
        </div>
      </Reveal>
    </>
  );
}
