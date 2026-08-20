"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAdminAction, deleteAdminAction } from "@/lib/actions/admin-users";
import type { Profile } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const initial: ActionResult<Profile> | null = null;

export function UsersClient({ users }: { users: Profile[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(users);
  const [open, setOpen] = useState(false);
  const [pendingDelete, startDelete] = useTransition();
  const [state, formAction, pending] = useActionState(createAdminAction, initial);

  useEffect(() => {
    setRows(users);
  }, [users]);

  useEffect(() => {
    if (state?.success && state.data) {
      toast.success(state.message);
      setOpen(false);
      router.refresh();
    } else if (state && !state.success) {
      toast.error(state.error);
    }
  }, [state, router]);

  function onDelete(id: string, email: string) {
    if (!confirm(`Remove admin access for ${email}? This deletes their account.`)) return;
    startDelete(async () => {
      const result = await deleteAdminAction(id);
      if (result.success) {
        setRows((prev) => prev.filter((u) => u.id !== id));
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Admins can sign in to the dashboard and manage the website.
        </p>
        <Button type="button" onClick={() => setOpen(true)}>
          Add new
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{u.full_name || "—"}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant="default">Admin</Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(u.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={pendingDelete}
                    onClick={() => onDelete(u.id, u.email)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No admin users yet. Click <strong>Add new</strong> to create one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-admin-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="add-admin-title" className="font-display text-2xl">
              Add new admin
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Creates a Supabase Auth account with admin access to this dashboard.
            </p>
            <form action={formAction} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" required autoComplete="name" />
                {state && !state.success && state.fieldErrors?.full_name ? (
                  <p className="text-sm text-destructive">{state.fieldErrors.full_name[0]}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
                {state && !state.success && state.fieldErrors?.email ? (
                  <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                {state && !state.success && state.fieldErrors?.password ? (
                  <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
                ) : null}
                <p className="text-xs text-muted-foreground">At least 8 characters.</p>
              </div>
              {state && !state.success ? (
                <p className="text-sm text-destructive" role="alert">
                  {state.error}
                </p>
              ) : null}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Creating…" : "Create admin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
