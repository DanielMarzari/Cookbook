import { notFound } from 'next/navigation';
import EventEditor from '@/components/events/EventEditor';
import { dishesFor, getEvent, guestsFor } from '@/lib/events/store';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  return { title: event ? `${event.title} · Dinners · Cookbook` : 'Cookbook' };
}

/** Titles for the dish autocomplete — a dish is usually one of your recipes. */
function recipeTitles() {
  try {
    return getDb()
      .prepare('SELECT id, title FROM recipes WHERE parent_recipe_id IS NULL ORDER BY title')
      .all() as { id: string; title: string }[];
  } catch {
    return [];
  }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  return (
    <EventEditor
      event={event}
      dishes={dishesFor(id)}
      guests={guestsFor(id)}
      recipes={recipeTitles()}
    />
  );
}
