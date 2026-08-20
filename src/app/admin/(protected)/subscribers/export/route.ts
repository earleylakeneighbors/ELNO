import * as XLSX from "xlsx";
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

export async function GET(request: Request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const options = parseOptions(new URL(request.url));
  const subscribers = await listSubscribersAdmin(options);
  const rows = subscribersToExcelRows(subscribers);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Email List");

  const bytes = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  }) as number[];

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="earley-lake-email-list.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
