import 'server-only';
import { randomUUID } from 'node:crypto';
import { getDb } from '@/lib/db';
import type { BoardFills } from './types';

/** Server-side reads and writes for saved boards and the pantry.
 *  Mirrors the rest of Cookbook: plain better-sqlite3, no ORM. */

export interface Placement {
  itemId: string;
  cutIndex: number;
  x: number;
  y: number;
  scale: number;
  rot: number;
}

export interface SavedBoard {
  id: string;
  name: string;
  boardId: string;
  patternId: string;
  mode: 'zones' | 'freeform';
  guests: number;
  garnish: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
  /** Zone mode. */
  fills: BoardFills;
  /** Freeform mode, ordered back-to-front. */
  placements: Placement[];
}

interface BoardRow {
  id: string;
  name: string;
  board_id: string;
  pattern_id: string;
  mode: string;
  guests: number;
  garnish: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface ItemRow {
  board_id: string;
  zone_id: string | null;
  item_id: string;
  cut_index: number;
  x: number | null;
  y: number | null;
  scale: number | null;
  rot: number | null;
  z: number;
}

function hydrate(row: BoardRow, items: ItemRow[]): SavedBoard {
  const fills: BoardFills = {};
  const placements: Placement[] = [];
  for (const it of items) {
    if (it.zone_id) {
      fills[it.zone_id] = { itemId: it.item_id, cutIndex: it.cut_index };
    } else {
      placements.push({
        itemId: it.item_id,
        cutIndex: it.cut_index,
        x: it.x ?? 50,
        y: it.y ?? 50,
        scale: it.scale ?? 1,
        rot: it.rot ?? 0,
      });
    }
  }
  return {
    id: row.id,
    name: row.name,
    boardId: row.board_id,
    patternId: row.pattern_id,
    mode: row.mode === 'freeform' ? 'freeform' : 'zones',
    guests: row.guests,
    garnish: row.garnish === 1,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    fills,
    placements,
  };
}

export function listBoards(): SavedBoard[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM charcuterie_boards ORDER BY updated_at DESC')
    .all() as BoardRow[];
  if (rows.length === 0) return [];
  const items = db
    .prepare('SELECT * FROM charcuterie_board_items ORDER BY z')
    .all() as ItemRow[];
  const byBoard = new Map<string, ItemRow[]>();
  for (const it of items) {
    const list = byBoard.get(it.board_id);
    if (list) list.push(it);
    else byBoard.set(it.board_id, [it]);
  }
  return rows.map((r) => hydrate(r, byBoard.get(r.id) ?? []));
}

export function getBoard(id: string): SavedBoard | null {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM charcuterie_boards WHERE id = ?')
    .get(id) as BoardRow | undefined;
  if (!row) return null;
  const items = db
    .prepare('SELECT * FROM charcuterie_board_items WHERE board_id = ? ORDER BY z')
    .all(id) as ItemRow[];
  return hydrate(row, items);
}

export interface SaveBoardInput {
  id?: string;
  name: string;
  boardId: string;
  patternId: string;
  mode: 'zones' | 'freeform';
  guests?: number;
  garnish?: boolean;
  notes?: string;
  fills?: BoardFills;
  placements?: Placement[];
}

/** Insert or replace a board and all of its contents in one transaction. */
export function saveBoard(input: SaveBoardInput): SavedBoard {
  const db = getDb();
  const id = input.id ?? randomUUID();
  const now = new Date().toISOString();

  const write = db.transaction(() => {
    const exists = db
      .prepare('SELECT 1 FROM charcuterie_boards WHERE id = ?')
      .get(id);

    if (exists) {
      db.prepare(
        `UPDATE charcuterie_boards
         SET name = ?, board_id = ?, pattern_id = ?, mode = ?, guests = ?,
             garnish = ?, notes = ?, updated_at = ?
         WHERE id = ?`,
      ).run(
        input.name,
        input.boardId,
        input.patternId,
        input.mode,
        input.guests ?? 8,
        input.garnish ? 1 : 0,
        input.notes ?? '',
        now,
        id,
      );
    } else {
      db.prepare(
        `INSERT INTO charcuterie_boards
           (id, name, board_id, pattern_id, mode, guests, garnish, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        input.name,
        input.boardId,
        input.patternId,
        input.mode,
        input.guests ?? 8,
        input.garnish ? 1 : 0,
        input.notes ?? '',
        now,
        now,
      );
    }

    // Contents are replaced wholesale — simpler and safer than diffing, and
    // a board never has more than a few dozen rows.
    db.prepare('DELETE FROM charcuterie_board_items WHERE board_id = ?').run(id);
    const insert = db.prepare(
      `INSERT INTO charcuterie_board_items
         (board_id, zone_id, item_id, cut_index, x, y, scale, rot, z)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    if (input.mode === 'zones') {
      let z = 0;
      for (const [zoneId, fill] of Object.entries(input.fills ?? {})) {
        insert.run(id, zoneId, fill.itemId, fill.cutIndex, null, null, null, null, z++);
      }
    } else {
      let z = 0;
      for (const p of input.placements ?? []) {
        insert.run(id, null, p.itemId, p.cutIndex, p.x, p.y, p.scale, p.rot, z++);
      }
    }
  });

  write();
  return getBoard(id)!;
}

export function deleteBoard(id: string): boolean {
  const db = getDb();
  // ON DELETE CASCADE clears the items, and db.ts sets foreign_keys = ON.
  const info = db.prepare('DELETE FROM charcuterie_boards WHERE id = ?').run(id);
  return info.changes > 0;
}

// ─── Pantry ──────────────────────────────────────────────────────────────────

export function listPantry(): string[] {
  return (
    getDb()
      .prepare('SELECT item_id FROM charcuterie_pantry ORDER BY added_at')
      .all() as { item_id: string }[]
  ).map((r) => r.item_id);
}

export function setPantry(itemIds: string[]): string[] {
  const db = getDb();
  const write = db.transaction(() => {
    db.prepare('DELETE FROM charcuterie_pantry').run();
    const insert = db.prepare(
      'INSERT OR IGNORE INTO charcuterie_pantry (item_id) VALUES (?)',
    );
    for (const id of itemIds) insert.run(id);
  });
  write();
  return listPantry();
}
