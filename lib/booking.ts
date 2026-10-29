export const CALL_MINUTES = 20;

const HOURS: Record<string, { tz: string; start: [number, number]; end: [number, number]; days: number[] }> = {
  india: { tz: "Asia/Kolkata", start: [10, 0], end: [19, 0], days: [1, 2, 3, 4, 5, 6] },
  us: { tz: "America/New_York", start: [9, 0], end: [13, 0], days: [1, 2, 3, 4, 5] },
  global: { tz: "Asia/Kolkata", start: [10, 0], end: [19, 0], days: [1, 2, 3, 4, 5] },
};

const LEAD_HOURS = 2;
const DAYS_AHEAD = 7;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type DaySlots = { key: string; first: number; slots: number[] };

function tzOffset(ms: number, tz: string) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const o: Record<string, string> = {};
  f.formatToParts(new Date(ms)).forEach((x) => {
    o[x.type] = x.value;
  });
  return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour % 24, +o.minute, +o.second) - ms;
}

function zoned(y: number, m: number, d: number, h: number, mi: number, tz: string) {
  const g = Date.UTC(y, m, d, h, mi);
  const t = g - tzOffset(g, tz);
  return t - (tzOffset(t, tz) - tzOffset(g, tz));
}

function partsIn(ms: number, tz: string) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
  const o: Record<string, string> = {};
  f.formatToParts(new Date(ms)).forEach((x) => {
    o[x.type] = x.value;
  });
  return { y: +o.year, m: +o.month - 1, d: +o.day, wd: WEEKDAYS.indexOf(o.weekday) };
}

export function buildDays(market: string): DaySlots[] {
  const H = HOURS[market] || HOURS.global;
  const now = Date.now();
  const out: DaySlots[] = [];
  for (let i = 0; i < 21 && out.length < DAYS_AHEAD; i++) {
    const p = partsIn(now + i * 864e5, H.tz);
    if (H.days.indexOf(p.wd) < 0) continue;
    const slots: number[] = [];
    let t = zoned(p.y, p.m, p.d, H.start[0], H.start[1], H.tz);
    const end = zoned(p.y, p.m, p.d, H.end[0], H.end[1], H.tz);
    for (; t + CALL_MINUTES * 6e4 <= end; t += 30 * 6e4) {
      if (t > now + LEAD_HOURS * 36e5) slots.push(t);
    }
    if (slots.length) out.push({ key: `${p.y}-${p.m}-${p.d}`, first: slots[0], slots });
  }
  return out;
}

export function formatWhen(ms: number, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("hi-IN", options).format(new Date(ms));
}

export function visitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "आपका स्थानीय समय";
  } catch {
    return "आपका स्थानीय समय";
  }
}

export type LeadFields = {
  platform: string;
  store: string;
  market: string;
  orders: string;
  team: string;
  channels: string[];
  name: string;
  email: string;
  phone: string;
  plan: string;
};

export function tierOf(lead: LeadFields) {
  if (lead.platform === "other") return "not_fit";
  if (lead.platform === "shopify_prelaunch") return "nurture";
  const big = lead.orders === "1000_5000" || lead.orders === "gt5000";
  const mid = lead.orders === "300_1000" && !!lead.team && lead.team !== "founder";
  const switching = lead.channels.includes("helpdesk");
  return big || mid || switching ? "hot" : "warm";
}

export function fieldOk(name: string, value: string | string[]) {
  if (name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value));
  if (name === "phone") return String(value).replace(/[^\d]/g, "").length >= 10;
  if (name === "store") return String(value).length >= 4 && String(value).includes(".");
  if (Array.isArray(value)) return value.length > 0;
  return !!value;
}
