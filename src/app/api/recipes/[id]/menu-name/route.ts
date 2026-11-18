import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { suggestMenuNames } from '@/lib/menu-name';
import type { InstructionStep } from '@/lib/types';

/**
 * Menu-name suggestions for one recipe.
 *
 * Server-side because the suggestions are drawn from the recipe's steps and
 * ingredients, and the edit page would otherwise have to ship both to the
 * browser just to read a few words out of them.
 */
export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const row = db
      .prepare(
        `SELECT title, cuisine_type, origin, source_name, source_author,
                total_time_minutes, instructions
           FROM recipes WHERE id = ?`,
      )
      .get(id) as
      | {
          title: string; cuisine_type: string | null; origin: string | null;
          source_name: string | null; source_author: string | null;
          total_time_minutes: number | null; instructions: string | null;
        }
      | undefined;
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let steps: InstructionStep[] = [];
    try { steps = row.instructions ? JSON.parse(row.instructions) : []; } catch { steps = []; }

    const ings = db
      .prepare(`SELECT name FROM recipe_ingredients WHERE recipe_id = ? AND name <> '---OR---' ORDER BY order_index`)
      .all(id) as { name: string }[];

    return NextResponse.json({
      suggestions: suggestMenuNames({
        title: row.title,
        cuisine: row.cuisine_type,
        origin: row.origin,
        sourceName: row.source_name,
        sourceAuthor: row.source_author,
        instructions: steps.map((s) => s.text || ''),
        ingredients: ings.map((i) => i.name),
        totalMinutes: row.total_time_minutes,
      }),
    });
  } catch (error) {
    console.error('Error suggesting menu names:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
