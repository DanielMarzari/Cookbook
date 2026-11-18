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
/**
 * Everything cookable, branches included.
 *
 * This listed bases only, which meant you could put "Ice Cream" on a menu but
 * not the rose cardamom one — and the branch is usually the thing you are
 * actually making. A variation's title already carries its base ("Sorbet —
 * Apple Cider"), so the list reads without any extra scaffolding.
 */
function recipeTitles() {
  try {
    return getDb()
      .prepare(
        `SELECT r.id,
                COALESCE(NULLIF(TRIM(r.menu_name), ''), r.title) AS title,
                r.title AS recipe_title,
                r.parent_recipe_id IS NOT NULL AS is_variation
           FROM recipes r
          ORDER BY COALESCE((SELECT b.title FROM recipes b WHERE b.id = r.parent_recipe_id), r.title),
                   r.parent_recipe_id IS NOT NULL,
                   r.title`,
      )
      .all() as { id: string; title: string; recipe_title: string; is_variation: number }[];
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
