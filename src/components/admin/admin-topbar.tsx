"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import { Fragment } from "react";
import { ALL_LINKS } from "@/components/admin/nav-links";
import { openCommandPalette } from "@/components/admin/command-palette";

function crumbsFor(pathname: string) {
  const crumbs: { href: string; label: string }[] = [{ href: "/admin", label: "Admin" }];
  const section = ALL_LINKS.filter((l) => l.href !== "/admin").find((l) =>
    pathname.startsWith(l.href),
  );
  if (!section) return crumbs;
  crumbs.push({ href: section.href, label: section.label });
  const rest = pathname.slice(section.href.length).split("/").filter(Boolean);
  if (rest[0] === "new") crumbs.push({ href: pathname, label: "New" });
  else if (rest[0]) crumbs.push({ href: pathname, label: "Edit" });
  return crumbs;
}

export function AdminTopbar() {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname);

  return (
    <div className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/admin" className="md:hidden" aria-label="Dashboard">
          <Image src="/images/elno-logo.png" alt="" width={28} height={28} className="rounded-full" />
        </Link>
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex items-center gap-1.5 text-sm">
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              return (
                <Fragment key={c.href + c.label}>
                  {i > 0 ? (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" aria-hidden />
                  ) : null}
                  <li className="truncate">
                    {last ? (
                      <span className="font-medium text-foreground" aria-current="page">
                        {c.label}
                      </span>
                    ) : (
                      <Link href={c.href} className="text-muted-foreground transition-colors hover:text-foreground">
                        {c.label}
                      </Link>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </nav>
        <button
          type="button"
          onClick={openCommandPalette}
          className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
