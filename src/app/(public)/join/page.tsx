import type { Metadata } from "next";
import { JoinSection } from "@/components/home/join-section";

export const metadata: Metadata = {
  title: "Join the Email List",
  description:
    "Join the Earley Lake Neighborhood email list for announcements and community events in Burnsville, MN.",
};

export default function JoinPage() {
  return <JoinSection asPage />;
}
