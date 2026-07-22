#!/usr/bin/env node
// Seed the "Plating" technique category with written guides, tips, and authored
// monochrome SVG diagrams (inline data URIs). Idempotent: upserts by slug.
//
// Usage: node scripts/seed-plating.mjs [path-to-db]
import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || process.env.DATABASE_PATH || join(__dirname, '..', 'cookbook.db');
const CAT = 'Plating';

// ---------- SVG helpers (ink line-art on white) ----------
const INK = '#141310', MUT = '#767676', FILL = '#ffffff', SH1 = '#efece4', SH2 = '#e2ded3', ACC = '#5a6b33';
function wrap(inner, w = 460, h = 300) {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="Helvetica,Arial,sans-serif">`
    + `<rect width="${w}" height="${h}" fill="#fff"/>` + inner + `</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(s);
}
const title = (t) => `<text x="24" y="32" fill="${INK}" font-size="17" font-weight="bold">${t}</text>`;
const note = (t, y = 276) => `<text x="24" y="${y}" fill="${MUT}" font-size="12.5">${t}</text>`;
// a plate: outer rim + inner well, centered at (cx,cy)
const plate = (cx, cy, r) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${FILL}" stroke="${INK}" stroke-width="1.6"/>`
  + `<circle cx="${cx}" cy="${cy}" r="${r - 12}" fill="none" stroke="${MUT}" stroke-width="1" stroke-dasharray="3 3"/>`;
