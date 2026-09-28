import type { Metadata } from "next";
import { Fragment } from "react";
import { PageIntro } from "@/components/site/page-intro";
import { HoverImageList } from "@/components/site/hover-image-list";
import { JoinSection } from "@/components/home/join-section";
import { possibleEvents } from "@/lib/content/possible-events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Possible upcoming gatherings from Earley Lake Neighborhood Organization—confirmed dates coming soon.",
};

export default function EventsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Events"
        title={[
          <Fragment key="1">Gatherings</Fragment>,
          <Fragment key="2">
            <em className="font-normal">in the works.</em>
          </Fragment>,
        ]}
        lede="Confirmed dates, times, and places will be posted here, and sent to the email list first."
      />

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inset-0 rounded-full bg-amber-500" />
            <span className="relative h-2 w-2 rounded-full bg-amber-500" />
          </span>
          Planning in progress. No dates set yet.
        </div>
        <HoverImageList items={possibleEvents.map((e) => ({ ...e, meta: "Date to come" }))} />
      </section>

      <JoinSection />
    </>
  );
}
