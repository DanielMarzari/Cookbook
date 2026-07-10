#!/usr/bin/env node
// Enrich (and add) knife-skill techniques with written guides, tips, and
// authored monochrome SVG diagrams (stored inline as data URIs in image_urls).
// Idempotent: upserts by slug, preserving existing ids so skill records survive.
//
// Usage: node scripts/seed-knife-skills.mjs [path-to-db]
import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || process.env.DATABASE_PATH || join(__dirname, '..', 'cookbook.db');

// ---------- SVG diagram helpers (ink line-art on white) ----------
const INK = '#141310', MUT = '#767676', FILL = '#ffffff', SH1 = '#efece4', SH2 = '#e2ded3';

function wrap(inner, w = 460, h = 300) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="Helvetica,Arial,sans-serif">`
    + `<rect width="${w}" height="${h}" fill="#fff"/>` + inner + `</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(s);
}
// 2.5D cube at (x,y) top-left of front face, size s, depth d
function cube(x, y, s, d = s * 0.42) {
  return `<g stroke="${INK}" stroke-width="1.6" stroke-linejoin="round">`
    + `<polygon points="${x},${y} ${x + d},${y - d} ${x + s + d},${y - d} ${x + s},${y}" fill="${SH1}"/>`
    + `<polygon points="${x + s},${y} ${x + s + d},${y - d} ${x + s + d},${y + s - d} ${x + s},${y + s}" fill="${SH2}"/>`
    + `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${FILL}"/></g>`;
}
function dimH(x1, x2, y, label) { // horizontal dimension line
  return `<g stroke="${MUT}" stroke-width="1"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/>`
    + `<line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}"/><line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}"/></g>`
    + `<text x="${(x1 + x2) / 2}" y="${y + 15}" fill="${MUT}" font-size="12" text-anchor="middle">${label}</text>`;
}
function dimV(x, y1, y2, label) {
  return `<g stroke="${MUT}" stroke-width="1"><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/>`
    + `<line x1="${x - 4}" y1="${y1}" x2="${x + 4}" y2="${y1}"/><line x1="${x - 4}" y1="${y2}" x2="${x + 4}" y2="${y2}"/></g>`
    + `<text x="${x - 8}" y="${(y1 + y2) / 2 + 4}" fill="${MUT}" font-size="12" text-anchor="end">${label}</text>`;
}
function title(t) { return `<text x="24" y="34" fill="${INK}" font-size="17" font-weight="bold">${t}</text>`; }

// bars (long sticks) for julienne / batonnet
function bars(x, y, count, len, th, gap) {
  let g = `<g stroke="${INK}" stroke-width="1.4">`;
  for (let i = 0; i < count; i++) g += `<rect x="${x}" y="${y + i * (th + gap)}" width="${len}" height="${th}" rx="1.5" fill="${FILL}"/>`;
  return g + '</g>';
}

