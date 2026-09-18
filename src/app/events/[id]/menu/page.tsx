import { notFound } from 'next/navigation';
import MenuPrint from '@/components/events/MenuPrint';
import { dishesFor, getEvent } from '@/lib/events/store';
import { toCourses } from '@/lib/events/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  return { title: event ? `${event.title} · the menu` : 'Cookbook' };
}

export default async function MenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  return (
    <MenuPrint
      eventId={event.id}
      title={event.title}
      date={event.event_date}
      courses={toCourses(dishesFor(id))}
      initialStyle={event.style}
      initialStock={event.stock}
    />
  );
}
