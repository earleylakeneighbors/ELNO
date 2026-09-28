import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarDays,
  Newspaper,
  Mail,
  Images,
  FolderOpen,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminLink = {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  keywords?: string;
};

export const NAV_GROUPS: { label: string; links: AdminLink[] }[] = [
  {
    label: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", short: "Home", icon: LayoutDashboard, keywords: "home overview stats" },
      { href: "/admin/messages", label: "Messages", short: "Inbox", icon: Mail, keywords: "inbox contact mail" },
    ],
  },
  {
    label: "Community",
    links: [
      { href: "/admin/subscribers", label: "Email List", short: "Email", icon: Users, keywords: "subscribers export people" },
      { href: "/admin/events", label: "Events", short: "Events", icon: CalendarDays, keywords: "calendar gatherings" },
      { href: "/admin/news", label: "News", short: "News", icon: Newspaper, keywords: "posts announcements" },
    ],
  },
  {
    label: "Library",
    links: [
      { href: "/admin/gallery", label: "Gallery", short: "Gallery", icon: Images, keywords: "photos featured" },
      { href: "/admin/media", label: "Media", short: "Media", icon: FolderOpen, keywords: "uploads images files" },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/users", label: "Admins", short: "Admins", icon: UserCog, keywords: "users access team" },
      { href: "/admin/settings", label: "Settings", short: "Settings", icon: Settings, keywords: "organization social cron" },
    ],
  },
];

export const ALL_LINKS = NAV_GROUPS.flatMap((g) => g.links);

export function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
