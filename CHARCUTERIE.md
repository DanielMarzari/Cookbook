# Charcuterie — integration notes

A board planner for Cookbook: 202 ingredients, the reasons they go together,
and how to cut each one so the board looks deliberate. Lives under
`/charcuterie`, saves to the Cookbook database.

Everything is already applied in this branch. These notes are so you can see
what was added, what was touched, and what to do next.

## What was added

```
src/lib/charcuterie/          the engine — no React, no DB
  types.ts                    Item / Zone / Board / Cut vocabulary
  catalog/*.ts                202 ingredients, split by category
  items.ts                    assembles the catalogue, lookups
  pairings.ts                 56 weighted affinity rules + scoring
  boards.ts                   6 silhouettes × 13 arrangements
  geometry.ts                 seeded PRNG + SVG path builders
  advice.ts                   balance, critiques, shopping list, build order
  themes.ts                   13 one-click curated boards
  graph.ts                    the pairing network + force layout
  mockups.ts                  the six view definitions
  schema.ts                   3 SQLite tables  ← DB
  store.ts                    server-side reads/writes  ← DB

src/components/charcuterie/   the views
src/app/charcuterie/          the routes
src/app/api/charcuterie/      boards + pantry endpoints
```

## What was touched in your files

Four small edits, all additive:

1. **`src/lib/db.ts`** — one import, one `db.exec(CHARCUTERIE_SCHEMA_SQL)` next
   to the existing `db.exec(SCHEMA_SQL)`. The charcuterie tables live in their
   own file so the section drops in as a unit.
2. **`src/components/Navigation.tsx`** — one nav item (`Grape` icon,
   `/charcuterie`), placed after Seasonal.
3. **`src/app/globals.css`** — two keyframes (`charc-march`, `charc-breathe`)
   for the hover outline and the empty-section pulse, with a
   `prefers-reduced-motion` opt-out.
4. **`package.json`** — added `motion` (motion.dev) for the animation.

No existing component, route, table or style was modified.

## The database

Three tables, all `CREATE TABLE IF NOT EXISTS`, applied on boot like the rest of
the schema:

| Table | What it holds |
| --- | --- |
| `charcuterie_boards` | a saved board: name, silhouette, arrangement, mode, guests |
| `charcuterie_board_items` | what's on it — zone fills, or freeform x/y/scale/rot |
| `charcuterie_pantry` | what's in your fridge, globally |

The pantry is deliberately global rather than per-board: it's a property of
you, not of any one board, and it's what every suggestion everywhere ranks
against.

The 202-ingredient catalogue stays in TypeScript rather than the database. It's
authored content under version control, not user data — the same reason your
recipes are in SQLite but your cuisine list isn't. If you later want to add your
own cheeses in-app, the natural move is a `charcuterie_custom_items` table
merged over the base catalogue in `items.ts`; nothing else would need to change.

### Endpoints

```
GET    /api/charcuterie/boards        every saved board
POST   /api/charcuterie/boards        insert or update (pass id to update)
GET    /api/charcuterie/boards/[id]
DELETE /api/charcuterie/boards/[id]
GET    /api/charcuterie/pantry
PUT    /api/charcuterie/pantry
```

## The six views

They started as a comparison exercise — six answers to "how do you plan a
board" over one shared data layer. They're all still here, reachable from the
section nav:

- **Studio** — guided zones on a real silhouette. Hover a section to see its
  true shape; click to fill it from ranked suggestions. This is the one to make
  the default if you want a single front door.
- **Atelier** — freeform: drag out of the tray, move/scale/rotate/layer by hand.
- **Editorial** — the board assembles itself stage by stage as you scroll,
  ending in the shopping list. Doubles as the printable build guide.
- **Console** — ⌘K palette and a pairing-matrix heatmap.
- **Pocket** — swipe keep/skip; the board builds from what you kept.
- **Web** — the pairing graph, walkable; your path becomes the board.

Studio and Atelier both save to the database. The other four are exploratory
and don't persist — if you keep them, that's fine; if you cut them, delete the
route folder and the matching entry in `mockups.ts` and nothing else breaks.

## Styling

Ported to your palette: `bg-background`, `text-text`, `text-text-secondary`,
`border-border`, hairline rules, `rounded-lg`, underline-as-affordance, and the
34/52px `font-normal` display heading. The one warm tone is `#a0522d`, which
your codebase already uses — it marks "at peak right now" and "this axis is
short".

The board artwork keeps its full colour. That's deliberate: your design note
says photography carries the colour, and on these pages the board *is* the
photograph.

## Worth knowing

- **The graph renders client-side only.** Node and the browser don't agree to
  the last bit on `Math.sin`/`cos`, and 340 iterations of a force simulation
  amplify that into visibly different coordinates — a real hydration mismatch.
  Everything else is server-rendered.
- **`motion` owns `transform`** on elements it animates. Atelier centres
  placements with negative percentage margins rather than a translate, because
  motion would overwrite it.
- All food geometry is deterministic, seeded from item and zone ids, so nothing
  reshuffles between renders or between server and client.

## Verified

`tsc`, `eslint` and `next build` clean. All eight routes 200 with no console
errors and no horizontal overflow at 1440px. Save → list → reopen round-trips
through SQLite; the pantry persists and re-ranks suggestions on reload.
