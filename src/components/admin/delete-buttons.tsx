"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEventAction, deleteNewsAction } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/validations";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

function DeleteButton({
  title,
  label,
  action,
}: {
  title: string;
  label: string;
  action: () => Promise<ActionResult>;
}) {
  const router = useRouter();
  return (
    <ConfirmDialog
      title={`Delete this ${label}?`}
      description={
        <>
          <strong className="font-medium text-foreground">{title}</strong> will be removed from the
          admin and the public site. This can&apos;t be undone.
        </>
      }
      onConfirm={async () => {
        const result = await action();
        if (result.success) {
          toast.success(result.message);
          router.refresh();
          return true;
        }
        toast.error(result.error);
        return false;
      }}
      trigger={
        <button
          type="button"
          aria-label={`Delete ${title}`}
          title="Delete"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      }
    />
  );
}

export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  return <DeleteButton title={title} label="event" action={() => deleteEventAction(id)} />;
}

export function DeleteNewsButton({ id, title }: { id: string; title: string }) {
  return <DeleteButton title={title} label="post" action={() => deleteNewsAction(id)} />;
}
