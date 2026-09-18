import Link from 'next/link';
import { listEvents } from '@/lib/events/store';
import { formatDateLong } from '@/lib/events/format';
import NewEventButton from '@/components/events/NewEventButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dinners · Cookbook' };

export default function EventsPage() {
  const events = listEvents();

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-14 flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal m-0">Dinners</h1>
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-text-secondary mt-3 mb-0">
            An invitation is a link. Send it, and the answers come back where the menu is checked
            against them — so the dietary problem surfaces while there is still time to shop.
          </p>
        </div>
        <NewEventButton />
      </div>

      {events.length === 0 ? (
        <p className="text-[14px] text-text-secondary mt-12">Nothing planned. Start one.</p>
      ) : (
        <div className="mt-10 flex flex-col">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="grid grid-cols-[1fr_auto] gap-4 items-baseline py-4 border-b border-border group"
            >
              <div>
                <span className="text-[17px] group-hover:underline underline-offset-4">{e.title}</span>
                <span className="block text-[12.5px] text-text-secondary mt-1">
                  {formatDateLong(e.event_date)}
                  {e.location ? ` · ${e.location}` : ''}
                </span>
              </div>
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary">
                {e.status === 'open' ? 'link live' : e.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
