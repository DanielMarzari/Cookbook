import { NextRequest, NextResponse } from 'next/server';
import { deleteGuest, getEvent, guestsFor, upsertGuest } from '@/lib/events/store';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEvent(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const guest = upsertGuest(id, body ?? {});
  if (!guest) return NextResponse.json({ error: 'A name is required' }, { status: 400 });
  return NextResponse.json({ guest, guests: guestsFor(id) });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guestId = new URL(request.url).searchParams.get('guest');
  if (!guestId) return NextResponse.json({ error: 'Which guest?' }, { status: 400 });
  deleteGuest(id, guestId);
  return NextResponse.json({ guests: guestsFor(id) });
}
