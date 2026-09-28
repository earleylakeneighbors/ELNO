"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Light text while floating over the home hero photo.
  const light = overHero && !scrolled && !open;

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500",
        overHero ? "fixed" : "sticky",
        light
          ? "border-b border-transparent text-white"
          : "border-b border-foreground/10 bg-background/85 text-foreground backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src="/images/elno-logo.png"
            alt=""
            width={40}
            height={40}
            className={cn("h-9 w-9 rounded-full object-cover transition-shadow", light && "shadow-lg shadow-black/20")}
            priority
          />
          <span className="leading-none">
            <span className="block font-display text-[1.15rem] tracking-tight">{SITE.shortName}</span>
            <span className={cn("mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em]", light ? "text-white/70" : "text-muted-foreground")}>
              Neighborhood Org.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-3.5 py-2 text-[15px] transition-opacity",
                  active ? "opacity-100" : "opacity-75 hover:opacity-100",
                )}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId="site-nav-active"
                    className="absolute inset-x-3.5 -bottom-0.5 h-px bg-current"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                ) : null}
              </Link>
            );
          })}
          <Link
            href="/join"
            className={cn(
              "group ml-4 inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
              light ? "bg-white text-foreground hover:bg-white/90" : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            Join the email list
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>

        <button
          type="button"
          className="relative z-10 flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-6">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-300",
                open && "translate-y-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-300",
                open && "-translate-y-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[4.5rem] z-40 flex flex-col bg-background px-5 pb-10 pt-6 md:hidden"
          >
            <nav className="flex flex-col" aria-label="Mobile">
              {[{ href: "/", label: "Home" }, ...navLinks].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="flex items-baseline justify-between border-b border-foreground/10 py-4 font-display text-3xl text-foreground"
                  >
                    {link.label}
                    <span className="font-sans text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-auto"
            >
              <Link
                href="/join"
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-foreground text-base font-medium text-background"
              >
                Join the email list <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-center text-xs text-muted-foreground">{SITE.location}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
