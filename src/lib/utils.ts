// Format minutes into human-readable time string
// e.g. 90 → "1h 30m", 60 → "1h", 30 → "30m", 1500 → "1d 1h"
export function formatTime(minutes: number | undefined | null): string {
  if (!minutes || minutes <= 0) return '—';

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);

  return parts.join(' ') || '—';
}

// Convert a decimal number to a display fraction string
// e.g. 0.75 → "¾", 1.5 → "1½", 0.333 → "⅓"
export function toFraction(n: number): string {
  if (n === 0) return '0';
  const whole = Math.floor(n);
  const frac = n - whole;

  const fractions: [number, string][] = [
    [0, ''], [0.125, '⅛'], [0.2, '⅕'], [0.25, '¼'], [1 / 3, '⅓'],
    [0.375, '⅜'], [0.4, '⅖'], [0.5, '½'], [0.6, '⅗'], [0.625, '⅝'],
    [2 / 3, '⅔'], [0.75, '¾'], [0.8, '⅘'], [0.875, '⅞'],
  ];

  let bestFrac = '';
  let bestDiff = 0.05;
  for (const [val, symbol] of fractions) {
    const diff = Math.abs(frac - val);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestFrac = symbol;
    }
  }

  if (whole > 0 && bestFrac) return `${whole}${bestFrac}`;
  if (whole > 0) return String(whole);
  if (bestFrac) return bestFrac;
  return String(Math.round(n * 100) / 100);
}
