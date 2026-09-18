import { randomUUID } from 'crypto';
import { getDb } from '@/lib/db';

export type IdeaStatus = 'someday' | 'next' | 'made';

export interface Idea {
  id: string;
  title: string;
  note: string | null;
  recipe_id: string | null;
  source: string | null;
  tags: string[];
  status: IdeaStatus;
  position: number;
  made_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  /** Joined for display — the board shows it, nothing stores it. */
  recipe_title?: string | null;
}

type Row = Omit<Idea, 'tags'> & { tags: string | null };

function hydrate(r: Row): Idea {
  let tags: string[] = [];
  try {
    const v = r.tags ? JSON.parse(r.tags) : [];
    if (Array.isArray(v)) tags = v.filter((x): x is string => typeof x === 'string');
  } catch {
    tags = []; // a malformed row shouldn't take the board down
  }
  return { ...r, tags };
}

const STATUSES: IdeaStatus[] = ['someday', 'next', 'made'];
const clean = (s: unknown, max: number) => String(s ?? '').trim().slice(0, max);

export function listIdeas(): Idea[] {
  const rows = getDb()
    .prepare(
      `SELECT i.*, r.title AS recipe_title
         FROM ideas i
         LEFT JOIN recipes r ON r.id = i.recipe_id
        ORDER BY i.position, i.created_at`,
    )
    .all() as Row[];
  return rows.map(hydrate);
}

export function getIdea(id: string): Idea | undefined {
  const row = getDb()
    .prepare(`SELECT i.*, r.title AS recipe_title FROM ideas i
                LEFT JOIN recipes r ON r.id = i.recipe_id WHERE i.id = ?`)
    .get(id) as Row | undefined;
  return row ? hydrate(row) : undefined;
}

export interface IdeaInput {
  title?: string;
  note?: string | null;
  recipe_id?: string | null;
  source?: string | null;
  tags?: string[];
  status?: string;
}

/**
 * A card whose name is exactly one of your recipes should know it.
 *
 * Done here rather than in the board's input handler so it holds for every
 * caller — the client can still pass a recipe_id, but nothing depends on it
 * having bothered.
 */
function matchRecipe(title: string): string | null {
  try {
    const row = getDb()
      .prepare('SELECT id FROM recipes WHERE parent_recipe_id IS NULL AND LOWER(title) = LOWER(?) LIMIT 1')
      .get(title) as { id: string } | undefined;
    return row?.id ?? null;
  } catch {
    return null;
  }
}

export function createIdea(input: IdeaInput): Idea | undefined {
  const title = clean(input.title, 200);
  if (!title) return undefined;

  const db = getDb();
  const now = new Date().toISOString();
  const id = randomUUID();
  // New cards go on top of the pile — you just thought of it, so it is the
  // thing on your mind.
  const min = (db.prepare('SELECT MIN(position) AS p FROM ideas').get() as { p: number | null }).p;
  const position = (min ?? 0) - 1;

  db.prepare(
    `INSERT INTO ideas (id, title, note, recipe_id, source, tags, status, position, created_at, updated_at)
     VALUES (@id, @title, @note, @recipe_id, @source, @tags, @status, @position, @now, @now)`,
  ).run({
    id,
    title,
    note: input.note ? clean(input.note, 2000) : null,
    recipe_id: input.recipe_id || matchRecipe(title),
    source: input.source ? clean(input.source, 500) : null,
    tags: JSON.stringify((input.tags ?? []).map((t) => clean(t, 40)).filter(Boolean).slice(0, 12)),
    status: STATUSES.includes(input.status as IdeaStatus) ? input.status : 'someday',
    position,
    now,
  });
  return getIdea(id);
}

export function updateIdea(id: string, input: IdeaInput & { position?: number }): Idea | undefined {
  const existing = getIdea(id);
  if (!existing) return undefined;

  const sets: string[] = [];
  const params: Record<string, unknown> = { id, now: new Date().toISOString() };
  const put = (col: string, v: unknown) => {
    sets.push(`${col} = @${col}`);
    params[col] = v;
  };

  if (input.title !== undefined) {
    const t = clean(input.title, 200);
    if (t) put('title', t); // never let a card lose its name
  }
  if (input.note !== undefined) put('note', input.note ? clean(input.note, 2000) : null);
  if (input.recipe_id !== undefined) put('recipe_id', input.recipe_id || null);
  if (input.source !== undefined) put('source', input.source ? clean(input.source, 500) : null);
  if (input.tags !== undefined) {
    put('tags', JSON.stringify(input.tags.map((t) => clean(t, 40)).filter(Boolean).slice(0, 12)));
  }
  if (input.position !== undefined && Number.isFinite(input.position)) put('position', input.position);
  if (input.status !== undefined && STATUSES.includes(input.status as IdeaStatus)) {
    put('status', input.status);
    // Made is a date, not just a state — the board can say "you made this in
    // March" later, and un-making it should clear the claim.
    put('made_at', input.status === 'made' ? (existing.made_at ?? new Date().toISOString()) : null);
  }

  if (sets.length === 0) return existing;
  getDb().prepare(`UPDATE ideas SET ${sets.join(', ')}, updated_at = @now WHERE id = @id`).run(params);
  return getIdea(id);
}

export function deleteIdea(id: string): void {
  getDb().prepare('DELETE FROM ideas WHERE id = ?').run(id);
}
