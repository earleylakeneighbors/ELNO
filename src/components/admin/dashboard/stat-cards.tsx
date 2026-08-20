import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Users,
  CalendarDays,
  Newspaper,
  Mail,
  Images,
} from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatCard = {
  key: keyof DashboardStats;
  label: string;
  href: string;
  icon: LucideIcon;
  hint: string;
};

const STATS: StatCard[] = [
  {
    key: "subscribers",
    label: "Email subscribers",
    href: "/admin/subscribers",
    icon: Users,
    hint: "People on the list",
  },
  {
    key: "upcomingEvents",
    label: "Upcoming events",
    href: "/admin/events",
    icon: CalendarDays,
    hint: "Published & upcoming",
  },
  {
    key: "publishedNews",
    label: "Published news",
    href: "/admin/news",
    icon: Newspaper,
    hint: "Live announcements",
  },
  {
    key: "unreadMessages",
    label: "Unread messages",
    href: "/admin/messages",
    icon: Mail,
    hint: "Needs attention",
  },
  {
    key: "galleryImages",
    label: "Gallery images",
    href: "/admin/gallery",
    icon: Images,
    hint: "Media library",
  },
];

export function DashboardStatCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {STATS.map((card, i) => {
        const Icon = card.icon;
        const value = stats[card.key];
        const emphasize = card.key === "unreadMessages" && value > 0;

        return (
          <Link
            key={card.key}
            href={card.href}
            className={cn(
              "group relative flex min-h-[7.5rem] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm",
              "transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-out-soft)]",
              "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "motion-reduce:transform-none motion-reduce:transition-none",
              emphasize && "border-amber-200/80 bg-amber-50/40",
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  emphasize ? "bg-amber-100 text-amber-900" : "bg-primary/10 text-primary",
                )}
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:opacity-100">
                Open
              </span>
            </div>
            <div>
              <p className="font-display text-3xl leading-none tracking-tight text-foreground tabular-nums">
                {value}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{card.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{card.hint}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
