import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { SLOGAN } from "@/lib/content/neighborhood";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      <Image
        src="/images/hero-lake.jpg"
        alt="Calm Minnesota lakeside shoreline in summer light"
        fill
        priority
        className="animate-ken-burns object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8">
        <p className="animate-fade-up font-display text-2xl text-foreground sm:text-3xl md:text-4xl">
          {SITE.name}
        </p>
        <h1 className="animate-fade-up-delay-1 mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-foreground sm:text-5xl md:text-6xl">
          {SLOGAN}
        </h1>
        <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-lg leading-relaxed text-foreground/85">
          We bring neighbors together to promote a safe, welcoming community and protect the
          natural environment around Earley Lake in Burnsville, MN.
        </p>
        <div className="animate-fade-up-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="shadow-md transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg">
            <Link href="/join">Join Our Community</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md">
            <Link href="/events">See Upcoming Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
