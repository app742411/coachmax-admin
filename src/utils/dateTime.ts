/**
 * Shared date/time rules for CoachMax.
 *
 * Timestamps (createdAt, payment time, chat time, etc.) are UTC ISO values
 * and are displayed in the viewer's detected timezone. Calendar dates (event
 * days, camp sessions, DOBs, terms) are date-only YYYY-MM-DD values and must
 * never pass through the browser's implicit UTC parser.
 */

export const APP_TIME_ZONE = import.meta.env.VITE_APP_TIMEZONE || "Australia/Sydney";
export const APP_LOCALE = "en-AU";

export const getViewerTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || APP_TIME_ZONE;
  } catch {
    return APP_TIME_ZONE;
  }
};

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})/;

/** Return a date-only value without changing its calendar day. */
export const toDateOnly = (value: string | Date | null | undefined): string => {
  if (!value) return "";
  if (typeof value === "string") {
    const match = value.match(DATE_ONLY_RE);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

/** Convert a date-only value to a local Date for date-picker controls. */
export const dateOnlyToLocalDate = (value: string | Date | null | undefined): Date | null => {
  const dateOnly = toDateOnly(value);
  const match = dateOnly.match(DATE_ONLY_RE);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
};

/** Return today's calendar date in the viewer's timezone. */
export const todayDateOnly = (): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: getViewerTimeZone(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

/** Add calendar days without a timezone conversion. */
export const addDateOnlyDays = (value: string, amount: number): string => {
  const match = value.match(DATE_ONLY_RE);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};

/** Format a date-only value using UTC solely to preserve its calendar day. */
export const formatDateOnly = (
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
  locale = APP_LOCALE,
): string => {
  const dateOnly = toDateOnly(value);
  const match = dateOnly.match(DATE_ONLY_RE);
  if (!match) return "";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(date);
};

export const formatDateTime = (
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
  timeZone = getViewerTimeZone(),
): string => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(APP_LOCALE, { ...options, timeZone }).format(date);
};

export const formatTime = (value: string | Date | null | undefined, timeZone = getViewerTimeZone()): string =>
  formatDateTime(value, { hour: "numeric", minute: "2-digit" }, timeZone);

/** Convert a wall-clock schedule in the organisation timezone to a UTC ISO timestamp. */
export const zonedDateTimeToUtcISOString = (
  dateOnly: string,
  timeValue: string,
  timeZone = APP_TIME_ZONE,
): string => {
  const match = dateOnly.match(DATE_ONLY_RE);
  if (!match) return new Date().toISOString();
  const timeMatch = timeValue.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!timeMatch) return new Date(`${dateOnly}T00:00:00Z`).toISOString();
  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2] || 0);
  const meridiem = (timeMatch[3] || "").toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  const wallClockAsUtc = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), hours, minutes);
  let guess = wallClockAsUtc;
  for (let i = 0; i < 3; i += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(guess));
    const part = (type: string) => Number(parts.find((item) => item.type === type)?.value || 0);
    const representedAsUtc = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
    guess += wallClockAsUtc - representedAsUtc;
  }
  return new Date(guess).toISOString();
};

/** Date input fields should submit date-only values, never an ISO midnight. */
export const dateOnlyFormValue = (value: Date | null | undefined): string => toDateOnly(value);

