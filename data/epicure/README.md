# Epicure ingredient embeddings

Downloaded 2026-08-01 for the Flavor Lab. **Not wired into the app yet** — parked
here pending the decision on adopting them (see below).

| file | what it is |
| --- | --- |
| `vocab.csv` | 1,790 canonical ingredient names + per-model node ids |
| `epicure_cooc.csv` | 1,790 x 300 embedding, recipe-co-occurrence walks (maps onto our **Harmony** axis) |
| `UPSTREAM_README.md` | the authors' own notes, shipped with the artifact |

**Source:** Radzikowski & Chen (KAIKAKU.AI), *Epicure: Navigating the Emergent
Geometry of Food Ingredient Embeddings*, [arXiv:2605.22391](https://arxiv.org/abs/2605.22391),
arXiv ancillary files. Trained on 4.14M recipes across 11 sources / 7 languages.
**Licence: CC BY 4.0** — attribution required if we ship anything derived from it.
A sibling model `epicure_chem.csv` (compound-mediated, maps onto **Affinity**) is
available from the same source if we want it.

## Why it's here

It fixes two known weaknesses: absent-pair scoring (today's structural fallback
rates fish+chocolate as plausible) and thin non-Western coverage (the vocabulary
has garam_masala, gochujang, dashi, mirin, harissa, kimchi, the dal family).

## Gotchas before using it

- Vectors are **not L2-normalised** (norms ~1.63) — normalise before cosine.
- Cosine encodes **typicality, not quality**. A low cosine is not evidence of a
  bad pairing, so it must only ever *raise* a score, never penalise — otherwise it
  re-flattens exactly the daring pairings we protect (corn + white chocolate,
  miso caramel).
- It must be **calibrated against the pairs we already have real NPMI for**, or an
  estimate will outrank real evidence and quietly invert what `provenPct` means.
- Only ~384 of our 945 `note_ingredients` match by naive normalisation, so an
  alias/fuzzy pass is required. The authors' raw-string alias map is **not**
  released, so that work is ours.