const DIAGRAMS = {
  julienne: wrap(title('Julienne — “matchstick”') + bars(60, 80, 5, 300, 12, 12)
    + dimH(60, 360, 168, '5–6 cm long') + dimV(46, 80, 92, '3 mm')
    + `<text x="24" y="270" fill="${MUT}" font-size="12.5">Fine julienne = 1.5 mm · Julienne = 3 mm square in cross-section</text>`),
  batonnet: wrap(title('Batonnet — “little stick”') + bars(60, 78, 4, 320, 22, 16)
    + dimH(60, 380, 190, '6 cm long') + dimV(46, 78, 100, '6 mm')
    + `<text x="24" y="272" fill="${MUT}" font-size="12.5">The parent cut: dice a batonnet crosswise to get a large/medium dice.</text>`),
  brunoise: wrap(title('Brunoise — fine dice') + cube(150, 120, 90)
    + dimH(150, 240, 232, '3 mm') + dimV(132, 120, 210, '3 mm')
    + `<text x="24" y="276" fill="${MUT}" font-size="12.5">Cut a fine julienne, then cut crosswise into perfect 3 mm cubes.</text>`),
  dice: wrap(title('Dice — three sizes') + cube(70, 150, 46) + cube(180, 138, 66) + cube(320, 120, 92)
    + `<text x="93" y="220" fill="${MUT}" font-size="12" text-anchor="middle">small · 6 mm</text>`
    + `<text x="213" y="226" fill="${MUT}" font-size="12" text-anchor="middle">medium · 12 mm</text>`
    + `<text x="366" y="234" fill="${MUT}" font-size="12" text-anchor="middle">large · 20 mm</text>`, 460, 270),
  chiffonade: wrap(title('Chiffonade — ribbons')
    + `<g stroke="${INK}" stroke-width="1.6" fill="none"><path d="M70,150 q40,-70 120,-70 q80,0 120,70 q-40,70 -120,70 q-80,0 -120,-70z" fill="${SH1}"/>`
    + `<path d="M190,80 q0,70 0,140" stroke-dasharray="4 4"/></g>`
    + `<g stroke="${INK}" stroke-width="1.4">`
    + [0, 1, 2, 3, 4].map((i) => `<rect x="330" y="${92 + i * 24}" width="96" height="9" rx="4" fill="${FILL}"/>`).join('')
    + '</g>'
    + `<text x="24" y="272" fill="${MUT}" font-size="12.5">Stack leaves, roll into a tight cigar, slice thinly across → fine ribbons.</text>`),
  knifeParts: wrap(title('The chef’s knife')
    + `<g stroke="${INK}" stroke-width="1.6" stroke-linejoin="round">`
    + `<polygon points="46,168 150,120 300,120 300,180 150,180" fill="${FILL}"/>` // blade
    + `<rect x="300" y="126" width="18" height="48" fill="${SH2}"/>` // bolster
    + `<rect x="318" y="128" width="110" height="44" rx="10" fill="${SH1}"/>` // handle
    + `<circle cx="345" cy="150" r="3.5" fill="${MUT}"/><circle cx="375" cy="150" r="3.5" fill="${MUT}"/><circle cx="405" cy="150" r="3.5" fill="${MUT}"/></g>`
    + `<g stroke="${MUT}" stroke-width="1" fill="${MUT}" font-size="12">`
    + `<line x1="210" y1="120" x2="210" y2="92"/><text x="210" y="86" text-anchor="middle">spine</text>`
    + `<line x1="210" y1="180" x2="210" y2="210"/><text x="210" y="224" text-anchor="middle">edge</text>`
    + `<line x1="52" y1="160" x2="40" y2="200"/><text x="40" y="214" text-anchor="middle">tip</text>`
    + `<line x1="298" y1="178" x2="298" y2="208"/><text x="298" y="222" text-anchor="middle">heel</text>`
    + `<line x1="309" y1="126" x2="309" y2="96"/><text x="309" y="90" text-anchor="middle">bolster</text>`
    + `<line x1="373" y1="128" x2="373" y2="100"/><text x="373" y="94" text-anchor="middle">handle</text></g>`),
  claw: wrap(title('The guiding hand — “the claw”')
    + `<g stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round">`
    + `<path d="M120,120 q-14,26 -6,58" /><path d="M150,110 q-12,30 -4,64"/><path d="M182,110 q-10,30 -2,64"/><path d="M214,116 q-6,26 2,56"/>` // curled fingertips
    + `<path d="M108,150 q60,40 118,26" stroke-width="1.4"/>` // thumb tucked behind
    + `</g>`
    + `<g stroke="${INK}" stroke-width="1.6"><rect x="70" y="196" width="330" height="16" rx="2" fill="${SH1}"/>` // blade flat
    + `<line x1="250" y1="120" x2="250" y2="196" stroke-width="1.4"/></g>` // blade side rests on knuckles
    + `<text x="255" y="150" fill="${MUT}" font-size="12">knife flat against knuckles</text>`
    + `<text x="24" y="270" fill="${MUT}" font-size="12.5">Curl fingertips under, thumb tucked behind. The blade rides your knuckles — never lift it above them.</text>`),
};

