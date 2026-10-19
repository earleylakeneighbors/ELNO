import type { HoverListItem } from "@/components/site/hover-image-list";
import type { Event } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils";

export function eventScheduleMeta(event: Event): string {
  return `${formatDate(event.start_at)} · ${formatTime(event.start_at)}`;
}

export function eventToHoverListItem(event: Event): HoverListItem {
  const excerpt =
    event.description.length > 160
      ? `${event.description.slice(0, 157).trim()}…`
      : event.description;

  return {
    id: event.id,
    title: event.title,
    description: excerpt,
    image: event.image_url ?? "/images/community-gathering.jpg",
    meta: eventScheduleMeta(event),
    href: `/events/${event.slug}`,
  };
}
