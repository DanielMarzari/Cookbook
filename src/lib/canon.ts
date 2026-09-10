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
 * Grow the tree as a trie over the chips themselves.
 *
 * Each dish becomes one path — its chips from every nested facet, in order —
 * and shared leading chips become shared branches. Doing it chip by chip rather
 * than cell by cell is what lets "poured flat" fork four dishes while "folded"
 * and "rolled in layers" stay separate beneath it; grouping on the whole cell
 * would see four different strings and flatten them.
 */
function pathOf(dish: CanonDish, facets: string[]): string[] {
  return facets.flatMap((f) => cell(dish, f));
}

interface Trie {
  label: string;
  dishes: CanonDish[];
  kids: Map<string, Trie>;
}

function grow(dishes: CanonDish[], facets: string[], depth: number): CanonNode[] {
  const root: Trie = { label: '', dishes: [], kids: new Map() };
  for (const d of dishes) {
    let at = root;
    for (const chip of pathOf(d, facets)) {
      if (!at.kids.has(chip)) at.kids.set(chip, { label: chip, dishes: [], kids: new Map() });
      at = at.kids.get(chip)!;
    }
    at.dishes.push(d);
  }

  const toNodes = (t: Trie, at: number): CanonNode[] => {
    const out: CanonNode[] = [];
    for (const kid of t.kids.values()) {
      const children = toNodes(kid, at + 1);
      const leaves = kid.dishes.map((d) => ({ label: d.name, dish: d, children: [], depth: at + 1 }));
      // A chip that leads to exactly one dish and nothing else is not a fork —
      // show the dish, not a branch with one thing on it.
      if (children.length === 0 && leaves.length === 1) {
        out.push({ ...leaves[0], depth: at });
        continue;
      }
      out.push({ label: kid.label, children: [...leaves, ...children], depth: at });
    }
    return out;
  };

  // Collapse a chain of single-child forks into one label, so a dish reached by
  // three chips nobody else shares doesn't sit under three empty levels.
  const collapse = (nodes: CanonNode[]): CanonNode[] =>
    nodes.map((n) => {
      let node = { ...n, children: collapse(n.children) };
      while (!node.dish && node.children.length === 1 && !node.children[0].dish) {
        const only = node.children[0];
        node = { ...only, label: `${node.label} · ${only.label}` };
      }
      if (!node.dish && node.children.length === 1 && node.children[0].dish) {
        const only = node.children[0];
        return { ...only, label: `${node.label} — ${only.label}` };
      }
      return node;
    });

  return collapse(toNodes(root, depth));
}

/**
 * Lineage, where the data says lineage rather than facets.
 *
 * An additive family branches by descent: every sauce is the base plus
 * something, and one of them is another sauce plus something. That relationship
 * lives in `parent` because no grouping of columns can find it.
 */
function byLineage(dishes: CanonDish[], depth = 0): CanonNode[] {
  const childrenOf = (name?: string) =>
    dishes.filter((d) => (d.parent ?? undefined) === name);
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
