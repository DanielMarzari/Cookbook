/**
 * Re-judge the fetched images without re-fetching them.
 *
 * The fetch pass scored by naive substring match, which flags correct results as
 * suspicious: "Membrillos del Perú" is membrillo, "Another Round of Chile Pepper
 * Jelly" is pepper jelly, and both scored as near-misses. A review pile that is
 * three-quarters false alarms is a review pile nobody reads, so this re-scores
 * from the stored titles with plural/accent folding and token overlap.
 *
 * Usage: node scripts/rescore-charcuterie-images.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA = join(process.cwd(), 'data/charcuterie-images');
const manifest = JSON.parse(readFileSync(join(DATA, 'manifest.json'), 'utf8'));

/** Strip accents, punctuation and the plural 's' so "membrillos" ≈ "membrillo". */
function norm(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/(?:es|s)$/, ''))
    .filter((w) => w.length > 2);
}

/** Words that carry no signal about whether the photo shows the right food. */
const STOP = new Set(['the', 'and', 'with', 'for', 'from', 'del', 'della', 'los', 'las', 'una', 'que', 'food', 'round', 'another']);

const OFF_TOPIC =
  /\b(map|flag|church|castle|portrait|painting|monument|landscape|village|cathedral|sheep|cow|goat|pig|cattle|herd|logo|coat of arms|stamp|banknote|exposicion|exhibition|museum|university|trophy|sumo|football|festival|parade)\b/i;

function rescore(item) {
  const want = norm(item.name).filter((w) => !STOP.has(w));
  const got = norm(`${item.title} ${(item.tags ?? []).join(' ')}`).filter((w) => !STOP.has(w));
  if (!want.length) return 0;

  // Every meaningful word of the item name that shows up in the title, allowing
  // one to be a prefix of the other so "membrillo" matches "membrillos".
  const hits = want.filter((w) => got.some((g) => g === w || g.startsWith(w) || w.startsWith(g)));
  let s = Math.round((hits.length / want.length) * 80);

  if (hits.length === want.length) s += 12; // complete name present
  if (got.some((g) => g.startsWith(item.cat.slice(0, 4)))) s += 8;
  if (OFF_TOPIC.test(`${item.title}`)) s -= 55;
  return Math.max(0, Math.min(100, s));
}

const scored = manifest.map((m) => ({ ...m, score0: m.score, score: rescore(m) }));
const good = scored.filter((m) => m.score >= 60);
const doubt = scored.filter((m) => m.score < 60);

writeFileSync(join(DATA, 'manifest.json'), JSON.stringify(scored, null, 1));
writeFileSync(
  join(DATA, 'review.json'),
  JSON.stringify(
    doubt.map((m) => ({
      id: m.id,
      name: m.name,
      cat: m.cat,
      score: m.score,
      title: m.title,
      source: m.source,
      detail: m.detail,
      reason: `low confidence (${m.score})`,
      alternates: m.alternates,
    })),
    null,
    1,
  ),
);

const rescued = scored.filter((m) => m.score0 < 70 && m.score >= 60).length;
console.log(`rescored ${scored.length}: ${good.length} confident, ${doubt.length} need a look`);
console.log(`${rescued} were false alarms under the old substring scorer`);
console.log('\nstill doubtful:');
for (const m of doubt.slice(0, 40)) {
  console.log(`  ${String(m.score).padStart(3)} ${m.id.padEnd(20)} ${m.title.slice(0, 52)}`);
}
