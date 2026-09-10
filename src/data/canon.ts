/**
 * What a dish is, as a small set of decisions.
 *
 * A recipe tells you how to make one thing. This answers the prior question:
 * which decisions actually separate this dish from its neighbours, and which
 * are yours to change. Twelve egg dishes come out of one egg and a pan — what
 * differs is the state it is in when it meets heat, and where you stop.
 *
 * The authored form is a table: named dimensions across the top, one row per
 * dish. The tree views are DERIVED from it (see lib/canon.ts) by nesting on the
 * dimensions in order, so the table and the outline can never disagree — there
 * is only one place to be wrong.
 */

import { CANON_FAMILIES } from './canon-families';

export interface Facet {
  id: string;
  /** Column heading, and the label the tree uses when it forks here. */
  label: string;
}

export interface CanonDish {
  name: string;
  /**
   * Name of the dish this one descends from.
   *
   * Only for families where lineage is real rather than derivable — vodka sauce
   * IS rosa plus two things, and no arrangement of facet columns can discover
   * that. Where it is absent the tree is grown from the facets instead.
   */
  parent?: string;
  /** facet id -> the chips in that cell. Several chips means several moves. */
  facets: Record<string, string[]>;
  /** A line of why, shown when this dish is the one you're looking at. */
  note?: string;
}

export interface Canon {
  slug: string;
  name: string;
  standfirst: string;
  /** What every dish here starts from. */
  root: string;
  facets: Facet[];
  /**
   * The ways this family can be read as a tree.
   *
   * More than one order is often defensible — filled doughs group by how they
   * are cooked, and equally by where they come from, and neither reading is the
   * true one. The first is the default; the rest are offered as a switch.
   */
  nestings: { label: string; by: string[] }[];
  dishes: CanonDish[];
  notes: { title: string; body: string }[];
  sources: { label: string; url: string }[];
  /** Title fragments matching your own recipes. */
  yours?: string[];
}

export const CANON: Canon[] = CANON_FAMILIES;

export function getCanon(slug: string): Canon | undefined {
  return CANON.find((c) => c.slug === slug);
}
