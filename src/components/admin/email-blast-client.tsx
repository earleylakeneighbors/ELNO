"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ExternalLink, Megaphone, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LIBRARY_DEDICATION_NEWS_SLUG } from "@/lib/content/library-dedication-announcement";
import {
  sendAnnouncementBlastAction,
  type BlastDeliverySummary,
} from "@/lib/actions/admin-email-blast";
import { StatusPill } from "@/components/ui/status-pill";
import type { AnnouncementBlastContent } from "@/lib/email/announcement-presets";
import type { Subscriber } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FormCard } from "@/components/admin/editor-parts";

function displayName(s: Subscriber) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ");
}

function SubscriberCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:border-primary/50",
      )}
    >
      {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
    </button>
  );
}

type Props = {
  subscribers: Subscriber[];
  emailConfigured: boolean;
  initialSelectedIds: string[];
  announcement: AnnouncementBlastContent;
};

export function EmailBlastClient({
  subscribers,
  emailConfigured,
  initialSelectedIds,
  announcement,
}: Props) {
  const validInitial = new Set(
    initialSelectedIds.filter((id) => subscribers.some((s) => s.id === id)),
  );
  const [query, setQuery] = useState("");
  const [consentOnly, setConsentOnly] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(validInitial);
  const [subject, setSubject] = useState(announcement.defaultSubject);
  const [sending, setSending] = useState(false);
  const [lastSend, setLastSend] = useState<BlastDeliverySummary[] | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (consentOnly && !s.consent) return false;
      if (!q) return true;
      return (
        displayName(s).toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [subscribers, query, consentOnly]);

  const allSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(filtered.map((s) => s.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedList = subscribers.filter((s) => selected.has(s.id));
  const selectedWithoutConsent = selectedList.filter((s) => !s.consent);
  const canSend =
    emailConfigured &&
    selected.size > 0 &&
    selected.size <= 100 &&
    selectedWithoutConsent.length === 0 &&
    !sending;

  async function handleSend() {
    setSending(true);
    try {
      const result = await sendAnnouncementBlastAction({
        subscriber_ids: [...selected],
        subject: subject.trim() || announcement.defaultSubject,
        preset: announcement.preset,
        send_token: crypto.randomUUID(),
      });
      if (!result.success) {
        toast.error(result.error);
        if (result.data?.deliveries?.length) {
          setLastSend(
            [...result.data.deliveries].sort((a, b) =>
              a.status === b.status ? 0 : a.status === "failed" ? -1 : 1,
            ),
          );
          router.refresh();
        }
        return false;
      }
      toast.success(result.message);
      if (result.data?.deliveries) {
        setLastSend(
          [...result.data.deliveries].sort((a, b) =>
            a.status === b.status ? 0 : a.status === "failed" ? -1 : 1,
          ),
        );
      }
      setSelected(new Set());
      router.refresh();
      return true;
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="space-y-4">
        {!emailConfigured ? (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p>
              Resend is not configured (<code className="text-xs">RESEND_API_KEY</code> and{" "}
              <code className="text-xs">RESEND_FROM_EMAIL</code>). Messages cannot be sent until those are set.
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[12rem] flex-1">
            <span className="sr-only">Search subscribers</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm outline-none ring-ring focus-visible:ring-2"
            />
          </label>
          <Button
            type="button"
            variant={consentOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setConsentOnly((v) => !v)}
          >
            <ShieldCheck className="h-4 w-4" />
            {consentOnly ? "Consented only" : "Show all"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={toggleAll} disabled={filtered.length === 0}>
            {allSelected ? "Clear filtered" : "Select filtered"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {selected.size} selected · max 100 per send
          {selectedWithoutConsent.length > 0
            ? ` · ${selectedWithoutConsent.length} without consent (remove to send)`
            : null}
        </p>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <ul className="max-h-[min(28rem,55vh)] divide-y divide-border overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">No matching subscribers.</li>
            ) : (
              filtered.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <SubscriberCheckbox
                    checked={selected.has(s.id)}
                    onChange={() => toggleOne(s.id)}
                    label={`Select ${displayName(s)}`}
                  />
                  <Avatar name={displayName(s)} seed={s.email} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{displayName(s)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{s.email}</span>
                  </span>
                  {s.consent ? (
                    <span className="hidden shrink-0 text-[10px] font-medium uppercase tracking-wide text-success sm:inline">
                      Opted in
                    </span>
                  ) : (
                    <span className="hidden shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:inline">
                      No consent
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

        {lastSend && lastSend.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Last send results</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {lastSend.filter((d) => d.status === "sent").length} sent ·{" "}
                {lastSend.filter((d) => d.status === "failed").length} failed
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-border">
                  {lastSend.map((d) => (
                    <tr key={`${d.email}-${d.status}`} className="px-4">
                      <td className="px-4 py-2">
                        <span className="block font-medium">{d.name}</span>
                        <span className="text-xs text-muted-foreground">{d.email}</span>
                      </td>
                      <td className="px-4 py-2">
                        <StatusPill tone={d.status === "sent" ? "success" : "danger"}>
                          {d.status === "sent" ? "Sent" : "Failed"}
                        </StatusPill>
                      </td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">
                        {d.error ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-4 lg:sticky lg:top-24">
        <FormCard title="Announcement">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Library dedication news
          </p>
          <h2 className="mt-2 font-display text-xl leading-snug text-foreground">{announcement.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{announcement.excerpt}</p>
          <Link
            href={`/news/${LIBRARY_DEDICATION_NEWS_SLUG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Preview on site <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="mt-6 space-y-2">
            <Label htmlFor="blast-subject">Email subject</Label>
            <Input
              id="blast-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={160}
            />
          </div>

          <ConfirmDialog
            title={`Email ${selected.size} ${selected.size === 1 ? "neighbor" : "neighbors"}?`}
            description={
              <>
                Each person will receive an individual message with a link to the neighborhood news story. This cannot be
                undone.
              </>
            }
            confirmLabel={sending ? "Sending…" : "Send now"}
            onConfirm={handleSend}
            trigger={
              <Button type="button" className="mt-6 w-full" disabled={!canSend}>
                <Megaphone className="h-4 w-4" />
                {selected.size === 0
                  ? "Select recipients"
                  : `Send to ${selected.size} ${selected.size === 1 ? "person" : "people"}`}
              </Button>
            }
          />
        </FormCard>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/admin/subscribers" className="text-primary hover:underline">
            Back to email list
          </Link>
        </p>
      </div>

      <AnimatePresence>
        {selected.size > 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-0 bottom-20 z-30 text-center text-sm text-muted-foreground md:bottom-4 md:pl-64 lg:hidden"
          >
            {selected.size} selected
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}