import type { Canon, CanonDish } from '@/data/canon';

/**
 * Turning the authored table into a tree.
 *
 * Only the table is written by hand. The outline and the staircase are grown
 * from it here, by grouping on the facets in `nestBy` order — so a dish can't
 * appear at one depth in the diagram and another in the table, which is exactly
 * the mistake that made the first staircase lie.
 */

export interface CanonNode {
  /** The facet values that got you here, e.g. ["beaten", "poured flat"]. */
  label: string;
  /** Set when this node is a dish rather than a fork. */
  dish?: CanonDish;
  children: CanonNode[];
  depth: number;
}

const cell = (dish: CanonDish, facetId: string): string[] => dish.facets[facetId] ?? [];
const joinCell = (dish: CanonDish, facetId: string): string => cell(dish, facetId).join(' · ');

/**
 * Grow the tree by consuming chips only while they keep forking.
 *
 * A naive trie over every chip breaks on refinement. If each dish's second chip
 * in the first facet is unique to it — "glossy from the flour", "strained into
 * gravy" — the trie splits every dish into its own leaf at depth two and the
 * facets after it are never reached, so the decision the family is actually
 * about is drawn once and then not at all.
 *
 * So: at each position, look at what grouping by the next chip would do. If it
 * would break the group into singletons while dimensions remain unspent, that
 * chip is a refinement rather than a fork — leave it in the table, skip it in
 * the tree, and move to the next dimension. That keeps "poured flat · folded"
 * forking eggs, because there the second chip genuinely groups.
 */
function grow(dishes: CanonDish[], facets: string[], depth: number): CanonNode[] {
  const leaf = (d: CanonDish, at: number): CanonNode => ({ label: d.name, dish: d, children: [], depth: at });

  const at = (ds: CanonDish[], fi: number, ci: number, d: number): CanonNode[] => {
    if (ds.length === 0) return [];
    if (ds.length === 1) return [leaf(ds[0], d)];
    if (fi >= facets.length) return ds.map((x) => leaf(x, d));

    const chipAt = (x: CanonDish) => cell(x, facets[fi])[ci];
    // This dimension is spent for these dishes — move to the next one.
    if (ds.every((x) => chipAt(x) === undefined)) return at(ds, fi + 1, 0, d);

    const groups = new Map<string, CanonDish[]>();
    for (const x of ds) {
      const k = chipAt(x) ?? '';
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(x);
    }

    // Splits nothing: keep reading this dimension rather than drawing a fork
    // with one branch.
    if (groups.size === 1) {
      const label = [...groups.keys()][0];
      const below = at(ds, fi, ci + 1, d);
      if (!label) return below;
      return below.length === 1 && below[0].dish
        ? [{ ...below[0], label: `${label} — ${below[0].label}`, depth: d }]
        : [{ label, children: below, depth: d }];
    }

    // Splits into singletons while dimensions remain: refinement, not a fork.
    const everyoneAlone = [...groups.values()].every((g) => g.length === 1);
    const moreFacets = fi + 1 < facets.length;
    const moreChips = ds.some((x) => chipAt(x) !== undefined && cell(x, facets[fi])[ci + 1] !== undefined);
    if (everyoneAlone && moreFacets && !moreChips) return at(ds, fi + 1, 0, d);

    const out: CanonNode[] = [];
    for (const [label, members] of groups) {
      // Some dishes simply have nothing at this position. They are not a group
      // called "—" sitting beside their siblings; they belong at this level, so
      // splice them in rather than nesting them under an empty label.
      if (!label) {
        out.push(...at(members, fi, ci + 1, d));
        continue;
      }
      const below = at(members, fi, ci + 1, d + 1);
      if (below.length === 1 && below[0].dish) {
        out.push({ ...below[0], label: `${label} — ${below[0].label}`, depth: d });
      } else {
        out.push({ label, children: below, depth: d });
      }
    }
    return out;
  };

  return at(dishes, 0, 0, depth);
}

/**
 * Lineage, where the data says descent rather than facets.
 *
 * Vodka sauce IS rosa plus two things, and no grouping of columns finds that,
 * so it lives in `parent` and is read here.
 */
function byLineage(dishes: CanonDish[], depth = 0): CanonNode[] {
  const childrenOf = (name?: string) => dishes.filter((d) => (d.parent ?? undefined) === name);
  const build = (d: CanonDish, at: number): CanonNode => ({
    label: d.name,
    dish: d,
    depth: at,
    children: childrenOf(d.name).map((c) => build(c, at + 1)),
  });
  return childrenOf(undefined).map((d) => build(d, depth));
}

/** Marker for the reading that follows authored descent rather than facets. */
export const LINEAGE = '__lineage__';

/**
 * The readings available for a family.
 *
 * Lineage is offered alongside the facet nestings rather than replacing them.
 * Making one `parent` link switch the whole family to descent would cost a
 * family with fifteen siblings and one real child its other two readings, which
 * is a steep price for one true fact.
 */
export function nestingsFor(canon: Canon): { label: string; by: string[] }[] {
  const hasLineage = canon.dishes.some((d) => d.parent);
  return hasLineage ? [...canon.nestings, { label: 'By descent', by: [LINEAGE] }] : canon.nestings;
}

export function canonTree(canon: Canon, nesting = 0): CanonNode[] {
  const order = nestingsFor(canon)[nesting]?.by ?? canon.nestings[0].by;
  if (order[0] === LINEAGE) return byLineage(canon.dishes);
  // A dish with a parent is shown where its facets put it in the other
  // readings — descent is one way to look at the family, not the only one.
  return grow(canon.dishes, order, 0);
}

/**
 * Which chips are doing the distinguishing.
 *
 * A chip is "key" when it is not shared by every dish that matches this one on
 * all the earlier facets — that is, when it is the reason this row is a
 * different dish from its siblings rather than the same one. Derived rather
 * than authored, so it stays true when a dish is added.
 */
export function keyChips(canon: Canon, dish: CanonDish, facetId: string, nesting = 0): Set<string> {
  const order = canon.nestings[nesting]?.by ?? canon.nestings[0].by;
  const idx = order.indexOf(facetId);
  const earlier = idx === -1 ? order : order.slice(0, idx);

  const siblings = canon.dishes.filter((d) =>
    earlier.every((f) => joinCell(d, f) === joinCell(dish, f)),
  );
  if (siblings.length <= 1) return new Set();

  const key = new Set<string>();
  for (const chip of cell(dish, facetId)) {
    const shared = siblings.every((s) => cell(s, facetId).includes(chip));
    if (!shared) key.add(chip);
  }
  return key;
}

/** The vocabulary of one dimension, in first-seen order. */
export function facetVocabulary(canon: Canon, facetId: string): string[] {
  const seen: string[] = [];
  for (const d of canon.dishes) {
    for (const chip of cell(d, facetId)) if (!seen.includes(chip)) seen.push(chip);
  }
  return seen;
}

/** How deep the tree actually goes — the staircase uses it to stay honest. */
export function treeDepth(nodes: CanonNode[]): number {
  let max = 0;
  const walk = (ns: CanonNode[], d: number) => {
    for (const n of ns) {
      max = Math.max(max, d);
      walk(n.children, d + 1);
    }
  };
  walk(nodes, 1);
  return max;
}
