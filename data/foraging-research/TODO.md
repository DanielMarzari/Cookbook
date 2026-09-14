# Foraging verification — where this stands

`src/data/foraging-species.ts` is generated from `approved.json` by
`scripts/build-foraging.mjs`. **Nothing goes in it that hasn't been approved by an
independent confirm pass.** The failure mode here is someone eating the wrong
thing, so an unverified entry is worse than no entry.

## Done — 37 species live

220 lookalikes, 64 of them deadly.

Acorns (white oak group) · American persimmon · Beach plum · Black walnut ·
Blackberry, dewberry & black raspberry · Bull kelp · Burdock root · Chestnut ·
Chicken of the Woods · Common blue violet · Common chickweed · Common juniper ·
Dandelion · Elderberry · Garlic mustard · Giant Puffball · Glasswort ·
Golden Chanterelle · Hen of the Woods · Jerusalem artichoke · Lion's Mane ·
Morel · Mulberry · Ostrich fern fiddleheads · Oyster Mushroom · Pawpaw ·
Prickly pear · Ramps · Sassafras · Serviceberry · Shagbark hickory nut ·
Spicebush · Staghorn Sumac · Stinging nettle · Wild bergamot · Wild blueberry ·
Wild garlic

That is every species the research set started with, bar one.

## Withheld — bayberry & wax myrtle

Blocked by three independent reviewers over three revision rounds, each of which
found new safety-critical gaps rather than clearing the last set. Kept in full in
`withheld.json` with all three reviews, so the work is recoverable — but it does
not ship in this state.

The load-bearing problem is that bayberry has no reliable leaf-in-hand test.
Everything that identifies it — aromatic, alternate, leathery, resin-dotted,
multi-stemmed — is equally true of sweet gale (`Myrica gale`), which shares its
ground and is contraindicated in pregnancy; and Pacific ngaio (`Myoporum laetum`),
a hepatotoxic California hedge plant, has the gland dots that were supposed to be
the confirmatory character. Anyone picking this up again should start from the
third reviewer's suggestion: stop treating pond edges, swale bottoms, bog margins
and salt-marsh rims as picking ground, and confine the entry to dry back-dune,
pine-barren and sandhill plants.

## Gotchas that cost real tokens to learn

- The `Lookalike` key is **`danger`**, not `severity`, and the union is
  `deadly | toxic | unpalatable` — there is no `harmless`. Getting this wrong makes
  `ForageSection` find zero deadly lookalikes and silently drop the warning banner.
  The build script now rejects this instead of shipping it.
- `months` is **0-indexed** (0 = January).
- `regions` must be real `RegionId`s (`northeast southeast midwest southcentral
  mountain west`) or `'all'` — prose region names get dropped on normalization.
- If any lookalike is `deadly`, `caution` must be `expert`. Enforced by the build.
- **`months` × `regions` is a filter, not a description.** `forageFor()` lists a
  species to a reader in that region in that month, so a month in the array is a
  claim that someone in *every* listed region can go out and find it then. A
  year-round array was what blocked bayberry first time: it would have offered a
  bare northeastern shrub in January, when its evergreen deadly lookalikes are the
  only thing in leaf. Range nuance belongs in habitat prose.
- Entry prose runs long (habitat averages ~2,200 chars). The row shows `lead()`;
  the full text appears on open. Don't shorten the source text to fit the UI.
- Reviewers overstate. One claimed the corpus treats poison sumac as a mandatory
  lookalike everywhere on wet ground; it is named in three entries, which are the
  three where it is genuinely confusable. Check a claim about the corpus against
  the corpus.

## Provenance

`raw.json` original research → `to-verify.json` → per-species files in `drafts/` →
`corrected-pass1.json` / `corrected-batch1.json` → `approved.json` (source of truth)
→ `node scripts/build-foraging.mjs` → generated TS. `review/` and `confirm-batch*.json`
hold reviewer verdicts and blocking lists; `withheld.json` holds what did not pass.
