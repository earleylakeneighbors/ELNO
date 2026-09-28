import type { CronKeepaliveLog } from "@/lib/types";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const CRON_KEEPALIVE_LOG_PAGE_SIZE = 20;

export type CronKeepaliveLogInsert = {
  success: boolean;
  authorized: boolean;
  has_row?: boolean | null;
  detail?: string | null;
};

export type CronKeepaliveLogListResult = {
  rows: CronKeepaliveLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** True when the cron_keepalive_logs table is not deployed yet. */
  setupRequired?: boolean;
};

function isMissingKeepaliveTableError(message: string): boolean {
  return (
    message.includes("cron_keepalive_logs") &&
    (message.includes("schema cache") || message.includes("does not exist"))
  );
}

function useLiveLogs(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to read/write cron keep-alive logs when Supabase is configured.",
    );
  }
  return true;
}

function mapRow(row: Record<string, unknown>): CronKeepaliveLog {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    success: Boolean(row.success),
    authorized: Boolean(row.authorized),
    has_row: row.has_row == null ? null : Boolean(row.has_row),
    detail: row.detail == null ? null : String(row.detail),
  };
}

export async function insertCronKeepaliveLog(payload: CronKeepaliveLogInsert): Promise<void> {
  if (!useLiveLogs()) return;

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("cron_keepalive_logs").insert({
    success: payload.success,
    authorized: payload.authorized,
    has_row: payload.has_row ?? null,
    detail: payload.detail ?? null,
  });

  if (error) throw new Error(error.message);
}

export function isCronKeepaliveLogsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export async function listCronKeepaliveLogs(options: {
  page?: number;
  pageSize?: number;
}): Promise<CronKeepaliveLogListResult> {
  const pageSize = options.pageSize ?? CRON_KEEPALIVE_LOG_PAGE_SIZE;
  const requestedPage = Math.max(1, options.page ?? 1);

  if (!useLiveLogs()) {
    return { rows: [], total: 0, page: 1, pageSize, totalPages: 0 };
  }

  const supabase = createServiceRoleClient();
  const from = (requestedPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("cron_keepalive_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    if (isMissingKeepaliveTableError(error.message)) {
      return {
        rows: [],
        total: 0,
        page: 1,
        pageSize,
        totalPages: 0,
        setupRequired: true,
      };
    }
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const page = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);

  return {
    rows: (data ?? []).map((row) => mapRow(row as Record<string, unknown>)),
    total,
    page,
    pageSize,
    totalPages,
  };
}
