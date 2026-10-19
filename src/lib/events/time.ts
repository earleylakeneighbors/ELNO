/** Burnsville, MN — always show event schedule in local community time. */
export const ELNO_EVENT_TIME_ZONE = "America/Chicago";

export const ELNO_EVENT_TIME_ZONE_LABEL = "Central Time";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? new Date(date) : date;
}

export function formatEventDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const d = toDate(date);
  if (Number.isNaN(d.getTime())) {
    return "Unknown date";
  }

  const opts = options ?? {};
  const usesStyle = "dateStyle" in opts || "timeStyle" in opts;
  const zoneOpts = { timeZone: ELNO_EVENT_TIME_ZONE, ...opts };

  if (usesStyle) {
    return d.toLocaleString("en-US", zoneOpts);
  }

  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...zoneOpts,
  });
}

export function formatEventTime(date: string | Date) {
  const d = toDate(date);
  if (Number.isNaN(d.getTime())) {
    return "Unknown time";
  }

  return d.toLocaleTimeString("en-US", {
    timeZone: ELNO_EVENT_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatEventTimeRange(start: string, end: string | null) {
  const range = end
    ? `${formatEventTime(start)} – ${formatEventTime(end)}`
    : formatEventTime(start);
  return `${range} (${ELNO_EVENT_TIME_ZONE_LABEL})`;
}

/** e.g. Fri, Nov 14 · 2:00 PM */
export function formatEventScheduleLine(iso: string) {
  const d = toDate(iso);
  const datePart = d.toLocaleDateString("en-US", {
    timeZone: ELNO_EVENT_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${datePart} · ${formatEventTime(iso)}`;
}

/** e.g. Fri · 2:00 PM */
export function formatEventScheduleCompact(iso: string) {
  const d = toDate(iso);
  const weekday = d.toLocaleDateString("en-US", {
    timeZone: ELNO_EVENT_TIME_ZONE,
    weekday: "short",
  });
  return `${weekday} · ${formatEventTime(iso)}`;
}

/** e.g. Nov 14 */
export function formatEventMonthDay(iso: string) {
  const d = toDate(iso);
  return d.toLocaleDateString("en-US", {
    timeZone: ELNO_EVENT_TIME_ZONE,
    month: "short",
    day: "numeric",
  });
}

export function getEventDateTileParts(iso: string) {
  const d = toDate(iso);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ELNO_EVENT_TIME_ZONE,
    month: "short",
    day: "numeric",
    weekday: "short",
  }).formatToParts(d);

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    month: pick("month"),
    day: pick("day"),
    weekday: pick("weekday"),
  };
}
