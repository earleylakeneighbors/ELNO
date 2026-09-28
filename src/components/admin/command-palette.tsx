"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  CalendarPlus,
  ExternalLink,
  FilePlus2,
  LogOut,
  Search,
  type LucideIcon,
} from "lucide-react";
import { ALL_LINKS } from "@/components/admin/nav-links";
import { logoutAction } from "@/lib/actions/admin";

const OPEN_EVENT = "admin:open-command";

const GROUP_CLASS =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function Item({
  icon: Icon,
  label,
  hint,
  keywords,
  onSelect,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  keywords?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={`${label} ${keywords ?? ""}`}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground aria-selected:bg-primary/10 aria-selected:text-primary"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors group-aria-selected:border-primary/30 group-aria-selected:text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="flex-1">{label}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </Command.Item>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="animate-overlay-in fixed inset-0 z-[80] bg-foreground/30 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          className="animate-dialog fixed left-1/2 top-[38%] z-[81] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl focus:outline-none"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>
          <Command loop className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <Command.Input
                autoFocus
                placeholder="Jump to a page or action…"
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>
            <Command.List className="max-h-[min(60vh,420px)] overflow-y-auto p-2 scrollbar-thin">
              <Command.Empty className="px-3 py-10 text-center text-sm text-muted-foreground">
                Nothing matches that. Try “events” or “export”.
              </Command.Empty>
              <Command.Group
                heading="Create"
                className={GROUP_CLASS}
              >
                <Item icon={CalendarPlus} label="New event" keywords="create schedule" onSelect={() => go("/admin/events/new")} />
                <Item icon={FilePlus2} label="New news post" keywords="create announcement write" onSelect={() => go("/admin/news/new")} />
              </Command.Group>
              <Command.Group
                heading="Go to"
                className={GROUP_CLASS}
              >
                {ALL_LINKS.map((l) => (
                  <Item key={l.href} icon={l.icon} label={l.label} keywords={l.keywords} onSelect={() => go(l.href)} />
                ))}
              </Command.Group>
              <Command.Group
                heading="Other"
                className={GROUP_CLASS}
              >
                <Item
                  icon={ExternalLink}
                  label="View public site"
                  keywords="website homepage"
                  onSelect={() => {
                    setOpen(false);
                    window.open("/", "_blank", "noopener");
                  }}
                />
                <Item
                  icon={LogOut}
                  label="Sign out"
                  keywords="logout exit"
                  onSelect={() => {
                    setOpen(false);
                    void logoutAction();
                  }}
                />
              </Command.Group>
            </Command.List>
            <div className="flex items-center gap-4 border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
              <span>
                <kbd className="font-sans">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="font-sans">↵</kbd> open
              </span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
