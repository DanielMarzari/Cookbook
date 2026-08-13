import { listBoards, saveBoard, type SaveBoardInput } from '@/lib/charcuterie/store';

// Saved charcuterie boards.
//   GET   -> every saved board, newest first
//   POST  -> insert or update one (pass `id` to update)
export async function GET() {
  try {
    return Response.json({ boards: listBoards() });
  } catch (error) {
    console.error('charcuterie/boards GET', error);
    return Response.json({ error: 'Failed to load boards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SaveBoardInput>;
    const name = (body.name || '').trim();
    if (!name) {
      return Response.json({ error: 'A board needs a name' }, { status: 400 });
    }
    if (!body.boardId || !body.patternId) {
      return Response.json(
        { error: 'boardId and patternId are required' },
        { status: 400 },
      );
    }
    const board = saveBoard({
      id: body.id,
      name,
      boardId: body.boardId,
      patternId: body.patternId,
      mode: body.mode === 'freeform' ? 'freeform' : 'zones',
      guests: body.guests,
      garnish: body.garnish,
      notes: body.notes,
      fills: body.fills,
      placements: body.placements,
    });
    return Response.json({ board });
  } catch (error) {
    console.error('charcuterie/boards POST', error);
    return Response.json({ error: 'Failed to save board' }, { status: 500 });
  }
}
