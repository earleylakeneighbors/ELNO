import type {
  EmailBlastBatch,
  EmailBlastBatchWithDeliveries,
  EmailBlastDelivery,
  EmailBlastDeliveryStatus,
} from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { newId, store } from "./mock/store";

export const EMAIL_BLAST_LOG_PAGE_SIZE = 10;

export type EmailBlastDeliveryInsert = {
  subscriber_id: string | null;
  email: string;
  recipient_name: string;
  status: EmailBlastDeliveryStatus;
  error_message?: string | null;
  resend_id?: string | null;
};

export type EmailBlastBatchInsert = {
  send_token: string;
  preset: string;
  subject: string;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  deliveries: EmailBlastDeliveryInsert[];
};

export type EmailBlastBatchListResult = {
  rows: EmailBlastBatch[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  setupRequired?: boolean;
};

function isMissingBlastTableError(message: string): boolean {
  return (
    (message.includes("email_blast_batches") || message.includes("email_blast_deliveries")) &&
    (message.includes("schema cache") || message.includes("does not exist"))
  );
}

function useLiveLogs(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for email blast logs when Supabase is configured.",
    );
  }
  return true;
}

export function isEmailBlastLogsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

function mapBatch(row: Record<string, unknown>): EmailBlastBatch {
  return {
    id: String(row.id),
    send_token: String(row.send_token),
    preset: String(row.preset),
    subject: String(row.subject),
    recipient_count: Number(row.recipient_count),
    sent_count: Number(row.sent_count),
    failed_count: Number(row.failed_count),
    created_at: String(row.created_at),
  };
}

function mapDelivery(row: Record<string, unknown>): EmailBlastDelivery {
  const status = String(row.status);
  return {
    id: String(row.id),
    batch_id: String(row.batch_id),
    subscriber_id: row.subscriber_id == null ? null : String(row.subscriber_id),
    email: String(row.email),
    recipient_name: String(row.recipient_name ?? ""),
    status: status === "sent" || status === "failed" ? status : "failed",
    error_message: row.error_message == null ? null : String(row.error_message),
    resend_id: row.resend_id == null ? null : String(row.resend_id),
    retry_count: Number(row.retry_count ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at ?? row.created_at),
  };
}

export async function insertEmailBlastBatchWithDeliveries(
  payload: EmailBlastBatchInsert,
): Promise<EmailBlastBatchWithDeliveries> {
  const now = new Date().toISOString();

  if (!useLiveLogs()) {
    const batchId = newId("blast");
    const batch: EmailBlastBatch = {
      id: batchId,
      send_token: payload.send_token,
      preset: payload.preset,
      subject: payload.subject,
      recipient_count: payload.recipient_count,
      sent_count: payload.sent_count,
      failed_count: payload.failed_count,
      created_at: now,
    };
    const deliveries: EmailBlastDelivery[] = payload.deliveries.map((d) => ({
      id: newId("delivery"),
      batch_id: batchId,
      subscriber_id: d.subscriber_id,
      email: d.email,
      recipient_name: d.recipient_name,
      status: d.status,
      error_message: d.error_message ?? null,
      resend_id: d.resend_id ?? null,
      retry_count: 0,
      created_at: now,
      updated_at: now,
    }));
    store.emailBlastBatches.unshift(batch);
    store.emailBlastDeliveries.unshift(...deliveries);
    return { ...batch, deliveries };
  }

  const supabase = createServiceRoleClient();

  const { data: batchRow, error: batchError } = await supabase
    .from("email_blast_batches")
    .insert({
      send_token: payload.send_token,
      preset: payload.preset,
      subject: payload.subject,
      recipient_count: payload.recipient_count,
      sent_count: payload.sent_count,
      failed_count: payload.failed_count,
    })
    .select()
    .single();

  if (batchError) throw new Error(batchError.message);

  const batch = mapBatch(batchRow as Record<string, unknown>);
  const deliveryRows = payload.deliveries.map((d) => ({
    batch_id: batch.id,
    subscriber_id: d.subscriber_id,
    email: d.email,
    recipient_name: d.recipient_name,
    status: d.status,
    error_message: d.error_message ?? null,
    resend_id: d.resend_id ?? null,
    retry_count: 0,
  }));

  const { data: delRows, error: delError } = await supabase
    .from("email_blast_deliveries")
    .insert(deliveryRows)
    .select();

  if (delError) throw new Error(delError.message);

  return {
    ...batch,
    deliveries: (delRows ?? []).map((r) => mapDelivery(r as Record<string, unknown>)),
  };
}

