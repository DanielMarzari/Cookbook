import { NextRequest, NextResponse } from 'next/server';
import { deleteEvent, dishesFor, getEvent, guestsFor, updateEvent } from '@/lib/events/store';

export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event, dishes: dishesFor(id), guests: guestsFor(id) });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const event = updateEvent(id, body ?? {});
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ event });
}

export async function DELETE(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteEvent(id);
  return NextResponse.json({ ok: true });
}
