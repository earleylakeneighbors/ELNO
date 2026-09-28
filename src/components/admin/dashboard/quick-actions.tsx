import Link from "next/link";
import {
  CalendarPlus,
  Download,
  FilePlus2,
  ImagePlus,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

const ACTIONS: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  { href: "/admin/events/new", label: "New event", description: "Schedule a gathering", icon: CalendarPlus },
  { href: "/admin/news/new", label: "Write news", description: "Publish an announcement", icon: FilePlus2 },
  { href: "/admin/media", label: "Add photos", description: "Grow the gallery", icon: ImagePlus },
  { href: "/admin/subscribers", label: "Export list", description: "Excel or CSV", icon: Download },
  { href: "/admin/users", label: "Invite admin", description: "Share the load", icon: UserPlus },
];

export function DashboardQuickActions() {
  return (
    <section>
      <h2 className="font-display text-xl text-foreground">Quick actions</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href + action.label}
              href={action.href}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
            >
              <span
                aria-hidden
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-[2.2]"
              />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden />
              </span>
              <span className="relative">
                <span className="block text-sm font-semibold text-foreground">{action.label}</span>
                <span className="block text-xs text-muted-foreground">{action.description}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
