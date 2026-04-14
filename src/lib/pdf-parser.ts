/**
 * PDF recipe parser.
 *
 * Handles structured recipe PDFs where each recipe page contains a
 * "Cook Time / Yields / Difficulty" metadata block and numbered instruction
 * steps. Tested against Ooni-style cookbook PDFs; falls back gracefully on
 * less structured layouts (returns fewer/zero candidates, caller decides).
 *
 * Pure functions — no Next/Node-specific imports other than pdf-parse.
 */

// pdfjs-dist (pdf-parse's engine) references DOM globals (DOMMatrix, ImageData,
// Path2D) that Node 24 doesn't ship. For text extraction we never touch canvas,
// so stubbing them as empty no-ops is enough to stop the "DOMMatrix is not
// defined" crash on the Oracle box. (Locally pdf-parse happened to work without
// this — Turbopack dev mode differs from the standalone prod build.)
const g = globalThis as unknown as Record<string, unknown>;
if (typeof g.DOMMatrix === 'undefined') g.DOMMatrix = class { constructor() {} } as unknown;
if (typeof g.ImageData === 'undefined') g.ImageData = class { constructor() {} } as unknown;
if (typeof g.Path2D === 'undefined') g.Path2D = class { constructor() {} } as unknown;

import { PDFParse } from 'pdf-parse';

export interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface ParsedInstruction {
  step_number: number;
  text: string;
  timer_label?: string;
}

export interface RecipeCandidate {
  id: string;                     // stable id (page number) for React keys
  title: string;
  subtitle?: string;
  page: number;                   // 1-indexed page the recipe starts on
  parsed: {
    ingredients: ParsedIngredient[];
    instructions: ParsedInstruction[];
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    total_time_minutes?: number;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    cuisine_type?: string;
  };
  raw_text: string;               // full text block (for fallback / debugging)
}

/** Main entry point — buffer → candidates. */
export async function extractRecipeCandidates(buffer: Buffer): Promise<RecipeCandidate[]> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  const pages: { num: number; text: string }[] = (result.pages || []).map((p: { num: number; text?: string }) => ({
    num: p.num,
    text: p.text || '',
  }));

  // Identify recipe start pages (have all three marker words).
  const isRecipePage = (t: string) =>
    /Cook Time/i.test(t) && /Yields/i.test(t) && /Difficulty/i.test(t);

  // Group pages into recipes: start pages own themselves plus any following
  // non-start pages until the next start page.
  const groups: { startPage: number; texts: string[] }[] = [];
  let current: { startPage: number; texts: string[] } | null = null;
  for (const p of pages) {
    if (isRecipePage(p.text)) {
      if (current) groups.push(current);
      current = { startPage: p.num, texts: [p.text] };
    } else if (current && p.text.trim().length > 0) {
      // Append continuation pages (e.g. a recipe whose steps overflow).
      current.texts.push(p.text);
    }
  }
  if (current) groups.push(current);

  return groups.map((g) => parseRecipeBlock(g.startPage, g.texts.join('\n')));
}

