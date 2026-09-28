"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Images, Mail, Newspaper, Users, type LucideIcon } from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BorderBeam } from "@/components/ui/border-beam";

export type WeeklySignups = { label: string; count: number }[];

type Tile = {
  key: Exclude<keyof DashboardStats, "subscribers">;
  label: string;
  href: string;
  icon: LucideIcon;
  hint: string;
};

const TILES: Tile[] = [
  { key: "unreadMessages", label: "Unread messages", href: "/admin/messages", icon: Mail, hint: "Waiting on a reply" },
  { key: "upcomingEvents", label: "Upcoming events", href: "/admin/events", icon: CalendarDays, hint: "Published & ahead" },
  { key: "publishedNews", label: "Published news", href: "/admin/news", icon: Newspaper, hint: "Live announcements" },
  { key: "galleryImages", label: "Gallery images", href: "/admin/gallery", icon: Images, hint: "In the media library" },
];

const item = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function SignupBars({ weeks }: { weeks: WeeklySignups }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...weeks.map((w) => w.count));
  const last = weeks.length - 1;

  return (
    <div className="relative mt-auto">
      <div className="flex h-24 items-end gap-[3px]" onPointerLeave={() => setHover(null)}>
        {weeks.map((w, i) => (
          <div
            key={w.label}
            className="relative flex h-full flex-1 cursor-default items-end"
            onPointerEnter={() => setHover(i)}
          >
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.25 + i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: `${Math.max(4, (w.count / max) * 100)}%` }}
              className={cn(
                "w-full origin-bottom rounded-t-[4px] transition-colors",
                i === last ? "bg-primary" : "bg-primary/25",
                hover === i && i !== last && "bg-primary/45",
              )}
            />
          </div>
        ))}
      </div>
      {hover !== null ? (
        <div
          className="pointer-events-none absolute -top-9 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs shadow-md"
          style={{ left: `${((hover + 0.5) / weeks.length) * 100}%` }}
        >
          <span className="font-semibold tabular-nums">{weeks[hover].count}</span>{" "}
          <span className="text-muted-foreground">
            {weeks[hover].count === 1 ? "sign-up" : "sign-ups"} · wk of {weeks[hover].label}
          </span>
        </div>
      ) : null}
      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>{weeks[0]?.label}</span>
        <span>This week</span>
      </div>
      <table className="sr-only">
        <caption>Weekly email sign-ups</caption>
        <tbody>
          {weeks.map((w) => (
            <tr key={w.label}>
              <th scope="row">Week of {w.label}</th>
              <td>{w.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardStatCards({
  stats,
  weeks,
  newThisMonth,
}: {
  stats: DashboardStats;
  weeks: WeeklySignups;
  newThisMonth: number;
}) {
  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.06, delayChildren: 0.1 }}
    >
      <motion.div variants={item} className="sm:col-span-2 lg:row-span-2">
        <SpotlightCard className="h-full rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
          <Link
            href="/admin/subscribers"
            className="relative flex h-full min-h-[15rem] flex-col p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </span>
                Email subscribers
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover/spot:-translate-y-0.5 group-hover/spot:translate-x-0.5 group-hover/spot:text-primary" />
            </div>
            <div className="mt-4 flex items-end gap-3">
              <NumberTicker value={stats.subscribers} className="text-5xl font-semibold tracking-tight text-foreground" />
              {newThisMonth > 0 ? (
                <span className="mb-1.5 rounded-full bg-success/12 px-2 py-0.5 text-xs font-semibold text-success">
                  +{newThisMonth} in 30 days
                </span>
              ) : (
                <span className="mb-1.5 text-xs text-muted-foreground">No new sign-ups in 30 days</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Weekly sign-ups, last {weeks.length} weeks</p>
            <div className="mt-6 flex flex-1 flex-col">
              <SignupBars weeks={weeks} />
            </div>
          </Link>
        </SpotlightCard>
      </motion.div>

      {TILES.map((tile, i) => {
        const Icon = tile.icon;
        const value = stats[tile.key];
        const attention = tile.key === "unreadMessages" && value > 0;
        return (
          <motion.div key={tile.key} variants={item}>
            <SpotlightCard
              className={cn(
                "h-full rounded-2xl border bg-card shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none",
                attention ? "border-amber-200 bg-gradient-to-br from-amber-50/80 to-card" : "border-border",
              )}
              spotlightColor={attention ? "rgba(245, 158, 11, 0.14)" : undefined}
            >
              {attention ? <BorderBeam colorFrom="#f59e0b" colorTo="#fcd34d" duration={6} /> : null}
              <Link
                href={tile.href}
                className="relative flex h-full min-h-[7.25rem] flex-col justify-between p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover/spot:rotate-[-6deg] group-hover/spot:scale-110",
                      attention ? "bg-amber-100 text-amber-800" : "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-200 group-hover/spot:opacity-100" />
                </div>
                <div>
                  <NumberTicker
                    value={value}
                    delay={0.1 + i * 0.05}
                    className="text-3xl font-semibold leading-none tracking-tight text-foreground"
                  />
                  <p className="mt-1.5 text-sm font-medium text-foreground">{tile.label}</p>
                  <p className="text-xs text-muted-foreground">{tile.hint}</p>
                </div>
              </Link>
            </SpotlightCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
