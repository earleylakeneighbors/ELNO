import type { Metadata } from "next";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Join the Email List",
  description:
    "Join the Earley Lake Neighborhood email list for announcements and community events in Burnsville, MN.",
};

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
      <Reveal as="header" className="text-center">
        <h1 className="font-display text-4xl text-foreground sm:text-5xl">
          Join the Earley Lake Neighborhood Email List
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sign up for updates on events, announcements, and ways to get involved around Earley
          Lake.
        </p>
      </Reveal>
      <Reveal className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <SubscribeForm />
      </Reveal>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        We respect your privacy. Your information is only used for neighborhood communications.
      </p>
    </div>
  );
}