const blob = (cx, cy, rx, ry, fill = SH1, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${INK}" stroke-width="1.4" transform="rotate(${rot} ${cx} ${cy})"/>`;

const DIAGRAMS = {
  thirds: wrap(title('Rule of thirds — off-centre focal point')
    + plate(230, 165, 120)
    + `<g stroke="${MUT}" stroke-width="0.9" stroke-dasharray="4 4">`
    + `<line x1="150" y1="45" x2="150" y2="285"/><line x1="310" y1="45" x2="310" y2="285"/>`
    + `<line x1="110" y1="112" x2="350" y2="112"/><line x1="110" y1="218" x2="350" y2="218"/></g>`
    + blob(150, 112, 40, 30, SH2, -12) // focal at an intersection
    + `<circle cx="150" cy="112" r="4" fill="${ACC}"/>`
    + blob(250, 210, 52, 16, SH1, -18) // sauce sweep
    + note('Place the hero where the lines cross — not dead centre. Let the rest flow from it.')),

  clock: wrap(title('The clock method')
    + plate(230, 160, 120)
    + `<g fill="${MUT}" font-size="11" text-anchor="middle">`
    + `<text x="230" y="58">12</text><text x="342" y="164">3</text><text x="230" y="272">6</text><text x="118" y="164">9</text></g>`
    + blob(230, 205, 60, 26, SH2, 0) // protein at 6
    + `<text x="230" y="209" fill="${INK}" font-size="11" text-anchor="middle">protein · 6</text>`
    + blob(180, 118, 34, 22, SH1, -20) // starch ~10
    + `<text x="180" y="121" fill="${INK}" font-size="10" text-anchor="middle">starch</text>`
    + blob(286, 120, 34, 20, SH1, 24) // veg ~2
    + `<text x="286" y="123" fill="${INK}" font-size="10" text-anchor="middle">veg</text>`
    + note('Protein at 6 o’clock (nearest the diner), starch and vegetable at 10 and 2.')),

  negative: wrap(title('Negative space')
    + plate(230, 160, 122)
    + blob(175, 150, 46, 34, SH2, -14)
    + blob(205, 200, 30, 16, SH1, 10)
    + `<circle cx="235" cy="150" r="3" fill="${ACC}"/><circle cx="250" cy="164" r="3" fill="${ACC}"/><circle cx="222" cy="178" r="3" fill="${ACC}"/>`
    + `<text x="300" y="130" fill="${MUT}" font-size="12" text-anchor="middle">empty</text>`
    + `<text x="300" y="146" fill="${MUT}" font-size="12" text-anchor="middle">space</text>`
    + note('Cluster the food off to one side. The empty plate is part of the composition.')),

  height: wrap(title('Building height (side view)')
    + `<line x1="60" y1="230" x2="400" y2="230" stroke="${INK}" stroke-width="1.6"/>`
    + `<path d="M120,230 q110,10 210,0" fill="none" stroke="${MUT}" stroke-width="1"/>` // plate curve
    + `<ellipse cx="225" cy="220" rx="70" ry="12" fill="${SH1}" stroke="${INK}" stroke-width="1.2"/>` // base
    + `<ellipse cx="225" cy="196" rx="46" ry="11" fill="${SH2}" stroke="${INK}" stroke-width="1.2"/>` // mid
    + `<ellipse cx="225" cy="176" rx="26" ry="9" fill="${FILL}" stroke="${INK}" stroke-width="1.2"/>` // top
    + `<path d="M225,168 q14,-30 30,-44" fill="none" stroke="${ACC}" stroke-width="1.6"/>` // garnish leaning
    + `<circle cx="255" cy="124" r="4" fill="${ACC}"/>`
    + note('Anchor a stable base, layer inward and up, lean one tall element for movement.')),

  quenelle: wrap(title('The quenelle — three-spoon method')
    + `<g stroke="${INK}" stroke-width="1.5" fill="${SH1}">`
    + `<ellipse cx="150" cy="150" rx="60" ry="34" transform="rotate(-18 150 150)"/></g>` // scoop of purée
    + `<path d="M120,120 q30,-24 60,-8" fill="none" stroke="${MUT}" stroke-width="1.2" stroke-dasharray="3 3"/>`
    + `<g stroke="${INK}" stroke-width="1.5" fill="${FILL}">` // finished quenelle (three-sided egg)
    + `<path d="M300,150 q10,-40 60,-30 q40,10 30,40 q-14,34 -60,26 q-40,-8 -30,-36z"/></g>`
    + `<path d="M312,132 q30,-14 60,4" fill="none" stroke="${ACC}" stroke-width="1.4"/>` // smoothing arc
    + `<text x="150" y="205" fill="${MUT}" font-size="12" text-anchor="middle">warm spoon, scoop</text>`
    + `<text x="330" y="205" fill="${MUT}" font-size="12" text-anchor="middle">three smooth faces</text>`
    + note('Two warm spoons: scoop, then pass the purée between them, turning, to shape three faces.')),

  swoosh: wrap(title('Sauce — swoosh, drag & dots')
    + plate(230, 160, 122)
    + `<path d="M150,140 q10,-26 44,-20 q40,8 30,40 q-16,40 -70,30 q30,-2 40,-24 q8,-18 -10,-24 q-24,-8 -34,22z" fill="${SH2}" stroke="${INK}" stroke-width="1.3"/>` // comma swoosh
    + `<g fill="${SH1}" stroke="${INK}" stroke-width="1.2">`
    + `<circle cx="270" cy="120" r="12"/><circle cx="300" cy="150" r="8"/><circle cx="322" cy="176" r="5"/></g>`
    + `<path d="M270,132 q6,14 -4,26" fill="none" stroke="${INK}" stroke-width="1"/>` // dragged teardrop
    + note('Spoon a pool, then drag its edge in one confident stroke. Dots: pipe, then drag with a pick.')),
};

// ---------- techniques ----------
const T = [
  {
    slug: 'plating-fundamentals', name: 'Plating Fundamentals', difficulty: 'beginner',
    images: [DIAGRAMS.thirds],
    description: 'How a plate reads: a focal point, off-centre balance, odd numbers, negative space, and a line for the eye to follow.',
    tips: [
      'Decide the hero first, then arrange everything to point at it.',
      'Odd numbers (3, 5) look more natural than even.',
      'Leave real empty space — a crowded plate reads as chaos.',
      'Wipe the rim; the frame should be clean.',
    ],
    content: `## The plate is a picture
Good plating is composition, not decoration. Before anything touches the plate, decide the **focal point** — usually the protein or the single best element — and build everything else to support and point toward it.

## Five rules that carry most plates
1. **Off-centre beats centred.** Place the hero where imaginary "rule of thirds" lines cross, not dead middle. It creates tension and movement.
2. **Work in odd numbers.** Three scallops, five dots — odd groupings feel intentional and natural; even ones feel like a diagram.
3. **Give it negative space.** Empty plate frames the food. Cluster elements; don't spread them wall to wall.
4. **Make a line.** Arrange components along a gentle diagonal or arc so the eye travels across the plate instead of stopping.
5. **Height reads as care.** Even a little lift — leaning a chip, stacking greens — makes a plate look composed.

## Everything earns its place
If a garnish isn't edible and doesn't add flavour, texture, or aroma, leave it off. The best modern plates look effortless because nothing on them is spare.`,
    related: ['the-clock-method', 'negative-space', 'choosing-the-plate'],
  },
  {
    slug: 'the-clock-method', name: 'The Clock Method', difficulty: 'beginner',
    images: [DIAGRAMS.clock],
    description: 'The classic training-kitchen layout: protein at 6 o’clock nearest the diner, starch and vegetable at 10 and 2.',
    tips: [
      'Protein closest to the diner (6 o’clock) so it’s the first thing they reach.',
      'Think of the plate as a clock face to keep placement consistent across a service.',
      'Break the rule on purpose once you know it — not by accident.',
    ],
    content: `## What it is
A simple, reliable framework taught in professional kitchens: imagine the plate as a **clock face**.

- **Protein → 6 o’clock**, closest to the diner.
- **Starch → 10 o’clock.**
- **Vegetable → 2 o’clock.**

It guarantees a balanced, legible plate and keeps a whole line of cooks plating the same dish identically.

## Why it works
Putting the protein nearest the diner makes it the obvious focus and the easiest to cut. Splitting starch and vegetable to the upper corners frames the protein and keeps components from bleeding into each other.

## When to leave it
The clock is a foundation, not a ceiling. Once it's second nature, break it deliberately — sweep everything to one side, stack vertically, or plate off a rim — but always for a reason.`,
    related: ['plating-fundamentals', 'building-height'],
  },
  {
    slug: 'negative-space', name: 'Negative Space & Balance', difficulty: 'intermediate',
    images: [DIAGRAMS.negative],
    description: 'Using the empty plate as part of the composition — clustering food and letting blank space do the framing.',
    tips: [
      'Aim to leave roughly a third to half of the plate empty.',
      'A bigger plate makes a small portion look intentional and refined.',
      'Balance visual weight — a dense element on one side wants a lighter counterpoint, not a mirror.',
    ],
    content: `## Space is an ingredient
Beginners fill the plate; professionals leave room. **Negative space** — the empty area around the food — is what makes a composition read as deliberate rather than crowded.

## How to use it
- **Cluster, don't scatter.** Group components toward one area or along a line, leaving clean plate around them.
- **Size up the plate.** The same portion on a larger plate instantly looks more considered.
- **Balance weight, don't mirror.** If a heavy, dark element sits on one side, answer it with something small and bright — a few dots, a herb — rather than duplicating it.

## The test
Squint at the finished plate. If your eye lands somewhere specific and there's calm around it, the balance is right. If it darts around with nowhere to rest, pull elements together and open up space.`,
    related: ['plating-fundamentals', 'choosing-the-plate'],
  },
  {
    slug: 'building-height', name: 'Building Height & Layering', difficulty: 'intermediate',
    images: [DIAGRAMS.height],
    description: 'Giving a plate a third dimension — a stable base, layered components, and one tall element for movement.',
    tips: [
      'Build on a base that won’t slide — a smear of purée or a mound of grains anchors the stack.',
      'Lean crisp elements against soft ones so they stay upright.',
      'Add the tallest, most fragile garnish last, right before it goes out.',
    ],
    content: `## Why height matters
Flat food looks like a cafeteria tray; even a little verticality reads as craft. Height also lets you fit more on the plate without spreading it wide.

## How to build up
1. **Anchor a base.** Start with something that grips — a swipe of purée, a nest of noodles, a mound of lentils — so the stack doesn't slide.
2. **Layer inward and up.** Place larger, heavier pieces first, then tuck smaller ones in and on top, working toward the centre.
3. **Lean for movement.** Rest a crisp element (a tuile, a chip, a long herb) at an angle against the pile. Diagonal lines feel alive; perfectly vertical stacks feel stiff.
4. **Crown it last.** The delicate, tallest garnish goes on at the very end so it doesn't wilt or topple during plating.

## Keep it edible and stable
Height for its own sake collapses on the way to the table. Every tall element should be structural *and* something the diner will actually eat.`,
    related: ['the-clock-method', 'garnish'],
  },
  {
    slug: 'the-quenelle', name: 'The Quenelle', difficulty: 'advanced',
    images: [DIAGRAMS.quenelle],
    description: 'The three-sided egg shape — the mark of a pastry or garde-manger cook — formed by passing a soft mixture between two warm spoons.',
    tips: [
      'Warm the spoons in hot water and wipe dry — heat releases the quenelle cleanly.',
      'Keep the mixture cold and firm; ice cream, ganache, mousse, and thick purées quenelle best.',
      'Three passes, three faces. Don’t over-work it or the surface goes rough.',
    ],
    content: `## What it is
A **quenelle** is a smooth, three-faceted egg (or rugby-ball) shape. Originally a poached forcemeat dumpling, the word now describes the *shape* — used for sorbet, mousse, whipped butter, ganache, or a firm purée.

## The three-spoon method
You need two spoons of the same size and a cup of hot water.
1. **Warm both spoons** in the hot water; wipe one dry.
2. **Scoop** a generous spoonful of a cold, firm mixture, dragging the spoon toward you so it fills and mounds.
3. **Pass it to the second (warm, dry) spoon**, scooping under and turning — this presses the first smooth face.
4. **Pass back**, turning again, to shape the second and third faces. Two or three passes gives the classic three-sided quenelle.
5. **Release** it onto the plate by resting the spoon's edge down and letting it slide off.

## Troubleshooting
- **Sticking / tearing:** spoon too cold, or mixture too warm and soft. Re-warm the spoon; chill the mixture.
- **Rough surface:** over-worked. Fewer, more confident passes.
- **Won't hold a point:** mixture too loose — firm it up (chill, or fold in more base).`,
    related: ['sauce-swoosh', 'plating-fundamentals'],
  },
  {
    slug: 'sauce-swoosh', name: 'Sauce Swoosh & Smear', difficulty: 'intermediate',
    images: [DIAGRAMS.swoosh],
    description: 'The confident single-stroke sauce sweep — spoon a pool, then drag its edge across the plate in one motion.',
    tips: [
      'Use a sauce with body — a purée or reduction holds a line; a thin jus just runs.',
      'One committed stroke. Hesitation shows as a wobbly, broken smear.',
      'Warm the plate slightly so the sauce sets where you place it.',
    ],
    content: `## The move
The restaurant "swoosh" is one confident stroke, not a paint job.
1. **Spoon a pool** of a thick sauce or purée onto the plate, a little off-centre.
2. **Set the back of the spoon** into one edge of the pool.
3. **Drag in a single motion** — straight, curved, or a comma — pulling the sauce into a tapering smear. Speed and commitment give a clean line; going slow leaves ridges.

## Variations
- **Comma / teardrop:** start on a dot and pull away so it tapers to nothing.
- **Wide sweep:** use a large spoon or a small offset spatula for a broad band under the main element.
- **Two-tone:** lay two sauces side by side and drag through both.

## What to sauce with
Reductions, coulis, thick purées (pea, beet, pepper), flavoured oils, and yogurt all hold a smear. Anything watery will bleed — reduce it or thicken slightly first. Plate the sauce **first**, then set components into and around it.`,
    related: ['the-quenelle', 'sauce-dots', 'building-height'],
  },
  {
    slug: 'sauce-dots', name: 'Dots, Teardrops & Dragging', difficulty: 'intermediate',
    images: [DIAGRAMS.swoosh],
    description: 'Precise sauce work with a squeeze bottle — graduated dots, dragged teardrops, and fine lines.',
    tips: [
      'A squeeze bottle gives control; the tip size sets the dot size.',
      'Drag a toothpick or skewer tip through a row of dots to turn them into hearts or teardrops.',
      'Vary dot size in odd-numbered runs (big → small) for rhythm.',
    ],
    content: `## Tools
A **squeeze bottle** is the workhorse for dots and lines; a small offset spatula and a toothpick finish them. Keep sauces smooth and lump-free so they flow evenly.

## The techniques
- **Graduated dots:** squeeze a row of dots that shrink in size (large to small). Odd numbers, gentle arc.
- **Teardrops:** pipe a dot, then drag a skewer tip through its edge and pull away — the dot tapers into a teardrop.
- **Linked hearts:** pipe a row of dots, then drag one clean line straight through all of them.
- **Fine lines:** a steady stream from a narrow tip draws lattices or accents.

## Restraint
Dots are seasoning, not wallpaper. A few placed with intent beat a plate speckled edge to edge. Every dot should be a component the diner is meant to taste with a bite — not just decoration.`,
    related: ['sauce-swoosh', 'garnish'],
  },
  {
    slug: 'sauce-nage', name: 'Pooling, Nage & Tableside Sauce', difficulty: 'intermediate',
    images: [DIAGRAMS.negative],
    description: 'Sauces that surround rather than streak — a clean pool under the food, or a broth poured at the table.',
    tips: [
      'Pour a pool first and set components into it so they don’t slide.',
      'For a moat, keep crisp elements above the liquid line so they stay crunchy.',
      'Tableside pours turn a plate into a moment — serve the broth hot in a small jug.',
    ],
    content: `## When to pool instead of smear
Some dishes want the sauce as a **surround** — a shallow, glossy pool of jus, beurre blanc, or velouté that the components sit in. It reads calm and classic where a swoosh reads modern.

## How to do it clean
1. **Plate the solid components** first, slightly raised on a base if you want them to stay dry on top.
2. **Pour the sauce around them**, from a small jug or ladle, to a shallow even depth. Don't drown the food — you want a rim of pool, not a soup.
3. **Wipe the plate rim** after pouring.

## Tableside nage
A **nage** (aromatic broth) or consommé poured over the dish *in front of the diner* is theatre: it releases aroma at the table and keeps garnishes crisp until the last second. Send the plate out with the solids arranged and bring the hot liquid in a separate vessel to pour on serving.`,
    related: ['sauce-swoosh', 'negative-space'],
  },
  {
    slug: 'garnish', name: 'Purposeful Garnish', difficulty: 'beginner',
    images: [DIAGRAMS.thirds],
    description: 'Garnish that earns its place — micro-herbs, edible flowers, citrus, and crisp accents, placed with tweezers, never as filler.',
    tips: [
      'Everything on the plate must be edible and add flavour, texture, or aroma.',
      'Place small, delicate garnish with tweezers for control.',
      'Garnish should echo an ingredient already in the dish, not introduce a random one.',
    ],
    content: `## The one rule
**If it isn't edible and doesn't add something, it doesn't go on the plate.** The sprig of curly parsley and the orange twist nobody eats are gone from modern kitchens. Garnish is a component, not confetti.

## What good garnish does
- **Micro-herbs & tender leaves** add a fresh aromatic top note and a point of green.
- **Edible flowers** add colour and a subtle floral or peppery bite — nasturtium, viola, borage.
- **Citrus zest / supremes** add brightness that cuts richness.
- **Crisp accents** — a tuile, toasted nuts, seeds, a shard of crackling — add the textural contrast a plate often lacks.

## Placement
Use **tweezers** for anything small; fingers crush and smear. Place garnish *on* or *leaning into* a component so it looks integrated, not sprinkled. Echo the dish — micro-basil on a tomato plate, dill on cured fish — so the garnish tastes like it belongs.`,
    related: ['plating-fundamentals', 'colour-contrast', 'texture-plate'],
  },
  {
    slug: 'colour-contrast', name: 'Colour & Contrast', difficulty: 'beginner',
    images: [DIAGRAMS.negative],
    description: 'Using colour to make a plate appetising — contrast against the vessel, a bright accent, and avoiding a monochrome plate.',
    tips: [
      'Add a fresh green or a bright acid element to lift a brown or beige plate.',
      'Contrast the food against the plate colour — dark food on white, pale food on dark or coloured plates.',
      'Natural colours read as fresh; over-bright or unnatural colour reads as fake.',
    ],
    content: `## Why colour sells the dish
We taste with our eyes first. A plate of beige-on-beige reads as heavy and dull no matter how good it tastes; a single bright accent makes the whole thing look fresh and considered.

## How to work with colour
- **Contrast food against the vessel.** Dark, saucy food pops on white; pale or delicate food (crudo, cauliflower) can look better on a dark or coloured plate.
- **Rescue the brown plate.** Fried and braised food is delicious and beige — add a green herb, a bright purée (pea, beet), pickled onion, or a citrus element to lift it.
- **Limit the palette.** Two or three colours plus the plate is plenty. A rainbow looks busy.
- **Keep it natural.** The most appetising colours are the ingredients' own. Reach for a real green or red, not food colouring.`,
    related: ['garnish', 'choosing-the-plate'],
  },
  {
    slug: 'texture-plate', name: 'Texture & Crunch on the Plate', difficulty: 'intermediate',
    images: [DIAGRAMS.height],
    description: 'Designing textural contrast into a plate — a crisp element against something soft — so every bite has interest.',
    tips: [
      'Every plate wants at least one crunch against its soft components.',
      'Keep crisp elements dry — above the sauce line — until serving.',
      'Contrast temperature too: something cool or frozen against something warm.',
    ],
    content: `## Texture is half of eating
A dish that's all soft — purée, braise, mousse — feels one-note in the mouth however good the flavour. Building in **textural contrast** is as important as colour or shape.

## Add a crunch
- **Crisp accents:** tuiles, croutons, toasted nuts and seeds, fried shallots, crackling, dehydrated crisps, crumble.
- **Keep them crisp:** place crunchy elements *on top* or *above the sauce*, and add them at the last moment so moisture doesn't soften them.

## Play temperatures and states
Contrast isn't only crunchy-vs-soft. A cool, sharp element (a quenelle of sorbet, a raw herb, a pickle) against something warm and rich wakes the palate up. Think about how each bite will *feel*, not just taste, and make sure there's more than one sensation.`,
    related: ['building-height', 'garnish'],
  },
  {
    slug: 'choosing-the-plate', name: 'Choosing the Plate', difficulty: 'beginner',
    images: [DIAGRAMS.thirds],
    description: 'The vessel is part of the dish — its size, shape, colour, and rim frame everything you put on it.',
    tips: [
      'Bigger plate, smaller-looking portion — use size to create negative space.',
      'A wide rim acts as a built-in frame; keep it spotless and empty.',
      'Match the vessel to the food: shallow bowls for saucy dishes, flat plates for composed ones.',
    ],
    content: `## The plate frames the picture
Before you plate, choose the vessel deliberately — it's the frame around your composition.

## What to consider
- **Size.** A larger plate gives you negative space and makes a refined portion look intentional. Too small and everything crowds the rim.
- **Shape.** Flat plates suit dry, composed dishes and let you work with height and sauce sweeps. Shallow bowls corral sauces, broths, and loose components. Deep bowls are for soups and stews.
- **Colour.** White is the neutral gallery wall — nearly everything reads well on it. Dark and coloured plates create drama for pale food but fight busy plates.
- **Rim.** A wide rim is a ready-made frame; keep it clean and empty. A coupe (rimless) plate gives you the whole surface to compose on.

## Consistency
In a set, plate every serving on the same vessel and in the same layout. Consistency is what separates "plated" from "just served."`,
    related: ['plating-fundamentals', 'negative-space', 'colour-contrast'],
  },
  {
    slug: 'plate-prep-rims', name: 'Clean Rims & Plate Prep', difficulty: 'beginner',
    images: [DIAGRAMS.clock],
    description: 'The finishing discipline — warm the plate, keep the rim spotless, and send it out clean.',
    tips: [
      'Warm plates for hot food, chilled plates for cold — temperature holds the dish.',
      'Keep a folded, damp cloth on the pass to wipe every rim before it leaves.',
      'Plate at the last minute; food waits for no one under the lights.',
    ],
    content: `## The details that finish a plate
The composition can be perfect and a smudged rim still ruins it. Plate prep is the quiet discipline that makes food look professional.

## The checklist
1. **Temperature the vessel.** Warm plates in a low oven or warming drawer for hot food; chill plates for cold dishes. A cold plate kills a hot dish in seconds.
2. **Plate to order, fast.** Have every component ready (*mise en place*) and assemble quickly so nothing wilts, weeps, or cools while you fuss.
3. **Wipe the rim.** Keep a folded cloth (dampened with a little water or vinegar) on the pass and wipe drips, fingerprints, and stray sauce off the rim of every plate before it goes out.
4. **Final look.** Check from the diner's angle, adjust one thing if needed, then send it. Don't over-tweak — a plate handled too much looks handled.`,
    related: ['choosing-the-plate', 'plating-fundamentals'],
  },
  {
    slug: 'composed-vs-natural', name: 'Composed vs. Natural Plating', difficulty: 'advanced',
    images: [DIAGRAMS.negative],
    description: 'Two modern schools — precise, structured composition versus the loose, organic “natural” style of restaurants like Noma.',
    tips: [
      'Pick a style per dish and commit — mixing precise and wild on one plate reads as indecision.',
      '“Natural” looks effortless but is deliberate; every scattered element is placed.',
      'Let the ingredient lead — its shape and colour often suggest the style.',
    ],
    content: `## Two ways to plate the modern plate
Contemporary fine dining swings between two poles. Knowing both — and choosing one per dish — is what makes plating feel intentional.

## Composed / structured
Precise, architectural plating: clean lines, deliberate geometry, quenelles, graduated dots, careful height. Everything is placed with tweezers to the millimetre. It signals control and refinement. Think classic tasting-menu plating.

## Natural / organic
The look popularised by **Noma** and the New Nordic movement: food arranged to look as if it fell into place — foraged leaves, edible flowers, "broken" textures, asymmetry, elements that spill and lean. It signals nature, seasonality, and ease.

The trick: it only *looks* accidental. Every leaf and crumb is placed with as much intent as a composed plate — the goal is studied effortlessness, not actual randomness.

## Choosing
Let the dish decide. A precise, technical dish (a terrine, a tart) wants composed plating. A rustic, seasonal, ingredient-driven plate wants the natural style. Commit fully to one — a half-precise, half-wild plate just looks unsure.`,
    related: ['plating-fundamentals', 'garnish', 'negative-space'],
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
    if (existing) update.run(t.name, CAT, t.difficulty, t.description, t.content, imageUrls, tips, related, now, existing.id);
    else insert.run(randomUUID(), t.name, t.slug, CAT, t.difficulty, t.description, t.content, imageUrls, null, tips, related, now, now);
  }
});
upsert(T);

const rows = db.prepare('SELECT name FROM techniques WHERE category = ? ORDER BY name').all(CAT);
console.log(`Plating category now has ${rows.length}: ${rows.map((r) => r.name).join(', ')}`);
db.close();
