"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteSubscriberAdminAction,
  deleteSubscribersBulkAction,
  type SubscriberSort,
} from "@/lib/actions/admin-subscribers";
import type { Subscriber } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Row = Subscriber & { created_label: string };

function displayName(s: Subscriber) {
  return [s.first_name, s.last_name].filter(Boolean).join(" ");
}

export function SubscribersClient({ subscribers }: { subscribers: Row[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SubscriberSort>("newest");
  const [rows, setRows] = useState(subscribers);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Row | null>(null);
  const [pending, startTransition] = useTransition();

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

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((s) => selected.has(s.id));

  function toggleAll() {
    if (allFilteredSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(filtered.map((s) => s.id)));
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
    if (format === "xlsx") {
      return `/admin/subscribers/export${qs ? `?${qs}` : ""}`;
    }
    return `/admin/subscribers/export.csv${qs ? `?${qs}` : ""}`;
  }

  function onDelete(id: string) {
    if (!confirm("Remove this subscriber from the email list?")) return;
    startTransition(async () => {
      const result = await deleteSubscriberAdminAction(id);
      if (result.success) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        if (detail?.id === id) setDetail(null);
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onBulkDelete() {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (!confirm(`Remove ${ids.length} subscriber(s) from the email list?`)) return;
    startTransition(async () => {
      const result = await deleteSubscribersBulkAction(ids);
      if (result.success) {
        setRows((prev) => prev.filter((r) => !selected.has(r.id)));
        setSelected(new Set());
        if (detail && selected.has(detail.id)) setDetail(null);
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search name, email, address, interests…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SubscriberSort)}
          className="h-11 rounded-lg border border-input bg-card px-3 text-sm"
          aria-label="Sort subscribers"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name_asc">Name A–Z</option>
          <option value="name_desc">Name Z–A</option>
        </select>
        <Button asChild>
          <a href={exportUrl("xlsx")}>Export to Excel</a>
        </Button>
        <Button asChild variant="outline">
          <a href={exportUrl("csv")}>Export CSV</a>
        </Button>
        {selected.size > 0 ? (
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={onBulkDelete}
          >
            Delete selected ({selected.size})
          </Button>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                  className="h-4 w-4 accent-primary"
                />
              </th>
              <th className="px-4 py-3 font-medium">First name</th>
              <th className="px-4 py-3 font-medium">Last name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Street address</th>
              <th className="px-4 py-3 font-medium">Interests</th>
              <th className="px-4 py-3 font-medium">Consent</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggleOne(s.id)}
                    aria-label={`Select ${displayName(s)}`}
                    className="h-4 w-4 accent-primary"
                  />
                </td>
                <td className="px-4 py-3">{s.first_name}</td>
                <td className="px-4 py-3">{s.last_name ?? "—"}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.street_address ?? "—"}</td>
                <td
                  className="max-w-[180px] truncate px-4 py-3"
                  title={s.interests ?? undefined}
                >
                  {s.interests ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={s.consent ? "success" : "secondary"}>
                    {s.consent ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{s.created_label}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetail(s)}
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onClick={() => onDelete(s.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                  No email list submissions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {detail ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscriber-detail-title"
          onClick={() => setDetail(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="subscriber-detail-title" className="font-display text-2xl">
              {displayName(detail)}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{detail.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Street address</dt>
                <dd className="font-medium">{detail.street_address || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Interests</dt>
                <dd className="whitespace-pre-wrap font-medium">
                  {detail.interests || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Consent</dt>
                <dd className="font-medium">{detail.consent ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Submitted</dt>
                <dd className="font-medium">{detail.created_label}</dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDetail(null)}>
                Close
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={pending}
                onClick={() => onDelete(detail.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