// ---------- technique content ----------
const CAT = 'Knife Skills';
const techniques = [
  {
    slug: 'knife-skills', name: 'Knife Skills', difficulty: 'beginner',
    images: [DIAGRAMS.knifeParts, DIAGRAMS.claw],
    description: 'The foundation of everything: grip, the guiding "claw," and a sharp edge. Get these right and every cut below becomes fast, safe, and even.',
    tips: [
      'A sharp knife is safer than a dull one — it goes where you aim it instead of slipping.',
      'Pinch the blade (thumb and forefinger on the sides, just past the bolster). Don\'t grip the handle like a hammer.',
      'Let the knife do the work — long, smooth strokes, tip staying near the board.',
      'Cut speed comes from confidence, not force. Get the motion right first, then speed follows.',
    ],
    content: `## The grip
Hold the knife with a **pinch grip**: thumb and the side of your forefinger on opposite faces of the blade, just ahead of the bolster; the remaining three fingers wrap the handle. This puts your hand's control point right at the blade, not back on the handle — you steer the edge instead of waving it.

## The guiding hand — "the claw"
Curl the fingertips of your other hand under, knuckles forward, thumb tucked safely behind. Rest the flat of the blade against your knuckles and let it ride up and down them as you cut. Your knuckles set the slice width; retreat them across the food a little with each cut. **The blade never rises above your knuckles**, so it physically can't reach your fingertips.

## The motion
For most cuts, keep the tip in light contact with the board and rock the knife forward-and-down through the food (the "rock chop"). Push slightly forward on the downstroke so you slice rather than crush. For herbs and fine work, a rapid rock with the free hand steadying the spine.

## A sharp edge
Hone on a steel before each session (realigns the edge); sharpen on a stone or pull-through when honing stops helping. Test on a sheet of paper — a sharp knife glides through, a dull one snags. Everything below assumes a knife that can cut cleanly.

## The cuts, from big to small
A **batonnet** (6 mm sticks) diced becomes a **large/medium dice**. A **julienne** (3 mm sticks) diced becomes a **brunoise**. Learn the stick first; the dice is just the stick cut crosswise.`,
    related: ['julienne', 'batonnet', 'brunoise', 'dicing', 'mincing', 'chiffonade'],
  },
  {
    slug: 'julienne', name: 'Julienne', difficulty: 'intermediate',
    images: [DIAGRAMS.julienne],
    description: 'Thin, uniform matchsticks — 3 mm square and 5–6 cm long. The base for a brunoise, and a fast, elegant cut for stir-fries, slaws, and garnishes.',
    tips: [
      'Square off the vegetable first — trim a thin slice from each rounded side so it sits flat and won\'t roll.',
      'Cut planks the target thickness, stack a few, then slice the stack into sticks.',
      'Keep the stack low (3–4 planks) so the top doesn\'t slide.',
    ],
    content: `## What it is
Matchsticks **3 mm × 3 mm** in cross-section, about **5–6 cm** long. A *fine julienne* is half that (1.5 mm). Uniformity is the whole point — even sticks cook evenly and look deliberate.

## How to cut it
1. **Square the vegetable.** Trim a sliver off each rounded face so you have a rectangular block that sits flat.
2. **Slice into planks** 3 mm thick.
3. **Stack** three or four planks, keep your claw over them, and **slice down** into 3 mm sticks.
4. Trim the sticks to a uniform length.

## Where it shows up
Carrots and peppers for stir-fry, ginger for garnish, potatoes for a fast gratin, zucchini for a raw salad. Dice a julienne crosswise and you have a **brunoise**.`,
    related: ['knife-skills', 'brunoise', 'batonnet'],
  },
  {
    slug: 'batonnet', name: 'Batonnet', difficulty: 'intermediate',
    images: [DIAGRAMS.batonnet],
    description: 'The "little stick" — 6 mm square, about 6 cm long. The parent cut: dice it crosswise for a clean medium or large dice, or think of it as a thick-cut fry.',
    tips: [
      'This is the reference cut — master it and dicing becomes trivial.',
      'Classic pommes frites are essentially a batonnet.',
      'Even planks make even sticks: take your time squaring the block.',
    ],
    content: `## What it is
Sticks **6 mm × 6 mm** in cross-section, about **6 cm** long — noticeably chunkier than a julienne. The batonnet is the "parent" of the dice family: cut it crosswise at 6 mm and you get a small dice; scale up for medium and large.

## How to cut it
1. **Square** the vegetable into a rectangular block.
2. Slice into **6 mm planks**.
3. Stack and slice into **6 mm sticks**.
4. To dice, gather the sticks and cut crosswise at the same width.

## Where it shows up
Steak-fry potatoes, crudité batons, roasted carrot sticks — and as the first step toward a tidy dice.`,
    related: ['knife-skills', 'julienne', 'dicing'],
  },
  {
    slug: 'brunoise', name: 'Brunoise', difficulty: 'advanced',
    images: [DIAGRAMS.brunoise],
    description: 'The finest classic dice — a perfect 3 mm cube. Made by dicing a julienne crosswise. Used for delicate garnishes, mirepoix, and fine sauces.',
    tips: [
      'Only as good as your julienne — get even sticks first.',
      'A fine brunoise is 1.5 mm; reserve it for garnishes and clear soups.',
      'Keep the tip on the board and let the heel do the chopping for speed.',
    ],
    content: `## What it is
A **3 mm cube** — the smallest of the classic dice cuts. A *fine brunoise* is 1.5 mm. It's prized for garnishes, for melting quickly into sauces, and for a refined mirepoix.

## How to cut it
1. Cut a clean **julienne** (3 mm sticks).
2. Gather the sticks, line up the ends, and **slice crosswise at 3 mm**.
3. That's it — even julienne in, even cubes out.

## Where it shows up
A confetti of vegetables over a plated dish, aromatic base for a delicate sauce, or shallots for a mignonette.`,
    related: ['knife-skills', 'julienne'],
  },
  {
    slug: 'dicing', name: 'Dicing', difficulty: 'beginner',
    images: [DIAGRAMS.dice, DIAGRAMS.batonnet],
    description: 'Uniform cubes in three standard sizes — small (6 mm), medium (12 mm), and large (20 mm). Even cubes cook evenly; the method is always plank → stick → cube.',
    tips: [
      'Plank → stick → cube. Every dice is the same three moves at a different width.',
      'For onions, halve pole-to-pole, make horizontal and vertical cuts, then slice across — no need to square.',
      'Match the dice size to the cook time you want: small for quick sauté, large for stew.',
    ],
    content: `## What it is
Even cubes at a chosen size. The three standard dice:

| Dice | Size |
| --- | --- |
| Small | 6 mm |
| Medium | 12 mm |
| Large | 20 mm |

## The universal method: plank → stick → cube
1. **Square** the vegetable so it sits flat.
2. Cut **planks** the target thickness.
3. Stack planks and cut into **sticks** (a batonnet, at the target width).
4. Line up the sticks and cut **crosswise** at the same width → cubes.

## The onion exception
Onions have a natural layered structure, so skip squaring: peel and halve pole-to-pole, lay flat, make a few horizontal cuts toward (not through) the root, then vertical cuts, then slice across. The layers fall apart into an even dice.`,
    related: ['knife-skills', 'batonnet', 'mincing'],
  },
  {
    slug: 'mincing', name: 'Mincing', difficulty: 'beginner',
    images: [DIAGRAMS.claw],
    description: 'Chopping very fine and mostly uniform — for garlic, shallots, ginger, and herbs, where you want the flavor distributed everywhere and no big pieces.',
    tips: [
      'Anchor the tip on the board with your free hand and rock the heel rapidly through the pile.',
      'For garlic, smash the clove first — the peel slips off and it minces in seconds.',
      'A little salt helps garlic break down into a paste; drag the flat of the blade over it.',
    ],
    content: `## What it is
A very fine, roughly uniform chop — finer than a dice, not necessarily perfect cubes. The goal is even distribution of a strong flavor: minced garlic disappears into a sauce; minced herbs coat everything.

## How to do it
1. **Rough chop** first to break the food down.
2. Gather it into a pile. **Anchor the knife tip** on the board with the fingertips of your free hand resting on the spine.
3. **Rock the heel** up and down rapidly, sweeping the pile back together every few passes, until it's fine and even.

## Garlic, specifically
Smash each clove with the flat of the knife (peel slips right off), rough chop, then mince. For a paste — great in dressings — sprinkle a pinch of salt and repeatedly drag the flat of the blade across the mince; the salt's abrasion breaks the garlic down into a smooth purée.`,
    related: ['knife-skills', 'dicing', 'chiffonade'],
  },
  {
    slug: 'chiffonade', name: 'Chiffonade', difficulty: 'intermediate',
    images: [DIAGRAMS.chiffonade],
    description: 'Fine ribbons of leafy herbs or greens — basil, mint, sage, sorrel. Stack, roll into a tight cigar, and slice thinly across.',
    tips: [
      'Stack leaves largest on the bottom, smallest on top, then roll tightly.',
      'Slice, don\'t press — a sharp edge keeps tender herbs like basil from bruising and blackening.',
      'Cut basil last, just before serving; the cut edges oxidize quickly.',
    ],
    content: `## What it is
Delicate **ribbons** of leafy greens or soft herbs, from the French for "made of rags." Used for basil over a caprese, mint on peas, or shredded sorrel through a salad.

## How to do it
1. **Stack** a handful of leaves, largest on the bottom.
2. **Roll** the stack lengthwise into a tight cigar.
3. **Slice thinly across** the roll — 2–3 mm — letting the sharp edge do the work so you don't crush the leaves.
4. Fluff the ribbons apart.

## Keep it green
Tender herbs bruise and blacken where they're crushed or oxidized. Use a sharp knife, cut in one clean pass, and chiffonade basil at the last moment before it hits the plate.`,
    related: ['knife-skills', 'mincing'],
  },
];

