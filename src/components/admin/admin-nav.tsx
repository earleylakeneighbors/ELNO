"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

const allLinks = [
  { href: "/admin", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { href: "/admin/subscribers", label: "Email List", short: "Email", icon: Users },
  { href: "/admin/users", label: "User Management", short: "Users", icon: UserCog },
  { href: "/admin/events", label: "Events", short: "Events", icon: CalendarDays },
  { href: "/admin/news", label: "News", short: "News", icon: Newspaper },
  { href: "/admin/messages", label: "Messages", short: "Inbox", icon: Mail },
  { href: "/admin/gallery", label: "Gallery", short: "Gallery", icon: Images },
  { href: "/admin/media", label: "Media", short: "Media", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", short: "Settings", icon: Settings },
] as const;

const primaryHrefs = new Set([
  "/admin",
  "/admin/subscribers",
  "/admin/events",
  "/admin/messages",
]);

const primaryLinks = allLinks.filter((l) => primaryHrefs.has(l.href));
const moreLinks = allLinks.filter((l) => !primaryHrefs.has(l.href));

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function isMoreActive(pathname: string) {
  return moreLinks.some((l) => isActive(pathname, l.href));
}

export function AdminNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium leading-tight">Earley Lake</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="Admin">
          {allLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            );
          })}
          <form action={logoutAction} className="mt-4">
            <Button type="submit" variant="ghost" className="w-full justify-start gap-3">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </nav>
      </aside>

      {/* Mobile / tablet bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Admin mobile"
      >
        <div className="grid h-16 grid-cols-5">
          {primaryLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <link.icon className="h-5 w-5" aria-hidden />
                <span>{link.short}</span>
              </Link>
            );
          })}
          <button
            type="button"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
              moreOpen || isMoreActive(pathname) ? "text-primary" : "text-muted-foreground",
            )}
            aria-expanded={moreOpen}
            aria-controls="admin-more-sheet"
            onClick={() => setMoreOpen((v) => !v)}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* More sheet */}
      {moreOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
          />
          <div
            id="admin-more-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="More admin pages"
            className="absolute inset-x-0 bottom-0 rounded-t-2xl border border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-lg"
          >
            <div className="flex justify-center pt-3">
              <div className="h-1 w-10 rounded-full bg-border" />
            </div>
            <nav className="flex flex-col gap-1 p-3 pb-4" aria-label="More">
              {moreLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                      active
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <link.icon className="h-4 w-4" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
              <form action={logoutAction} className="mt-2 border-t border-border pt-2">
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </form>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
