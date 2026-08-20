"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteMessageAction,
  updateMessageStatusAction,
} from "@/lib/actions/admin";
import type { ContactMessage, MessageStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Row = ContactMessage & { created_label: string };

export function MessagesClient({ messages }: { messages: Row[] }) {
  const [rows, setRows] = useState(messages);
  const [pending, startTransition] = useTransition();

  function setStatus(id: string, status: MessageStatus) {
    startTransition(async () => {
      const result = await updateMessageStatusAction(id, status);
      if (result.success) {
        setRows((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
        toast.success(result.message);
      } else toast.error(result.error);
    });
  }

  function onDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    startTransition(async () => {
      const result = await deleteMessageAction(id);
      if (result.success) {
        setRows((prev) => prev.filter((m) => m.id !== id));
        toast.success(result.message);
      } else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-4">
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          No messages yet.
        </p>
      ) : (
        rows.map((m) => (
          <article key={m.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium text-foreground">{m.subject}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {m.name} · {m.email}
                  {m.phone ? ` · ${m.phone}` : ""} · {m.created_label}
                </p>
              </div>
              <Badge
                variant={
                  m.status === "unread"
                    ? "warning"
                    : m.status === "replied"
                      ? "success"
                      : "secondary"
                }
              >
                {m.status}
              </Badge>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {m.message}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => setStatus(m.id, "read")}
              >
                Mark read
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => setStatus(m.id, "replied")}
              >
                Mark replied
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => setStatus(m.id, "archived")}
              >
                Archive
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => onDelete(m.id)}
              >
                Delete
              </Button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
