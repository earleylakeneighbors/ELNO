"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  format,
  formatDistanceToNowStrict,
  isThisWeek,
  isToday,
  isYesterday,
} from "date-fns";
import {
  Archive,
  ArchiveRestore,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  MailOpen,
  Phone,
  Reply,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { deleteMessageAction, updateMessageStatusAction } from "@/lib/actions/admin";
import type { ContactMessage, MessageStatus } from "@/lib/types";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import { EmptyIllustration, Postmark } from "@/components/admin/illustrations";

type Filter = "inbox" | "unread" | "replied" | "archived";

const UNDO_MS = 5000;

const TEMPLATES: { id: string; label: string; body: (first: string) => string }[] = [
  {
    id: "thanks",
    label: "Thank you",
    body: (first) =>
      `Hi ${first},\n\nThank you for reaching out to the ${SITE.name}. We appreciate you taking the time to write, and we'll follow up soon.\n\nWarmly,\nELNO`,
  },
  {
    id: "events",
    label: "Event details",
    body: (first) =>
      `Hi ${first},\n\nThanks for your interest! You can find all upcoming gatherings, times, and locations at ${SITE.url}/events. We'd love to see you there.\n\nSee you by the lake,\nELNO`,
  },
  {
    id: "volunteer",
    label: "Volunteering",
    body: (first) =>
      `Hi ${first},\n\nWe'd love your help! Our volunteers make everything from lake cleanups to block parties possible. Reply with the kinds of things you enjoy and we'll match you with an upcoming project.\n\nThank you,\nELNO`,
  },
  {
    id: "looking",
    label: "Looking into it",
    body: (first) =>
      `Hi ${first},\n\nThanks for flagging this. We're looking into it now and will get back to you with an update shortly.\n\nBest,\nELNO`,
  },
];

function matchesFilter(m: ContactMessage, filter: Filter) {
  if (filter === "archived") return m.status === "archived";
  if (filter === "unread") return m.status === "unread";
  if (filter === "replied") return m.status === "replied";
  return m.status !== "archived";
}

function bucketFor(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  if (isThisWeek(d)) return "Earlier this week";
  return format(d, "MMMM yyyy");
}

function shortTime(iso: string) {
  const d = new Date(iso);
  if (isToday(d)) return format(d, "h:mm a");
  if (isThisWeek(d)) return format(d, "EEE");
  return format(d, "MMM d");
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

export function MessagesClient({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [serverRows, setServerRows] = useState(messages);
  const [prevMessages, setPrevMessages] = useState(messages);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, MessageStatus>>({});
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("inbox");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    messages.find((m) => m.status !== "archived")?.id ?? null,
  );
  const [mobileDetail, setMobileDetail] = useState(false);
  const [, startTransition] = useTransition();
  const pendingDeletes = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const replyRef = useRef<HTMLTextAreaElement>(null);

  // Fresh server data (after router.refresh) replaces local optimistic state.
  if (messages !== prevMessages) {
    setPrevMessages(messages);
    setServerRows(messages);
    setStatusOverrides({});
  }

  const rows = useMemo(
    () =>
      serverRows
        .filter((m) => !hidden.has(m.id))
        .map((m) => (statusOverrides[m.id] ? { ...m, status: statusOverrides[m.id] } : m)),
    [serverRows, hidden, statusOverrides],
  );

  const counts = useMemo(
    () => ({
      inbox: rows.filter((m) => matchesFilter(m, "inbox")).length,
      unread: rows.filter((m) => m.status === "unread").length,
      replied: rows.filter((m) => m.status === "replied").length,
      archived: rows.filter((m) => m.status === "archived").length,
    }),
    [rows],
  );

  function visibleFor(f: Filter, q: string) {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (m) =>
        matchesFilter(m, f) &&
        (!needle ||
          [m.name, m.email, m.subject, m.message].some((v) => v.toLowerCase().includes(needle))),
    );
  }

  const visible = visibleFor(filter, query);

  const groups: { label: string; items: ContactMessage[] }[] = [];
  for (const m of visible) {
    const label = bucketFor(m.created_at);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(m);
    else groups.push({ label, items: [m] });
  }

  const selected = rows.find((m) => m.id === selectedId) ?? null;
  const selectedIndex = visible.findIndex((m) => m.id === selectedId);

  /** Apply a new filter/search and keep the selection inside the visible list. */
  function applyView(f: Filter, q: string) {
    setFilter(f);
    setQuery(q);
    const next = visibleFor(f, q);
    if (!selectedId || !next.some((m) => m.id === selectedId)) setSelectedId(next[0]?.id ?? null);
  }

  function setLocalStatus(id: string, status: MessageStatus) {
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));
  }

  function persistStatus(
    message: ContactMessage,
    status: MessageStatus,
    opts?: { silent?: boolean },
  ) {
    const previous = message.status;
    if (previous === status) return;
    setLocalStatus(message.id, status);

    // Leaving the current view (e.g. archiving from Inbox) moves on to the next message.
    if (!matchesFilter({ ...message, status }, filter) && message.id === selectedId) {
      const neighbor = visible[selectedIndex + 1] ?? visible[selectedIndex - 1];
      setSelectedId(neighbor?.id ?? null);
    }

    startTransition(async () => {
      const result = await updateMessageStatusAction(message.id, status);
      if (!result.success) {
        toast.error(result.error);
        setLocalStatus(message.id, previous);
        return;
      }
      router.refresh();
      if (opts?.silent) return;
      toast.success(
        status === "archived"
          ? "Message archived"
          : status === "replied"
            ? "Marked as replied"
            : status === "unread"
              ? "Marked as unread"
              : "Moved to inbox",
        {
          action: {
            label: "Undo",
            onClick: () => {
              persistStatus({ ...message, status }, previous, { silent: true });
              setSelectedId(message.id);
            },
          },
        },
      );
    });
  }

  // Auto-mark as read after a short dwell on an unread message.
  const markRead = useEffectEvent((id: string) => {
    const target = rows.find((m) => m.id === id);
    if (target?.status === "unread") persistStatus(target, "read", { silent: true });
  });
  const dwellId = selected?.status === "unread" ? selected.id : null;
  useEffect(() => {
    if (!dwellId) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (!desktop && !mobileDetail) return;
    const t = setTimeout(() => markRead(dwellId), 1200);
    return () => clearTimeout(t);
  }, [dwellId, mobileDetail]);

  // Flush any pending deletes if the admin leaves the page mid-undo window.
  useEffect(() => {
    const pending = pendingDeletes.current;
    return () => {
      for (const [id, t] of pending) {
        clearTimeout(t);
        void deleteMessageAction(id);
      }
      pending.clear();
    };
  }, []);

  function select(id: string) {
    setSelectedId(id);
    setMobileDetail(true);
  }

  function step(dir: 1 | -1) {
    if (visible.length === 0) return;
    const next = selectedIndex === -1 ? 0 : selectedIndex + dir;
    const target = visible[Math.max(0, Math.min(visible.length - 1, next))];
    if (target) setSelectedId(target.id);
  }

  function setHiddenId(id: string, isHidden: boolean) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (isHidden) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function onDelete(message: ContactMessage) {
    const neighbor = visible[selectedIndex + 1] ?? visible[selectedIndex - 1];
    setHiddenId(message.id, true);
    setSelectedId(neighbor?.id ?? null);
    if (!neighbor) setMobileDetail(false);

    const timer = setTimeout(async () => {
      pendingDeletes.current.delete(message.id);
      const result = await deleteMessageAction(message.id);
      if (!result.success) {
        toast.error(result.error);
        setHiddenId(message.id, false);
      } else {
        router.refresh();
      }
    }, UNDO_MS);
    pendingDeletes.current.set(message.id, timer);

    toast("Message deleted", {
      description: message.subject,
      duration: UNDO_MS,
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(timer);
          pendingDeletes.current.delete(message.id);
          setHiddenId(message.id, false);
          setSelectedId(message.id);
        },
      },
    });
  }

  // Keyboard shortcuts: j/k navigate, e archive, u unread, r reply, # delete.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
    if (document.querySelector("[role=dialog]")) return;
    const key = e.key;
    if (key === "j" || key === "ArrowDown") {
      e.preventDefault();
      step(1);
    } else if (key === "k" || key === "ArrowUp") {
      e.preventDefault();
      step(-1);
    } else if (!selected) {
      return;
    } else if (key === "e") {
      persistStatus(selected, selected.status === "archived" ? "read" : "archived");
    } else if (key === "u") {
      persistStatus(selected, "unread");
    } else if (key === "r") {
      e.preventDefault();
      replyRef.current?.focus();
    } else if (key === "#" || key === "Delete") {
      onDelete(selected);
    }
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const tabs = [
    { value: "inbox" as const, label: "Inbox", count: counts.inbox },
    { value: "unread" as const, label: "Unread", count: counts.unread },
    { value: "replied" as const, label: "Replied", count: counts.replied },
    { value: "archived" as const, label: "Archived", count: counts.archived },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm md:grid md:h-[calc(100dvh-13rem)] md:min-h-[560px] md:grid-cols-[minmax(300px,380px)_1fr]">
      {/* List pane */}
      <section
        className={cn(
          "flex min-h-0 flex-col border-border md:border-r",
          mobileDetail ? "hidden md:flex" : "flex",
        )}
        aria-label="Message list"
      >
        <div className="space-y-3 border-b border-border p-4">
          <label className="relative block">
            <span className="sr-only">Search messages</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => applyView(filter, e.target.value)}
              placeholder="Search people, subjects, words…"
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm transition-shadow placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <AnimatedTabs items={tabs} value={filter} onChange={(f) => applyView(f, query)} size="sm" ariaLabel="Filter messages" className="w-full" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <EmptyIllustration variant={query ? "search" : "inbox"} />
              <p className="mt-4 font-display text-lg">
                {query ? "No matches" : filter === "unread" ? "You're all caught up" : "Nothing here yet"}
              </p>
              <p className="mt-1 max-w-[16rem] text-sm text-muted-foreground">
                {query
                  ? "Try a different name, subject, or word."
                  : filter === "unread"
                    ? "Every note from neighbors has been read. Nice work."
                    : "Notes from the website contact form will land here."}
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                <p className="sticky top-0 z-10 bg-card/95 px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground backdrop-blur">
                  {group.label}
                </p>
                <ul className="px-2 pb-1">
                  <AnimatePresence initial={false}>
                    {group.items.map((m) => {
                      const active = m.id === selectedId;
                      const unread = m.status === "unread";
                      return (
                        <motion.li
                          key={m.id}
                          layout={!reduce}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0, x: -24 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <button
                            type="button"
                            onClick={() => select(m.id)}
                            aria-current={active ? "true" : undefined}
                            className="group relative flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {active ? (
                              <motion.span
                                layoutId="msg-active"
                                className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-inset ring-primary/20"
                                transition={{ type: "spring", bounce: 0.12, duration: 0.4 }}
                              />
                            ) : (
                              <span className="absolute inset-0 rounded-xl bg-muted/70 opacity-0 transition-opacity group-hover:opacity-100" />
                            )}
                            <span className="relative">
                              <Avatar name={m.name} seed={m.email} />
                              {unread ? (
                                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-amber-500" />
                              ) : null}
                            </span>
                            <span className="relative min-w-0 flex-1">
                              <span className="flex items-baseline justify-between gap-2">
                                <span className={cn("truncate text-sm", unread ? "font-semibold text-foreground" : "font-medium text-foreground/85")}>
                                  {m.name}
                                </span>
                                <time
                                  dateTime={m.created_at}
                                  suppressHydrationWarning
                                  className={cn("shrink-0 text-[11px] tabular-nums", unread ? "font-semibold text-amber-700" : "text-muted-foreground")}
                                >
                                  {shortTime(m.created_at)}
                                </time>
                              </span>
                              <span className={cn("mt-0.5 block truncate text-sm", unread ? "font-medium text-foreground" : "text-foreground/75")}>
                                {m.subject}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                {m.message.replace(/\s+/g, " ")}
                              </span>
                              {m.status === "replied" ? (
                                <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-success">
                                  <Reply className="h-3 w-3" /> Replied
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="hidden items-center gap-3 border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground md:flex">
          <Shortcut k="J" /> <Shortcut k="K" /> move
          <Shortcut k="E" /> archive
          <Shortcut k="R" /> reply
          <Shortcut k="U" /> unread
        </div>
      </section>

      {/* Reader pane */}
      <section
        className={cn(
          "relative min-h-0 bg-[color-mix(in_oklab,var(--background)_60%,var(--card))]",
          mobileDetail ? "block" : "hidden md:block",
        )}
        aria-label="Message"
      >
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.div
              key={selected.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-full min-h-0 flex-col"
            >
              <Reader
                message={selected}
                position={selectedIndex + 1}
                total={visible.length}
                onBack={() => setMobileDetail(false)}
                onPrev={() => step(-1)}
                onNext={() => step(1)}
                onStatus={(s) => persistStatus(selected, s)}
                onDelete={() => onDelete(selected)}
                replyRef={replyRef}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center p-10 text-center"
            >
              <EmptyIllustration variant="inbox" className="h-36" />
              <p className="mt-4 font-display text-xl">Select a message</p>
              <p className="mt-1 text-sm text-muted-foreground">Pick a note from the list to read and reply.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function Shortcut({ k }: { k: string }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-card px-1 font-sans text-[10px] font-semibold text-foreground/70">
      {k}
    </kbd>
  );
}

const STEPS: { key: MessageStatus; label: string }[] = [
  { key: "unread", label: "Received" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
];

function Progress({ status }: { status: MessageStatus }) {
  const reached = status === "unread" ? 0 : status === "replied" ? 2 : status === "read" ? 1 : 1;
  return (
    <ol className="flex items-center gap-2" aria-label="Message progress">
      {STEPS.map((s, i) => {
        const done = i <= reached;
        return (
          <li key={s.key} className="flex items-center gap-2">
            {i > 0 ? (
              <span className="relative h-0.5 w-8 overflow-hidden rounded-full bg-border sm:w-12">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-primary"
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <motion.span
                initial={false}
                animate={{ scale: done ? 1 : 0.85 }}
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors duration-300",
                  done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </motion.span>
              <span className={cn("text-xs", done ? "font-medium text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
            </span>
          </li>
        );
      })}
      {status === "archived" ? (
        <li className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Archived
        </li>
      ) : null}
    </ol>
  );
}

function CopyChip({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          toast.error("Could not copy to clipboard");
        }
      }}
      className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
      aria-label={`Copy ${label}`}
    >
      <span className="truncate">{value}</span>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className="h-3.5 w-3.5 text-success" />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function Reader({
  message,
  position,
  total,
  onBack,
  onPrev,
  onNext,
  onStatus,
  onDelete,
  replyRef,
}: {
  message: ContactMessage;
  position: number;
  total: number;
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  onStatus: (status: MessageStatus) => void;
  onDelete: () => void;
  replyRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const first = firstName(message.name);
  const [template, setTemplate] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const received = new Date(message.created_at);

  const mailto = useMemo(() => {
    const quoted = message.message.slice(0, 600).split("\n").map((l) => `> ${l}`).join("\n");
    const body = `${reply || `Hi ${first},\n\n`}\n\n— On ${format(received, "MMM d, yyyy")}, ${message.name} wrote:\n${quoted}`;
    const subject = message.subject.toLowerCase().startsWith("re:") ? message.subject : `Re: ${message.subject}`;
    return `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, reply, first]);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border bg-card/70 px-3 py-2 backdrop-blur">
        <Button variant="ghost" size="sm" className="md:hidden" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-1">
          <ToolbarButton label="Mark unread" onClick={() => onStatus("unread")} disabled={message.status === "unread"}>
            <MailOpen className="h-4 w-4" />
          </ToolbarButton>
          {message.status === "archived" ? (
            <ToolbarButton label="Move to inbox" onClick={() => onStatus("read")}>
              <ArchiveRestore className="h-4 w-4" />
            </ToolbarButton>
          ) : (
            <ToolbarButton label="Archive" onClick={() => onStatus("archived")}>
              <Archive className="h-4 w-4" />
            </ToolbarButton>
          )}
          <ToolbarButton label="Delete" onClick={onDelete} danger>
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <span className="hidden tabular-nums sm:inline">
            {position > 0 ? `${position} of ${total}` : ""}
          </span>
          <ToolbarButton label="Previous message" onClick={onPrev} disabled={position <= 1}>
            <ChevronUp className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton label="Next message" onClick={onNext} disabled={position >= total}>
            <ChevronDown className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-8 sm:py-8">
          <Progress status={message.status} />

          <h2 className="mt-5 font-display text-2xl leading-tight text-foreground sm:text-[1.7rem]">
            {message.subject}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Avatar name={message.name} seed={message.email} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{message.name}</p>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                {format(received, "EEEE, MMMM d · h:mm a")} ·{" "}
                {formatDistanceToNowStrict(received, { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyChip value={message.email} label="email address" />
            {message.phone ? (
              <a
                href={`tel:${message.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {message.phone}
              </a>
            ) : null}
          </div>

          {/* The letter */}
          <motion.article
            initial={{ rotate: -0.6, y: 8, opacity: 0 }}
            animate={{ rotate: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="paper-surface relative mt-6 rounded-2xl border border-[#ebe4d4] px-6 pb-8 pt-7 shadow-[0_1px_0_#fff_inset,0_18px_40px_-24px_rgba(63,95,96,0.45)] sm:px-9"
          >
            <Postmark
              top={format(received, "MMM d").toUpperCase()}
              bottom={format(received, "yyyy")}
              className="pointer-events-none absolute -top-5 right-5 h-20 w-20 rotate-[-12deg] opacity-80 sm:right-8"
            />
            <p className="pr-20 font-display text-lg italic text-foreground/80">Dear ELNO,</p>
            <div className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
              {message.message}
            </div>
            <p className="mt-6 font-display text-base italic text-foreground/70">— {message.name}</p>
          </motion.article>

          {/* Reply composer */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <Reply className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Reply to {first}</p>
              <span className="ml-auto text-xs text-muted-foreground">Opens in your email app</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTemplate(t.id);
                    setReply(t.body(first));
                    replyRef.current?.focus();
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all active:scale-95",
                    template === t.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <textarea
              ref={replyRef}
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
                setTemplate(null);
              }}
              rows={5}
              placeholder={`Hi ${first}, …`}
              className="mt-3 w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm leading-6 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
              {message.status !== "replied" ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => onStatus("replied")}>
                  <Check className="h-4 w-4" /> Mark replied
                </Button>
              ) : null}
              <Button asChild size="sm" className="group">
                <a
                  href={mailto}
                  onClick={() => {
                    if (message.status !== "replied") setTimeout(() => onStatus("replied"), 400);
                  }}
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  Send via email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors disabled:pointer-events-none disabled:opacity-40",
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
