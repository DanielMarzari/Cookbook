import { deleteBoard, getBoard } from '@/lib/charcuterie/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const board = getBoard(id);
  if (!board) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ board });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!deleteBoard(id)) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json({ ok: true });
}
