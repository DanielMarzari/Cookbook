/**
 * Dates, times and calendar links.
 *
 * Everything here treats the date as a DAY and the time as a clock reading in
 * the host's kitchen, never as an instant. `new Date('2026-09-14')` is UTC
 * midnight, which prints as the 13th everywhere west of Greenwich — the same
 * bug the cook log had, and a day out on an invitation is worse than a day out
 * in a journal.
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Split "2026-09-14" into its parts without going through a timezone. */
function parts(date: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date ?? '');
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** "Saturday 14 September" — the weekday matters more than the year. */
export function formatDateLong(date: string): string {
  const p = parts(date);
  if (!p) return date ?? '';
  // Constructed as UTC and read as UTC, so the weekday is the one on the page.
  const weekday = DAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()];
  const thisYear = new Date().getFullYear();
  const year = p.y === thisYear ? '' : ` ${p.y}`;
  return `${weekday} ${p.d} ${MONTHS[p.m - 1]}${year}`;
}

export function formatDateShort(date: string): string {
  const p = parts(date);
  if (!p) return date ?? '';
  return `${p.d} ${MONTHS[p.m - 1].slice(0, 3)} ${p.y}`;
}

/** "19:00" → "7pm", "19:30" → "7.30pm". */
export function formatTime(t: string | null): string {
  if (!t) return '';
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t;
  const h = Number(m[1]);
  const min = m[2];
  const suffix = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return min === '00' ? `${h12}${suffix}` : `${h12}.${min}${suffix}`;
}

export function formatTimeRange(start: string | null, end: string | null): string {
  if (!start) return '';
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

/**
 * Calendar stamps in local-floating form.
 *
 * `DTSTART;TZID=` would need a timezone database to be honest about; a floating
 * local time says "seven o'clock where this is happening", which is exactly
 * what the invitation means and what every calendar app does with a dinner.
 */
function stamp(date: string, time: string | null, fallbackHour: number): string {
  const p = parts(date);
  if (!p) return '';
  const m = time ? /^(\d{1,2}):(\d{2})/.exec(time) : null;
  const hh = String(m ? Number(m[1]) : fallbackHour).padStart(2, '0');
  const mm = m ? m[2] : '00';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${p.y}${pad(p.m)}${pad(p.d)}T${hh}${mm}00`;
}

/** Google's template URL wants a compact UTC-ish pair; floating works there too. */
export function calendarLinks(event: {
  title: string;
  host?: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location?: string | null;
  expect?: string | null;
}): { google: string; outlook: string; ics: string } {
  const start = stamp(event.event_date, event.start_time, 19);
  const end = stamp(event.event_date, event.end_time, 23);
  const title = event.host ? `${event.title} at ${event.host}'s` : event.title;
  const details = event.expect ?? '';
  const location = event.location ?? '';

  const google =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`;

  const iso = (s: string) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(9, 11)}:${s.slice(11, 13)}:00`;
  const outlook =
    'https://outlook.live.com/calendar/0/action/compose?rru=addevent' +
    `&subject=${encodeURIComponent(title)}` +
    `&startdt=${iso(start)}&enddt=${iso(end)}` +
    `&body=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`;

  // Folded at 75 octets is the spec; these lines are short enough not to need
  // it, but the escaping is not optional — a comma in a location silently
  // truncates the field otherwise.
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cookbook//Dinner//EN',
    'BEGIN:VEVENT',
    `UID:${start}-${encodeURIComponent(event.title).slice(0, 24)}@cookbook`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${esc(title)}`,
    details ? `DESCRIPTION:${esc(details)}` : '',
    location ? `LOCATION:${esc(location)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  return { google, outlook, ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
}
