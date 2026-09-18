import { NextRequest, NextResponse } from 'next/server';
import { createIdea, listIdeas } from '@/lib/ideas/store';
import { getDb } from '@/lib/db';

/** Titles for the board's autocomplete — typing one links the card to it. */
function recipeTitles() {
  try {
    return getDb()
      .prepare('SELECT id, title FROM recipes WHERE parent_recipe_id IS NULL ORDER BY title')
      .all() as { id: string; title: string }[];
  } catch {
    return [];
  }
}

export async function GET() {
  // Both in one response: the board needs the titles to render its datalist, and
  // a second round trip for a list this small is just latency.
  return NextResponse.json({ ideas: listIdeas(), recipes: recipeTitles() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const idea = createIdea(body ?? {});
  if (!idea) return NextResponse.json({ error: 'It needs a name, even a bad one.' }, { status: 400 });
  return NextResponse.json({ idea, ideas: listIdeas() }, { status: 201 });
}
