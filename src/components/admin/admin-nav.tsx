"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, LogOut, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/admin";
import { Avatar } from "@/components/ui/avatar";
import { ALL_LINKS, NAV_GROUPS, isActive, type AdminLink } from "@/components/admin/nav-links";
import { openCommandPalette } from "@/components/admin/command-palette";

export type { AdminIdentity } from "@/lib/auth/admin-identity";
import type { AdminIdentity } from "@/lib/auth/admin-identity";

const primaryHrefs = ["/admin", "/admin/messages", "/admin/events", "/admin/subscribers"];
const primaryLinks = primaryHrefs.map((h) => ALL_LINKS.find((l) => l.href === h)!);
const moreLinks = ALL_LINKS.filter((l) => !primaryHrefs.includes(l.href));

function UnreadBadge({ count, compact }: { count: number; compact?: boolean }) {
  if (count <= 0) return null;
  return (
    <motion.span
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className={cn(
        "flex items-center justify-center rounded-full bg-amber-500 font-semibold text-white tabular-nums",
        compact ? "absolute -right-2 -top-1 h-4 min-w-4 px-1 text-[9px]" : "ml-auto h-5 min-w-5 px-1.5 text-[11px]",
      )}
      aria-label={`${count} unread`}
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}

function SidebarLink({ link, active, unread }: { link: AdminLink; active: boolean; unread: number }) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active ? (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg bg-primary/12 ring-1 ring-inset ring-primary/15"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      ) : (
        <span className="absolute inset-0 rounded-lg bg-muted opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <link.icon
        className="relative h-4 w-4 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none"
        aria-hidden
      />
      <span className="relative">{link.label}</span>
      {link.href === "/admin/messages" ? (
        <span className="relative ml-auto">
          <UnreadBadge count={unread} />
        </span>
      ) : null}
    </Link>
  );
}

export function AdminNav({ unreadCount, admin }: { unreadCount: number; admin: AdminIdentity }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the "More" sheet whenever navigation lands on a new page.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMoreOpen(false);
  }

  const moreActive = moreLinks.some((l) => isActive(pathname, l.href));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/80 backdrop-blur md:flex">
        <Link href="/admin" className="flex h-16 items-center gap-3 px-5">
          <span className="relative">
            <Image
              src="/images/elno-logo.png"
              alt=""
              width={34}
              height={34}
              className="rounded-full object-cover ring-2 ring-primary/15"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
          </span>
          <span>
            <span className="block font-display text-[15px] leading-tight">Earley Lake</span>
            <span className="block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Admin
            </span>
          </span>
        </Link>

        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={openCommandPalette}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="rounded border border-border bg-card px-1.5 text-[10px] font-medium">
              Ctrl K
            </kbd>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin" aria-label="Admin">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mt-4 first:mt-2">
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.links.map((link) => (
                  <SidebarLink
                    key={link.href}
                    link={link}
                    active={isActive(pathname, link.href)}
                    unread={unreadCount}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View public site
          </a>
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
            <Avatar name={admin?.name || admin?.email || "Admin"} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{admin?.name || "Administrator"}</p>
              <p className="truncate text-xs text-muted-foreground">{admin?.email || "Signed in"}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-border bg-card/90 shadow-lg backdrop-blur-md md:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Admin mobile"
      >
        <div className="grid h-16 grid-cols-5 px-1">
          {primaryLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="mobile-active"
                    className="absolute inset-x-1.5 inset-y-1.5 rounded-xl bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                  />
                ) : null}
                <span className="relative">
                  <link.icon className="h-5 w-5" aria-hidden />
                  {link.href === "/admin/messages" ? <UnreadBadge count={unreadCount} compact /> : null}
                </span>
                <span className="relative">{link.short}</span>
              </Link>
            );
          })}
          <button
            type="button"
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
              moreOpen || moreActive ? "text-primary" : "text-muted-foreground",
            )}
            aria-expanded={moreOpen}
            aria-controls="admin-more-sheet"
            onClick={() => setMoreOpen((v) => !v)}
          >
            {moreActive && !moreOpen ? (
              <motion.span
                layoutId="mobile-active"
                className="absolute inset-x-1.5 inset-y-1.5 rounded-xl bg-primary/10"
              />
            ) : null}
            <MoreHorizontal className="relative h-5 w-5" aria-hidden />
            <span className="relative">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {moreOpen ? (
          <div className="fixed inset-0 z-[60] md:hidden" role="presentation">
            <motion.button
              type="button"
              className="absolute inset-0 bg-foreground/40"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              id="admin-more-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="More admin pages"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) setMoreOpen(false);
              }}
              className="absolute inset-x-0 bottom-0 rounded-t-3xl border border-border bg-card pb-[env(safe-area-inset-bottom)] shadow-2xl"
            >
              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-10 rounded-full bg-border" />
              </div>
              <div className="grid grid-cols-3 gap-2 p-4">
                {moreLinks.map((link, i) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-xs font-medium transition-colors",
                          active
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border bg-background text-foreground",
                        )}
                      >
                        <link.icon className="h-5 w-5" aria-hidden />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-2 border-t border-border p-4">
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    openCommandPalette();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm"
                >
                  <Search className="h-4 w-4" /> Search
                </button>
                <form action={logoutAction} className="flex-1">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3 text-sm text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
