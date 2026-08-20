import {
  listSubscribersAdmin,
  subscribersToExcelRows,
  type ListSubscribersOptions,
  isAdminAuthenticated,
} from "@/lib/data";

async function assertAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return new Response("Unauthorized", { status: 401 });
  }
  return null;
}

function parseOptions(url: URL): ListSubscribersOptions {
  const search = url.searchParams.get("search") ?? undefined;
  const sort = (url.searchParams.get("sort") as ListSubscribersOptions["sort"]) ?? "newest";
  return { search, sort };
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const options = parseOptions(new URL(request.url));
  const subscribers = await listSubscribersAdmin(options);
  const rows = subscribersToExcelRows(subscribers);

  const headers = [
    "First name",
    "Last name",
    "Email",
    "Street address",
    "Interests",
    "Consent",
    "Submitted",
  ] as const;

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCsv(String(row[h] ?? ""))).join(",")),
  ];

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="earley-lake-email-list.csv"',
      "Cache-Control": "no-store",
    },
  });
}
