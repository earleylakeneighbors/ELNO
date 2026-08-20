export type PossibleEvent = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const possibleEvents: PossibleEvent[] = [
  {
    id: "block-party",
    title: "Summer Block Party",
    description:
      "Neighbors gathering for food, games, and conversation—an easy way to meet the people who share your streets.",
    image: "/images/event-block-party.jpg",
  },
  {
    id: "cleanup",
    title: "Lakeside Cleanup Morning",
    description:
      "A hands-on morning to care for the shoreline and keep Earley Lake welcoming for everyone.",
    image: "/images/event-cleanup.jpg",
  },
  {
    id: "meetup",
    title: "Fall Neighborhood Meetup",
    description:
      "A casual evening to share updates, hear from neighbors, and plan activities together.",
    image: "/images/community-gathering.jpg",
  },
];