export async function listEmailBlastBatches(options: {
  page?: number;
  pageSize?: number;
}): Promise<EmailBlastBatchListResult> {
  const pageSize = options.pageSize ?? EMAIL_BLAST_LOG_PAGE_SIZE;
  const requestedPage = Math.max(1, options.page ?? 1);

  if (!useLiveLogs()) {
    const total = store.emailBlastBatches.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize)) || 0;
    const page = Math.min(requestedPage, Math.max(1, totalPages));
    const from = (page - 1) * pageSize;
    const rows = store.emailBlastBatches.slice(from, from + pageSize);
    return { rows, total, page, pageSize, totalPages: total === 0 ? 0 : totalPages };
  }

  const supabase = createServiceRoleClient();
  const from = (requestedPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("email_blast_batches")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    if (isMissingBlastTableError(error.message)) {
      return { rows: [], total: 0, page: 1, pageSize, totalPages: 0, setupRequired: true };
    }
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    rows: (data ?? []).map((r) => mapBatch(r as Record<string, unknown>)),
    total,
    page: requestedPage,
    pageSize,
    totalPages,
  };
}

export async function getEmailBlastBatchWithDeliveries(
  batchId: string,
): Promise<EmailBlastBatchWithDeliveries | null> {
  if (!useLiveLogs()) {
    const batch = store.emailBlastBatches.find((b) => b.id === batchId);
    if (!batch) return null;
    const deliveries = store.emailBlastDeliveries
      .filter((d) => d.batch_id === batchId)
      .sort((a, b) => a.email.localeCompare(b.email));
    return { ...batch, deliveries };
  }

  const supabase = createServiceRoleClient();

  const { data: batchRow, error: batchError } = await supabase
    .from("email_blast_batches")
    .select("*")
    .eq("id", batchId)
    .maybeSingle();

  if (batchError) throw new Error(batchError.message);
  if (!batchRow) return null;

  const { data: delRows, error: delError } = await supabase
    .from("email_blast_deliveries")
    .select("*")
    .eq("batch_id", batchId)
    .order("email", { ascending: true });

  if (delError) throw new Error(delError.message);

  return {
    ...mapBatch(batchRow as Record<string, unknown>),
    deliveries: (delRows ?? []).map((r) => mapDelivery(r as Record<string, unknown>)),
  };
}

export async function updateEmailBlastDelivery(
  deliveryId: string,
  patch: {
    status: EmailBlastDeliveryStatus;
    error_message?: string | null;
    resend_id?: string | null;
    incrementRetry?: boolean;
  },
): Promise<void> {
  const now = new Date().toISOString();

  if (!useLiveLogs()) {
    const idx = store.emailBlastDeliveries.findIndex((d) => d.id === deliveryId);
    if (idx === -1) return;
    const row = store.emailBlastDeliveries[idx];
    store.emailBlastDeliveries[idx] = {
      ...row,
      status: patch.status,
      error_message: patch.error_message ?? null,
      resend_id: patch.resend_id ?? null,
      retry_count: patch.incrementRetry ? row.retry_count + 1 : row.retry_count,
      updated_at: now,
    };
    return;
  }

  const supabase = createServiceRoleClient();
  const { data: existing, error: fetchError } = await supabase
    .from("email_blast_deliveries")
    .select("retry_count")
    .eq("id", deliveryId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const retry_count = patch.incrementRetry
    ? Number(existing?.retry_count ?? 0) + 1
    : Number(existing?.retry_count ?? 0);

  const { error } = await supabase
    .from("email_blast_deliveries")
    .update({
      status: patch.status,
      error_message: patch.error_message ?? null,
      resend_id: patch.resend_id ?? null,
      retry_count,
      updated_at: now,
    })
    .eq("id", deliveryId);

  if (error) throw new Error(error.message);
}

export async function recomputeEmailBlastBatchCounts(batchId: string): Promise<void> {
  if (!useLiveLogs()) {
    const batchIdx = store.emailBlastBatches.findIndex((b) => b.id === batchId);
    if (batchIdx === -1) return;
    const deliveries = store.emailBlastDeliveries.filter((d) => d.batch_id === batchId);
    const sent_count = deliveries.filter((d) => d.status === "sent").length;
    const failed_count = deliveries.filter((d) => d.status === "failed").length;
    store.emailBlastBatches[batchIdx] = {
      ...store.emailBlastBatches[batchIdx],
      sent_count,
      failed_count,
      recipient_count: deliveries.length,
    };
    return;
  }

  const supabase = createServiceRoleClient();
  const { data: deliveries, error: delError } = await supabase
    .from("email_blast_deliveries")
    .select("status")
    .eq("batch_id", batchId);

  if (delError) throw new Error(delError.message);

  const rows = deliveries ?? [];
  const sent_count = rows.filter((r) => r.status === "sent").length;
  const failed_count = rows.filter((r) => r.status === "failed").length;

  const { error } = await supabase
    .from("email_blast_batches")
    .update({
      sent_count,
      failed_count,
      recipient_count: rows.length,
    })
    .eq("id", batchId);

  if (error) throw new Error(error.message);
}

export async function listFailedDeliveriesForBatch(batchId: string): Promise<EmailBlastDelivery[]> {
  const full = await getEmailBlastBatchWithDeliveries(batchId);
  if (!full) return [];
  return full.deliveries.filter((d) => d.status === "failed");
}