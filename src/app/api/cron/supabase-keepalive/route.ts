import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { insertCronKeepaliveLog } from "@/lib/data/cron-keepalive-logs";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ROUTE = "supabase-keepalive";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  const token = header.slice("Bearer ".length);
  const expected = Buffer.from(secret, "utf8");
  const actual = Buffer.from(token, "utf8");

  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

async function recordLog(payload: Parameters<typeof insertCronKeepaliveLog>[0]) {
  try {
    await insertCronKeepaliveLog(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[cron/${ROUTE}] log insert failed`, message);
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    console.warn(`[cron/${ROUTE}] unauthorized`);
    await recordLog({
      success: false,
      authorized: false,
      detail: "unauthorized",
    });
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(`[cron/${ROUTE}] Supabase env not configured`);
    await recordLog({
      success: false,
      authorized: true,
      detail: "env_not_configured",
    });
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      console.error(`[cron/${ROUTE}] query failed`, error.message);
      await recordLog({
        success: false,
        authorized: true,
        detail: "query_failed",
      });
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const hasRow = (data?.length ?? 0) > 0;
    console.info(`[cron/${ROUTE}] success hasRow=${hasRow}`);
    await recordLog({
      success: true,
      authorized: true,
      has_row: hasRow,
      detail: null,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[cron/${ROUTE}] unexpected failure`, message);
    await recordLog({
      success: false,
      authorized: true,
      detail: "unexpected",
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
