import type { Metadata } from "next";
import { Fragment } from "react";
import { PageIntro } from "@/components/site/page-intro";
import { HoverImageList } from "@/components/site/hover-image-list";
import { JoinSection } from "@/components/home/join-section";
import { getUpcomingEvents } from "@/lib/data";
import { eventToHoverListItem } from "@/lib/events/display";

// Hourly, so past events drop out of "upcoming".
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming gatherings from the Earley Lake Neighborhood Organization in Burnsville, MN.",
};

export default async function EventsPage() {
  const upcomingEvents = await getUpcomingEvents();
  const hasUpcoming = upcomingEvents.length > 0;

  return (
    <>
      <PageIntro
        eyebrow="Events"
        title={
          hasUpcoming
            ? [
                <Fragment key="1">Neighborhood</Fragment>,
                <Fragment key="2">
                  <em className="font-normal">gatherings.</em>
                </Fragment>,
              ]
            : [
                <Fragment key="1">Gatherings</Fragment>,
                <Fragment key="2">
                  <em className="font-normal">coming soon.</em>
                </Fragment>,
              ]
        }
        lede={
          hasUpcoming
            ? "Confirmed dates, times, and places for ELNO events. Email list members get reminders too."
            : "When we schedule a gathering, it will appear here. Join the email list to hear first."
        }
      />

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:pb-32">
        {hasUpcoming ? (
          <HoverImageList items={upcomingEvents.map((e) => eventToHoverListItem(e))} />
        ) : (
          <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
            No upcoming events scheduled.{" "}
            <a href="/join" className="font-medium text-primary underline-offset-4 hover:underline">
              Join the email list
            </a>{" "}
            to get notified.
          </p>
        )}
      </section>

      <JoinSection />
    </>
  );
}
