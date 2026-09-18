import { NextRequest, NextResponse } from 'next/server';
import { createEvent, listEvents } from '@/lib/events/store';

export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const event = createEvent(body ?? {});
  return NextResponse.json({ event }, { status: 201 });
}