/** Parse a single recipe text block. Exported for tests / fallback usage. */
export function parseRecipeBlock(startPage: number, rawText: string): RecipeCandidate {
  const lines = rawText.split('\n').map((l) => l.trim());

  // Locate the "Cook Time" anchor line.
  const cookTimeIdx = lines.findIndex((l) => /^Cook Time$/i.test(l));
  const yieldsIdx = lines.findIndex((l, i) => i > cookTimeIdx && /^Yields$/i.test(l));
  const difficultyIdx = lines.findIndex((l, i) => i > yieldsIdx && /^Difficulty$/i.test(l));

  // ---- title: the 1–3 title-looking lines immediately before "Cook Time".
  // A "title line" starts with a capital letter or digit and has at least one
  // capitalized word; ingredient continuations ("plus extra for dusting",
  // "or bread flour") get filtered out.
  const titleLines: string[] = [];
  for (let i = cookTimeIdx - 1; i >= 0 && titleLines.length < 3; i--) {
    const line = lines[i];
    if (line === '') { if (titleLines.length > 0) break; continue; }
    if (looksLikeIngredient(line)) break;
    if (!looksLikeTitle(line)) { if (titleLines.length > 0) break; continue; }
    titleLines.unshift(line);
  }
  const title = titleLines.join(' ').trim() || `Recipe (page ${startPage})`;
  const subtitle = undefined;

  // ---- metadata values follow the anchor labels.
  const cookTimeRaw = cookTimeIdx >= 0 ? lines[cookTimeIdx + 1] || '' : '';
  const yieldsRaw = yieldsIdx >= 0 ? lines[yieldsIdx + 1] || '' : '';
  const difficultyRaw = difficultyIdx >= 0 ? lines[difficultyIdx + 1] || '' : '';

  const cook_time_minutes = parseTimeToMinutes(cookTimeRaw);
  const servings = parseServings(yieldsRaw);
  const difficulty = parseDifficulty(difficultyRaw);

  // ---- ingredients: lines before the title block.
  const firstTitleIdx = titleLines.length > 0
    ? lines.indexOf(titleLines[0])
    : cookTimeIdx;
  const ingredientLines = lines.slice(0, Math.max(0, firstTitleIdx));
  const ingredients = parseIngredientLines(ingredientLines);

  // ---- instructions: collect numbered steps from anywhere in the block.
  // (Some recipes put "Difficulty: <value>" after the steps, not before.)
  const instructions = parseInstructionLines(lines);

  return {
    id: `page-${startPage}`,
    title,
    subtitle,
    page: startPage,
    parsed: {
      ingredients,
      instructions,
      cook_time_minutes,
      servings,
      difficulty,
    },
    raw_text: rawText,
  };
}

// ---------- parsers for individual blocks ----------

const UNIT_WORDS = [
  'g', 'kg', 'mg', 'oz', 'lb', 'lbs', 'pound', 'pounds', 'ounce', 'ounces',
  'ml', 'l', 'cl', 'tsp', 'tbsp', 'teaspoon', 'teaspoons', 'tablespoon', 'tablespoons',
  'cup', 'cups', 'pinch', 'handful', 'clove', 'cloves', 'can', 'cans',
];
// An ingredient line must have a quantity AND either a unit word OR descriptive
// text following (e.g. "3 Garlic cloves"). A bare "100%" is not an ingredient.
const UNIT_RE = new RegExp(
  `^(\\d+(?:[.,/]\\d+)?|\\d+[½¼¾]|[½¼¾]|-)\\s*(?:(${UNIT_WORDS.join('|')})\\b|[a-zA-Z"\\u2018-\\u201f][^%]*$)`,
  'i',
);

function looksLikeIngredient(line: string): boolean {
  return UNIT_RE.test(line.trim());
}

// Lowercase first-words that indicate ingredient-continuation lines, not titles.
// "The", "A", "An" are deliberately omitted — they can legitimately start titles.
const TITLE_STOPWORDS = [
  'plus', 'or', 'for', 'cut', 'to', 'from', 'with', 'this', 'nice',
  'but', 'we', 'and', 'in', 'at', 'by', 'of',
  'roughly', 'finely', 'chopped', 'grated', 'torn', 'sliced', 'diced',
  'room', 'optional', 'using', 'leave', 'use', 'hydration', 'as',
];

