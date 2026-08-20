"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  deleteEventAction,
  deleteNewsAction,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function DeleteEventButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this event?")) return;
        startTransition(async () => {
          const result = await deleteEventAction(id);
          if (result.success) {
            toast.success(result.message);
            router.refresh();
          } else toast.error(result.error);
        });
      }}
    >
      Delete
    </Button>
  );
}

export function DeleteNewsButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this post?")) return;
        startTransition(async () => {
          const result = await deleteNewsAction(id);
          if (result.success) {
            toast.success(result.message);
            router.refresh();
          } else toast.error(result.error);
        });
      }}
    >
      Delete
    </Button>
  );
}
