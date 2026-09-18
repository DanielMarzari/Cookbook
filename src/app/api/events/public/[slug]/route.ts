import { NextRequest, NextResponse } from 'next/server';
import { dishesFor, getEventBySlug, guestsFor, upsertGuest } from '@/lib/events/store';
import type { DinnerEvent } from '@/lib/events/types';

/**
 * The guest's API. This is the only part of the site outside the password, so
 * it is deliberately the narrowest thing that works.
 *
 * It can do exactly two things: read one open event by its unguessable slug,
 * and write one reply to it. It never takes an event id, so it cannot be walked
 * from one dinner to the next, and it never returns the guest list — what
 * somebody else can't eat is their business, not the business of everyone else
 * holding the link. The host's own views read the full rows through the
 * authenticated routes.
 */

/** The subset a stranger with the link is allowed to see. */
function publicView(event: DinnerEvent) {
  return {
    title: event.title,
    host: event.host,
    event_date: event.event_date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    directions: event.directions,
    expect: event.expect,
    dress: event.dress,
    bring: event.bring,
    style: event.style,
    stock: event.stock,
  };
}

export async function GET(_r: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  // A draft is not yet an invitation and a closed one is over. Both answer 404
  // rather than "exists but not for you", which would confirm the slug.
  if (!event || event.status !== 'open') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const coming = guestsFor(event.id).filter((g) => g.rsvp === 'yes');
  return NextResponse.json({
    event: publicView(event),
    dishes: dishesFor(event.id),
    // A count, not a list: nice to know the table is filling up, and it names
    // nobody and reveals nothing about what anyone eats.
    comingCount: coming.reduce((n, g) => n + 1 + g.plus_ones, 0),
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event || event.status !== 'open') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const guest = upsertGuest(event.id, {
    name: String(body?.name ?? ''),
    rsvp: body?.rsvp === 'yes' || body?.rsvp === 'no' ? body.rsvp : null,
    plus_ones: Number(body?.plus_ones ?? 0),
    avoids: Array.isArray(body?.avoids) ? body.avoids : [],
    note: body?.note ?? null,
  });

  if (!guest) return NextResponse.json({ error: 'A name is required' }, { status: 400 });

  // Echo back only their own row. They can see what they said; they cannot see
  // what anyone else did.
  return NextResponse.json({ guest });
}