// ---------- upsert ----------
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
const now = new Date().toISOString();
const findBySlug = db.prepare('SELECT id FROM techniques WHERE slug = ?');
const update = db.prepare(`UPDATE techniques SET name=?, category=?, difficulty=?, description=?, content=?,
  image_urls=?, tips=?, related_techniques=?, updated_at=? WHERE id=?`);
const insert = db.prepare(`INSERT INTO techniques
  (id, name, slug, category, difficulty, description, content, image_urls, video_url, tips, related_techniques, created_at, updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);

const upsert = db.transaction((items) => {
  for (const t of items) {
    const existing = findBySlug.get(t.slug);
    const imageUrls = JSON.stringify(t.images || []);
    const tips = JSON.stringify(t.tips || []);
    const related = JSON.stringify(t.related || []);
    if (existing) {
      update.run(t.name, CAT, t.difficulty, t.description, t.content, imageUrls, tips, related, now, existing.id);
    } else {
      insert.run(randomUUID(), t.name, t.slug, CAT, t.difficulty, t.description, t.content, imageUrls, null, tips, related, now, now);
    }
  }
});
upsert(techniques);

const rows = db.prepare("SELECT name FROM techniques WHERE category = ? ORDER BY name").all(CAT);
console.log(`Knife Skills category now has ${rows.length}: ${rows.map((r) => r.name).join(', ')}`);
db.close();
