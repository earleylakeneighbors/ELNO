import Image from "next/image";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { ArrowLink, Eyebrow } from "@/components/site/arrow-link";
import { cn } from "@/lib/utils";

/**
 * Why to join on the left, the sign-up form on the right. Closes most pages;
 * on /join it is the page itself, so the heading becomes the page's h1.
 */
export function JoinSection({ asPage = false }: { asPage?: boolean }) {
  const Heading = asPage ? "h1" : "h2";
  return (
    <section
      id="join"
      className={cn("relative bg-[#efece4]", !asPage && "border-t border-foreground/10")}
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-32">
        <div className="flex flex-col">
          <Eyebrow>The email list</Eyebrow>
          <Heading className="mt-6 font-display text-[clamp(2.5rem,5vw,4.25rem)] font-light leading-[1.02] tracking-[-0.02em] text-foreground">
            Hear it first,
            <br />
            <em className="font-normal">from your neighbors.</em>
          </Heading>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Event dates, lake updates, and the occasional call for a helping hand. Your details
            are only used for neighborhood communications.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <ArrowLink href="/events">Browse gatherings</ArrowLink>
            <ArrowLink href="/contact">Write to us instead</ArrowLink>
          </div>
          <div className="relative mt-12 hidden aspect-[16/9] overflow-hidden rounded-sm lg:mt-auto lg:block">
            <Image
              src="/images/community-gathering.jpg"
              alt="Neighbors talking together at an outdoor gathering by the lake"
              fill
              sizes="40vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="rounded-sm bg-background p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(28,40,40,0.25)] sm:p-10">
          <SubscribeForm />
        </div>
      </div>
    </section>
  );
}
