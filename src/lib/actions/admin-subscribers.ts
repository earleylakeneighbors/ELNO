"use server";

import {
  deleteSubscriber,
  deleteSubscribersBulk,
  getSubscriberById,
  listSubscribersAdmin,
  type ListSubscribersOptions,
  type SubscriberSort,
} from "@/lib/data";
import { requireAdmin } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/validations";
import type { Subscriber } from "@/lib/types";

export async function listSubscribersAction(
  options: ListSubscribersOptions = {},
): Promise<ActionResult<Subscriber[]>> {
  await requireAdmin();
  try {
    const data = await listSubscribersAdmin(options);
    return { success: true, data };
  } catch (err) {
    console.error("listSubscribersAction", err);
    return { success: false, error: "Could not load subscribers." };
  }
}

export async function getSubscriberAction(
  id: string,
): Promise<ActionResult<Subscriber>> {
  await requireAdmin();
  try {
    const subscriber = await getSubscriberById(id);
    if (!subscriber) return { success: false, error: "Subscriber not found." };
    return { success: true, data: subscriber };
  } catch (err) {
    console.error("getSubscriberAction", err);
    return { success: false, error: "Could not load subscriber." };
  }
}

export async function deleteSubscriberAdminAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const ok = await deleteSubscriber(id);
    return ok
      ? { success: true, message: "Subscriber removed." }
      : { success: false, error: "Could not remove subscriber." };
  } catch (err) {
    console.error("deleteSubscriberAdminAction", err);
    return { success: false, error: "Could not remove subscriber." };
  }
}

export async function deleteSubscribersBulkAction(
  ids: string[],
): Promise<ActionResult<{ deleted: number }>> {
  await requireAdmin();
  try {
    const deleted = await deleteSubscribersBulk(ids);
    return {
      success: true,
      data: { deleted },
      message: deleted === 1 ? "1 subscriber removed." : `${deleted} subscribers removed.`,
    };
  } catch (err) {
    console.error("deleteSubscribersBulkAction", err);
    return { success: false, error: "Could not remove subscribers." };
  }
}

export type { SubscriberSort, ListSubscribersOptions };
