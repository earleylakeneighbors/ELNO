import Link from "next/link";
import {
  Users,
  Mail,
  CalendarDays,
  Newspaper,
  UserCog,
  type LucideIcon,
} from "lucide-react";

const ACTIONS: { href: string; label: string; description: string; icon: LucideIcon }[] = [
  {
    href: "/admin/subscribers",
    label: "Email list",
    description: "View and export subscribers",
    icon: Users,
  },
  {
    href: "/admin/messages",
    label: "Messages",
    description: "Reply to contact form notes",
    icon: Mail,
  },
  {
    href: "/admin/events/new",
    label: "New event",
    description: "Schedule a neighborhood gathering",
    icon: CalendarDays,
  },
  {
    href: "/admin/news/new",
    label: "New announcement",
    description: "Publish neighborhood news",
    icon: Newspaper,
  },
  {
    href: "/admin/users",
    label: "User management",
    description: "Invite or remove admins",
    icon: UserCog,
  },
];

export function DashboardQuickActions() {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-display text-xl text-foreground">Quick actions</h2>
      <p className="mt-1 text-sm text-muted-foreground">Jump into common admin tasks</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex min-h-11 items-start gap-3 rounded-xl border border-transparent bg-muted/40 px-3 py-3 transition-[background-color,border-color,transform] duration-200 hover:border-border hover:bg-muted hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{action.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {action.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
