import type { IngredientLine } from './variations';
import type { InstructionStep } from './types';

/**
 * Pushing an edit on a base recipe down into its branches.
 *
 * A branch stores its own full copy of the ingredients and the steps, not a
 * patch — which is what makes a variation readable on its own, and what makes
 * this harder than copying. Overwriting a branch with the base would throw away
 * the very thing that makes it a branch.
 *
 * So this is a three-way merge, the same shape git uses. For each line we have
 * the base BEFORE the edit, the base AFTER it, and what the branch currently
 * says. The rule is:
 *
 *   the branch still agrees with the old base  →  take the new base
 *   the branch had already diverged            →  leave it, and say so
 *
 * The second half matters more than the first. A cascade that silently
 * flattened a branch's own yeast ratio because the base's flour changed would
 * be worse than no cascade at all, so every skip is reported by name rather
 * than quietly dropped.
 */

const norm = (s: string | null | undefined) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Keyed by section AND name — a dough lists flour twice, and those are two lines. */
const keyOf = (i: IngredientLine) => `${norm(i.section)}|${norm(i.name)}`;

const sameAmount = (a: IngredientLine, b: IngredientLine) =>
  Math.abs((a.quantity || 0) - (b.quantity || 0)) < 1e-9 && norm(a.unit) === norm(b.unit);

export interface CascadeSkip {
  /** What the branch kept, in words, for the report. */
  line: string;
  reason: 'changed here' | 'removed here' | 'already different';
}

export interface IngredientMerge {
  ingredients: IngredientLine[];
  added: string[];
  updated: string[];
  removed: string[];
  skipped: CascadeSkip[];
}

/**
 * Merge one base edit into one branch's ingredient list.
 *
 * Returns the branch's new list plus an account of what happened, so the caller
 * can tell the cook "two branches took the change, the sourdough kept its own
 * water" rather than just "done".
 */
export function mergeIngredients(
  before: IngredientLine[],
  after: IngredientLine[],
  branch: IngredientLine[],
): IngredientMerge {
  const beforeBy = new Map(before.map((i) => [keyOf(i), i]));
  const afterBy = new Map(after.map((i) => [keyOf(i), i]));
  const branchBy = new Map(branch.map((i) => [keyOf(i), i]));

  const added: string[] = [];
  const updated: string[] = [];
  const removed: string[] = [];
  const skipped: CascadeSkip[] = [];

  // Work on a copy keyed the same way, then rebuild in a sensible order.
  const out = new Map(branchBy);

  for (const [k, a] of afterBy) {
    const b = beforeBy.get(k);
    const mine = out.get(k);

    if (!b) {
      // New line on the base. A branch that already has a line by that name has
      // its own idea about it — adding a second would duplicate it.
      if (!mine) {
        out.set(k, { ...a });
        added.push(a.name);
      } else if (!sameAmount(mine, a)) {
        skipped.push({ line: mine.name, reason: 'already different' });
      }
      continue;
    }

    if (sameAmount(b, a)) continue; // the base didn't touch this line

    if (!mine) continue; // the branch had already dropped it; adding it back is not a cascade
    if (sameAmount(mine, b)) {
      out.set(k, { ...mine, quantity: a.quantity, unit: a.unit });
      updated.push(a.name);
    } else {
      skipped.push({ line: mine.name, reason: 'changed here' });
    }
  }

  for (const [k, b] of beforeBy) {
    if (afterBy.has(k)) continue; // not removed
    const mine = out.get(k);
    if (!mine) continue;
    if (sameAmount(mine, b)) {
      out.delete(k);
      removed.push(mine.name);
    } else {
      skipped.push({ line: mine.name, reason: 'removed here' });
    }
  }

  // Keep the branch's own order and append anything new at the end. Sorting the
  // merged list into the base's order would shuffle a branch's list every time
  // the base was touched — the branch is its own document, and a cascade should
  // read as a line changing, not as the page being rewritten.
  const ordered: IngredientLine[] = [];
  const taken = new Set<string>();
  for (const m of branch) {
    const k = keyOf(m);
    const v = out.get(k);
    if (v && !taken.has(k)) {
      ordered.push(v);
      taken.add(k);
    }
  }
  for (const a of after) {
    const k = keyOf(a);
    const v = out.get(k);
    if (v && !taken.has(k)) {
      ordered.push(v);
      taken.add(k);
    }
  }

  return { ingredients: ordered, added, updated, removed, skipped };
}

const stepText = (s: InstructionStep) => norm(s.text);
const sameSteps = (a: InstructionStep[], b: InstructionStep[]) =>
  a.length === b.length && a.every((s, i) => stepText(s) === stepText(b[i]));

export interface InstructionMerge {
  instructions: InstructionStep[] | null;
  /** Null instructions means "left alone"; this says why. */
  note: string | null;
}

/**
 * Steps are all or nothing, deliberately.
 *
 * Ingredients are a list of keyed lines and merge cleanly. Prose does not: the
 * steps get reordered, split and rewritten, and a per-step text merge produces
 * sentences nobody wrote. So a branch takes the base's new method only when it
 * had not touched the old one, and otherwise keeps what it has and says so.
 */
export function mergeInstructions(
  before: InstructionStep[],
  after: InstructionStep[],
  branch: InstructionStep[],
): InstructionMerge {
  if (sameSteps(before, after)) return { instructions: null, note: null };
  if (sameSteps(branch, before)) {
    return { instructions: after.map((s, i) => ({ ...s, step_number: i + 1 })), note: null };
  }
  return { instructions: null, note: 'has its own method, so the steps were left alone' };
}

/** One branch's outcome, for the sentence the cook actually reads. */
export interface BranchReport {
  id: string;
  title: string;
  added: string[];
  updated: string[];
  removed: string[];
  skipped: CascadeSkip[];
  stepsUpdated: boolean;
  stepNote: string | null;
}

/** "Honey and semolina took it · sourdough kept its own water" */
export function describeCascade(reports: BranchReport[]): string {
  if (reports.length === 0) return 'Nothing to cascade — this recipe has no branches.';

  const touched = reports.filter(
    (r) => r.added.length || r.updated.length || r.removed.length || r.stepsUpdated,
  );
  const kept = reports.filter((r) => r.skipped.length || r.stepNote);

  // One clause per branch, so a branch that both took something and kept
  // something is named once rather than appearing twice in the same sentence.
  const parts: string[] = [];
  for (const r of reports) {
    const took = r.added.length || r.updated.length || r.removed.length || r.stepsUpdated;
    const lines = [...new Set(r.skipped.map((s) => s.line.toLowerCase()))];
    const clauses: string[] = [];
    if (took) clauses.push('took the change');
    if (lines.length) clauses.push(`kept its own ${lines.join(', ')}`);
    else if (r.stepNote) clauses.push(r.stepNote);
    if (clauses.length) parts.push(`${r.title} ${clauses.join(' but ')}`);
  }
  if (parts.length === 0) {
    return touched.length || kept.length ? 'Nothing needed changing.' : 'No branch needed the change.';
  }
  return parts.join(' · ');
}
