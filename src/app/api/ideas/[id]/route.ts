import { NextRequest, NextResponse } from 'next/server';
import { deleteIdea, listIdeas, updateIdea } from '@/lib/ideas/store';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const idea = updateIdea(id, body ?? {});
  if (!idea) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ idea, ideas: listIdeas() });
}

export async function DELETE(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteIdea(id);
  return NextResponse.json({ ideas: listIdeas() });
}
