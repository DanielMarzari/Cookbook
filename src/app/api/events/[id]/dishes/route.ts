import { NextRequest, NextResponse } from 'next/server';
import { getEvent, setDishes } from '@/lib/events/store';

/** The whole menu at once — see setDishes for why this isn't a diff. */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEvent(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  const dishes = Array.isArray(body?.dishes) ? body.dishes : [];
  return NextResponse.json({ dishes: setDishes(id, dishes) });
}
