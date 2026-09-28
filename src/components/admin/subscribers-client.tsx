"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { formatDistanceToNowStrict, subDays } from "date-fns";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Home,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  deleteSubscriberAdminAction,
  deleteSubscribersBulkAction,
  type SubscriberSort,
} from "@/lib/actions/admin-subscribers";
import type { Subscriber } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Dialog, DialogDescription, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/page-header";

type Row = Subscriber & { created_label: string };

const SORTS: { value: SubscriberSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
];

function displayName(s: Subscriber) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ");
}

function interestList(raw: string | null) {
  if (!raw) return [];
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked || indeterminate ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:border-primary/50",
      )}
    >
      <AnimatePresence initial={false}>
        {checked ? (
          <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.span>
        ) : indeterminate ? (
          <motion.span key="i" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="h-0.5 w-2 rounded bg-current" />
        ) : null}
      </AnimatePresence>
    </button>
  );
}

export function SubscribersClient({ subscribers }: { subscribers: Row[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SubscriberSort>("newest");
  const [rows, setRows] = useState(subscribers);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetailRow] = useState<Row | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Keep the row mounted while the sheet animates closed.
  function setDetail(row: Row | null) {
    if (row) setDetailRow(row);
    setDetailOpen(row !== null);
  }
  const [now] = useState(() => Date.now());

  const summary = useMemo(() => {
    const monthAgo = subDays(now, 30).getTime();
    const consented = rows.filter((r) => r.consent).length;
    return {
      total: rows.length,
      consentPct: rows.length ? Math.round((consented / rows.length) * 100) : 0,
      recent: rows.filter((r) => new Date(r.created_at).getTime() >= monthAgo).length,
    };
  }, [rows, now]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = list.filter(
        (s) =>
          displayName(s).toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.street_address ?? "").toLowerCase().includes(q) ||
          (s.interests ?? "").toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const nameA = displayName(a).toLowerCase();
      const nameB = displayName(b).toLowerCase();
      switch (sort) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name_asc":
          return nameA.localeCompare(nameB);
        case "name_desc":
          return nameB.localeCompare(nameA);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [rows, query, sort]);

  const allSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.id));
  const someSelected = !allSelected && filtered.some((s) => selected.has(s.id));

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

  function exportUrl(format: "xlsx" | "csv") {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    params.set("sort", sort);
    const qs = params.toString();
    const base = format === "xlsx" ? "/admin/subscribers/export" : "/admin/subscribers/export.csv";
    return `${base}${qs ? `?${qs}` : ""}`;
  }

  async function deleteOne(id: string) {
    const result = await deleteSubscriberAdminAction(id);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (detail?.id === id) setDetail(null);
    toast.success(result.message);
    return true;
  }

  async function deleteSelected() {
    const ids = [...selected];
    const result = await deleteSubscribersBulkAction(ids);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    setSelected(new Set());
    toast.success(result.message);
    return true;
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Users, label: "On the list", value: summary.total, suffix: "" },
          { icon: UserPlus, label: "Joined in the last 30 days", value: summary.recent, suffix: "" },
          { icon: ShieldCheck, label: "Gave email consent", value: summary.consentPct, suffix: "%" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight">
                <NumberTicker value={s.value} />
                {s.suffix}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[14rem] flex-1">
          <span className="sr-only">Search subscribers</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search name, email, address, interests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-9 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </label>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline" size="sm" className="h-10 bg-card">
              <ArrowDownUp className="h-4 w-4" />
              {SORTS.find((s) => s.value === sort)?.label}
            </Button>
          </DropdownMenu.Trigger>
          <MenuContent>
            {SORTS.map((s) => (
              <DropdownMenu.Item key={s.value} onSelect={() => setSort(s.value)} className={MENU_ITEM}>
                <Check className={cn("h-4 w-4", s.value === sort ? "opacity-100" : "opacity-0")} />
                {s.label}
              </DropdownMenu.Item>
            ))}
          </MenuContent>
        </DropdownMenu.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button size="sm" className="h-10">
              <Download className="h-4 w-4" /> Export
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenu.Trigger>
          <MenuContent>
            <DropdownMenu.Item asChild className={MENU_ITEM}>
              <a href={exportUrl("xlsx")}>
                <FileSpreadsheet className="h-4 w-4 text-success" />
                <span>
                  Excel workbook
                  <span className="block text-xs text-muted-foreground">.xlsx · {query ? "filtered" : "everyone"}</span>
                </span>
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className={MENU_ITEM}>
              <a href={exportUrl("csv")}>
                <FileText className="h-4 w-4 text-primary" />
                <span>
                  CSV file
                  <span className="block text-xs text-muted-foreground">For Mailchimp & others</span>
                </span>
              </a>
            </DropdownMenu.Item>
          </MenuContent>
        </DropdownMenu.Root>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          illustration={query ? "search" : "people"}
          title={query ? "No one matches that search" : "No sign-ups yet"}
          description={query ? "Try a street name, interest, or part of an email." : "When neighbors join through the website, they'll appear here."}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} label="Select all" />
                </th>
                <th className="px-2 py-3 font-medium">Neighbor</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Interests</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((s) => {
                  const isSel = selected.has(s.id);
                  const interests = interestList(s.interests);
                  return (
                    <motion.tr
                      key={s.id}
                      layout="position"
                      exit={{ opacity: 0 }}
                      onClick={() => setDetail(s)}
                      className={cn(
                        "group cursor-pointer border-b border-border transition-colors last:border-0",
                        isSel ? "bg-primary/[0.06]" : "hover:bg-muted/40",
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox checked={isSel} onChange={() => toggleOne(s.id)} label={`Select ${displayName(s)}`} />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={displayName(s)} seed={s.email} />
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 truncate font-medium">
                              {displayName(s)}
                              {s.consent ? (
                                <ShieldCheck className="h-3.5 w-3.5 text-success" aria-label="Consented" />
                              ) : null}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">{s.street_address || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex max-w-[240px] flex-wrap gap-1">
                          {interests.slice(0, 2).map((i) => (
                            <span key={i} className="truncate rounded-full bg-accent px-2 py-0.5 text-[11px] text-accent-foreground">
                              {i}
                            </span>
                          ))}
                          {interests.length > 2 ? (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                              +{interests.length - 2}
                            </span>
                          ) : null}
                          {interests.length === 0 ? <span className="text-muted-foreground">—</span> : null}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground" title={s.created_label} suppressHydrationWarning>
                        {formatDistanceToNowStrict(new Date(s.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <ConfirmDialog
                          title="Remove from the email list?"
                          description={<>{displayName(s)} ({s.email}) will stop receiving neighborhood emails.</>}
                          confirmLabel="Remove"
                          onConfirm={() => deleteOne(s.id)}
                          trigger={
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                              aria-label={`Remove ${displayName(s)}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          }
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-border md:hidden">
            {filtered.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                <Checkbox checked={selected.has(s.id)} onChange={() => toggleOne(s.id)} label={`Select ${displayName(s)}`} />
                <button type="button" onClick={() => setDetail(s)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <Avatar name={displayName(s)} seed={s.email} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{displayName(s)}</span>
                    <span className="block truncate text-xs text-muted-foreground">{s.email}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Floating bulk bar */}
      <AnimatePresence>
        {selected.size > 0 ? (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 md:bottom-6 md:pl-64"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-foreground py-2 pl-4 pr-2 text-background shadow-2xl">
              <span className="text-sm font-medium tabular-nums">{selected.size} selected</span>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="rounded-lg px-2.5 py-1.5 text-sm text-background/70 transition-colors hover:bg-background/10 hover:text-background"
              >
                Clear
              </button>
              <ConfirmDialog
                title={`Remove ${selected.size} ${selected.size === 1 ? "person" : "people"}?`}
                description="They'll be taken off the email list. This can't be undone."
                confirmLabel="Remove all"
                onConfirm={deleteSelected}
                trigger={
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                }
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Detail sheet */}
      <Dialog open={detailOpen} onOpenChange={(open) => !open && setDetail(null)}>
        {detail ? (
          <SheetContent>
            <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-accent to-card px-6 pb-6 pt-10">
              <div className="admin-grid-bg absolute inset-0 opacity-60" aria-hidden />
              <div className="relative">
                <Avatar name={displayName(detail)} seed={detail.email} size="xl" className="ring-4 ring-card" />
                <DialogTitle className="mt-4 font-display text-2xl">{displayName(detail)}</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  Joined {detail.created_label}
                </DialogDescription>
              </div>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <DetailRow icon={Mail} label="Email">
                <a href={`mailto:${detail.email}`} className="text-primary hover:underline">
                  {detail.email}
                </a>
              </DetailRow>
              <DetailRow icon={Home} label="Street address">
                {detail.street_address || "Not provided"}
              </DetailRow>
              <DetailRow icon={Sparkles} label="Interests">
                {interestList(detail.interests).length ? (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {interestList(detail.interests).map((i) => (
                      <span key={i} className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                        {i}
                      </span>
                    ))}
                  </div>
                ) : (
                  "None shared"
                )}
              </DetailRow>
              <DetailRow icon={ShieldCheck} label="Email consent">
                {detail.consent ? (
                  <span className="text-success">Yes, opted in</span>
                ) : (
                  <span className="text-muted-foreground">Not given</span>
                )}
              </DetailRow>
            </div>
            <div className="flex gap-2 border-t border-border p-4">
              <Button asChild variant="outline" className="flex-1">
                <a href={`mailto:${detail.email}`}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              </Button>
              <ConfirmDialog
                title="Remove from the email list?"
                description={<>{displayName(detail)} will stop receiving neighborhood emails.</>}
                confirmLabel="Remove"
                onConfirm={() => deleteOne(detail.id)}
                trigger={
                  <Button type="button" variant="outline" className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" /> Remove
                  </Button>
                }
              />
            </div>
          </SheetContent>
        ) : null}
      </Dialog>
    </div>
  );
}

const MENU_ITEM =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none data-[highlighted]:bg-muted";

function MenuContent({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align="end"
        sideOffset={6}
        className="animate-scale-in z-50 min-w-[12rem] rounded-xl border border-border bg-card p-1 shadow-xl"
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}
