"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Plus, ShieldCheck, Trash2, Wand2 } from "lucide-react";
import { createAdminAction, deleteAdminAction } from "@/lib/actions/admin-users";
import type { Profile } from "@/lib/types";
import type { ActionResult } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatDate } from "@/lib/utils";

const initial: ActionResult<Profile> | null = null;

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH = ["Too short", "Weak", "Okay", "Good", "Strong"];

export function UsersClient({ users }: { users: Profile[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(users);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [prevUsers, setPrevUsers] = useState(users);
  const [state, formAction, pending] = useActionState(
    async (prev: ActionResult<Profile> | null, formData: FormData) => {
      const result = await createAdminAction(prev, formData);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        setPassword("");
        router.refresh();
      } else {
        toast.error(result.error);
      }
      return result;
    },
    initial,
  );

  if (users !== prevUsers) {
    setPrevUsers(users);
    setRows(users);
  }

  async function onDelete(id: string) {
    const result = await deleteAdminAction(id);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    setRows((prev) => prev.filter((u) => u.id !== id));
    toast.success(result.message);
    router.refresh();
    return true;
  }

  const score = strength(password);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {rows.map((u, i) => (
            <motion.li
              key={u.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-accent via-card to-[#f3ecdf]" aria-hidden />
              <div className="relative flex items-start justify-between">
                <Avatar name={u.full_name || u.email} seed={u.email} size="xl" className="ring-4 ring-card" />
                <ConfirmDialog
                  title="Remove admin access?"
                  description={<>This deletes the account for <strong className="font-medium text-foreground">{u.email}</strong>. They won&apos;t be able to sign in.</>}
                  confirmLabel="Remove admin"
                  onConfirm={() => onDelete(u.id)}
                  trigger={
                    <button
                      type="button"
                      className="mt-6 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-100 transition hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label={`Remove ${u.email}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
              <p className="relative mt-3 truncate font-display text-lg">{u.full_name || "Unnamed admin"}</p>
              <p className="relative truncate text-sm text-muted-foreground">{u.email}</p>
              <div className="relative mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin
                </span>
                <span>Since {formatDate(u.created_at, { month: "short" })}</span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        <li>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex h-full min-h-[12.5rem] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.03] hover:text-primary"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-all duration-300 group-hover:rotate-90 group-hover:bg-primary group-hover:text-primary-foreground">
              <Plus className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium">Add an admin</span>
          </button>
        </li>
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="font-display text-2xl">Add a new admin</DialogTitle>
          <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
            Creates a sign-in with full access to this dashboard. Share the temporary password privately.
          </DialogDescription>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Temporary password</Label>
                <button
                  type="button"
                  onClick={() => {
                    setPassword(generatePassword());
                    setShowPw(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Wand2 className="h-3.5 w-3.5" /> Generate
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid flex-1 grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1 rounded-full"
                      animate={{
                        backgroundColor:
                          i < score
                            ? score <= 1 ? "#b54a4a" : score === 2 ? "#d19a3a" : "#4a7c59"
                            : "#ddd9d1",
                      }}
                    />
                  ))}
                </div>
                <span className="w-16 text-right text-xs text-muted-foreground">{password ? STRENGTH[score] : "8+ chars"}</span>
              </div>
              {state && !state.success && state.fieldErrors?.password ? (
                <p className="text-sm text-destructive">{state.fieldErrors.password[0]}</p>
              ) : null}
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
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {pending ? "Creating…" : "Create admin"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
