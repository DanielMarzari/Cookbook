# Foraging verification — where this stands

`src/data/foraging-species.ts` is generated from `approved.json`. **Nothing goes in
it that hasn't been approved by an independent confirm pass.** The failure mode here
is someone eating the wrong thing, so an unverified entry is worse than no entry.

## Done — 20 species live

117 lookalikes, 31 of them deadly, 15 species rated `expert`.

Chestnut · Burdock root · Jerusalem artichoke · Sassafras · Elderberry ·
Common chickweed · Dandelion · Ostrich fern fiddleheads · Garlic mustard · Ramps ·
Stinging nettle · Wild garlic · Common blue violet · Chicken of the Woods ·
Hen of the Woods · Giant Puffball · Morel · Oyster Mushroom · Golden Chanterelle ·
Lion's Mane

## Left to do

**1. Three nuts — corrected, not yet confirmed.** In `corrected-pass1.json`, need
the confirm pass only (~1 agent each):

    Shagbark hickory nut · Acorns (white oak group) · Black walnut

Run: `Workflow({scriptPath: <forage-confirm-pass1-*.js>, args: [<names>]})`
The script confirms first and only revises what gets blocked, so approved entries
cost one agent. Batches of 5 ran ~5-7 agents / 260-400k tokens.

**2. Fifteen never reviewed.** In `todo.json` — these have only the raw research,
which had a ~100% defect rate, so they need the full correct-then-confirm loop
(~10-20 agents per batch of 5):

    Blackberry & black raspberry · Wild blueberry · Pawpaw · Serviceberry ·
    Mulberry · American persimmon · Beach plum · Glasswort/Sea Beans · Bull Kelp ·
    Staghorn Sumac · Spicebush · Wild Bergamot · Prickly Pear · Common Juniper ·
    Bayberry/Wax Myrtle

## Gotchas that cost real tokens to learn

- The `Lookalike` key is **`danger`**, not `severity`, and the union is
  `deadly | toxic | unpalatable` — there is no `harmless`. Getting this wrong makes
  `ForageSection` find zero deadly lookalikes and silently drop the warning banner.
- `months` is **0-indexed** (0 = January).
- `regions` must be real `RegionId`s (`northeast southeast midwest southcentral
  mountain west`) or `'all'` — prose region names get dropped on normalization.
- If any lookalike is `deadly`, `caution` must be `expert`. Applied as a rule.
- Entry prose runs long (habitat averages ~2,200 chars). The row shows `lead()`;
  the full text appears on open. Don't shorten the source text to fit the UI.

## Provenance

`raw.json` original research → `to-verify.json` → `corrected-pass1.json` /
`corrected-batch1.json` → `approved.json` (source of truth) → generated TS.
`review/` and `confirm-batch*.json` hold reviewer verdicts and blocking lists.
