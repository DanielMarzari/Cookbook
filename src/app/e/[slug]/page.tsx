import { notFound } from 'next/navigation';
import InviteFlow from '@/components/events/InviteFlow';
import { dishesFor, getEventBySlug, guestsFor } from '@/lib/events/store';
import { formatDateLong } from '@/lib/events/format';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event || event.status !== 'open') return { title: 'Invitation' };
  return {
    title: `${event.title} · ${formatDateLong(event.event_date)}`,
    description: event.expect ?? undefined,
    // An invitation is a link people forward. It is also not something to hand
    // to a search engine.
    robots: { index: false, follow: false },
  };
}

/**
 * The guest's page. Outside the site password — see src/proxy.ts.
 *
 * Read straight from the database rather than through the public API: this is a
 * server component on the same box, and the API exists for the browser's
 * writes. The guest list is deliberately not passed down; only a count.
 */
export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event || event.status !== 'open') notFound();

  const coming = guestsFor(event.id).filter((g) => g.rsvp === 'yes');

  return (
    <InviteFlow
      slug={slug}
      event={{
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
      }}
      dishes={dishesFor(event.id)}
      comingCount={coming.reduce((n, g) => n + 1 + g.plus_ones, 0)}
    />
  );
}
