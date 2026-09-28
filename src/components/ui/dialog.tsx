"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

function DialogOverlay({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "animate-overlay-in fixed inset-0 z-[70] bg-foreground/35 backdrop-blur-[2px]",
        className,
      )}
    />
  );
}

function CloseButton() {
  return (
    <DialogPrimitive.Close
      className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Close"
    >
      <X className="h-4 w-4" />
    </DialogPrimitive.Close>
  );
}

/** Centered modal. */
function DialogContent({
  className,
  children,
  hideClose,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { hideClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "animate-dialog fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        {hideClose ? null : <CloseButton />}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Right-side slide-over panel. */
function SheetContent({
  className,
  children,
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "animate-sheet fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl focus:outline-none",
          className,
        )}
        // Focus the panel itself rather than jumping to its first (often destructive) button.
        onOpenAutoFocus={
          onOpenAutoFocus ??
          ((e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement | null)?.focus();
          })
        }
        tabIndex={-1}
        {...props}
      >
        {children}
        <CloseButton />
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogContent,
  SheetContent,
};