function looksLikeTitle(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Skip metadata labels and "Difficulty: Easy"-style values.
  if (/^(cook time|yields|difficulty|easy|medium|hard)$/i.test(trimmed)) return false;
  if (looksLikeIngredient(trimmed)) return false;
  // First word shouldn't be a known continuation/prepositional word.
  const firstWord = trimmed.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
  if (TITLE_STOPWORDS.includes(firstWord)) return false;
  // Must start with a capital letter, digit (e.g. "100%"), quote, or "&" (e.g.
  // "& Cranberry Pizza" as the second title line).
  if (!/^[A-Z0-9"'&"']/.test(trimmed)) return false;
  return true;
}

function parseIngredientLines(lines: string[]): ParsedIngredient[] {
  const out: ParsedIngredient[] = [];
  let pendingHeader: string | null = null;
  let pendingNote: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { pendingNote = null; continue; }

    // Section header like "For the levain" / "For the final mix"
    if (/^for the /i.test(line)) {
      pendingHeader = line;
      if (out.length > 0 || pendingHeader) {
        out.push({ name: `--- ${line.replace(/^for the\s*/i, '').trim()} ---`, quantity: 0, unit: '' });
      }
      continue;
    }

    const m = line.match(/^([\d.,/½¼¾-]+)\s*(?:(tbsp|tsp|g|kg|mg|ml|l|oz|lb|lbs|cup|cups|pound|pounds|ounce|ounces|pinch|handful|clove|cloves|can|cans|teaspoon|teaspoons|tablespoon|tablespoons))?\s+(.+)$/i);
    if (m) {
      const qty = parseQty(m[1]);
      const unit = (m[2] || '').toLowerCase();
      const rest = m[3].trim();
      out.push({
        name: rest,
        quantity: qty,
        unit: unit || '',
      });
      pendingNote = null;
      continue;
    }

    // Unit-less line that starts with a dash/"Pinch"/etc — treat as ingredient with no quantity
    if (/^(pinch|handful|dash|splash)\b/i.test(line)) {
      out.push({ name: line.replace(/^(pinch|handful|dash|splash)\s+(of\s+)?/i, ''), quantity: 0, unit: 'pinch' });
      continue;
    }

    // Continuation/note line — attach to previous ingredient's notes.
    if (out.length > 0) {
      const last = out[out.length - 1];
      last.notes = last.notes ? `${last.notes}; ${line}` : line;
    }
  }

  return out;
}

function parseInstructionLines(lines: string[]): ParsedInstruction[] {
  const out: ParsedInstruction[] = [];
  let current: ParsedInstruction | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const m = line.match(/^(\d+)\s*\.\s*(.*)$/);
    if (m) {
      if (current) out.push(current);
      current = {
        step_number: parseInt(m[1], 10),
        text: m[2].trim(),
      };
    } else if (current) {
      current.text += current.text ? ' ' + line : line;
    }
  }
  if (current) out.push(current);

  // Renumber to be contiguous starting at 1 (continuation pages may reuse numbers).
  return out.map((inst, i) => ({ ...inst, step_number: i + 1 }));
}

// ---------- value coercions ----------

function parseQty(s: string): number {
  const trimmed = s.replace(/,/g, '.').trim();
  if (trimmed === '-') return 0;
  const fractions: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75 };
  if (fractions[trimmed]) return fractions[trimmed];
  const mixed = trimmed.match(/^(\d+)([½¼¾])$/);
  if (mixed) return parseInt(mixed[1], 10) + fractions[mixed[2]];
  const frac = trimmed.match(/^(\d+)\/(\d+)$/);
  if (frac) return parseInt(frac[1], 10) / parseInt(frac[2], 10);
  const n = parseFloat(trimmed);
  return isNaN(n) ? 0 : n;
}

function parseTimeToMinutes(s: string): number | undefined {
  if (!s) return undefined;
  const lower = s.toLowerCase();
  // "60 seconds" / "30 minutes" / "1 hour" / "1 hr 30 min"
  let total = 0;
  const hr = lower.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h)\b/);
  if (hr) total += parseFloat(hr[1]) * 60;
  const min = lower.match(/(\d+(?:\.\d+)?)\s*(minutes?|mins?|m)\b/);
  if (min) total += parseFloat(min[1]);
  const sec = lower.match(/(\d+(?:\.\d+)?)\s*(seconds?|secs?|s)\b/);
  if (sec) total += parseFloat(sec[1]) / 60;
  return total > 0 ? Math.round(total) : undefined;
}

function parseServings(s: string): number | undefined {
  if (!s) return undefined;
  // "4x 12\" pizzas" / "Serves 4" / "4 people"
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : undefined;
}

function parseDifficulty(s: string): 'easy' | 'medium' | 'hard' | undefined {
  const lower = (s || '').toLowerCase();
  if (lower.includes('easy')) return 'easy';
  if (lower.includes('medium')) return 'medium';
  if (lower.includes('hard')) return 'hard';
  return undefined;
}
