'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Search } from 'lucide-react';
import InstagramEmbed from '@/components/InstagramEmbed';
import CaptionImport from '@/components/CaptionImport';
import {
  INSPIRATION_POSTS,
  SAVED_COLLECTION_URL,
  accountsByWeight,
  type InspirationPost,
} from '@/data/inspiration';

// Reveal the wall a screenful at a time; 142 embeds at once is a lot of iframes.
// Divisible by every column count, so a batch never lands lopsided.
const PAGE = 18;
// Accounts saved this many times get a shortcut chip.
const REGULARS_AT = 2;
// How far each column after the first is dropped, to set the stagger going from
// the very first row instead of waiting for the captions to make it themselves.
const COLUMN_OFFSET = 34;

/* Cards are dealt across the columns in order — card 0 to the first column,
   card 1 to the second — rather than packed into whichever column is shortest.
   Reading order survives (the newest saves stay along the top), and, more to the
   point, a card never jumps columns when its embed finally reports a height. */
function useColumnCount() {
  const subscribe = useCallback((onChange: () => void) => {
    const queries = [
      window.matchMedia('(min-width: 640px)'),
      window.matchMedia('(min-width: 1024px)'),
    ];
    queries.forEach((q) => q.addEventListener('change', onChange));
    return () => queries.forEach((q) => q.removeEventListener('change', onChange));
  }, []);

  const read = () =>
    window.matchMedia('(min-width: 1024px)').matches
      ? 3
      : window.matchMedia('(min-width: 640px)').matches
        ? 2
        : 1;

  // The server has no viewport; the widest layout is the safest first paint.
  return useSyncExternalStore(subscribe, read, () => 3);
}

export default function InspirationPage() {
  const [query, setQuery] = useState('');
  const [account, setAccount] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const [importing, setImporting] = useState<InspirationPost | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  const accounts = useMemo(() => accountsByWeight(INSPIRATION_POSTS), []);
  const regulars = useMemo(
    () => accounts.filter((a) => a.count >= REGULARS_AT),
    [accounts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INSPIRATION_POSTS.filter((p) => {
      if (account && p.user !== account) return false;
      if (q && !p.user.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, account]);

  // Any change to the filter starts the reveal over. Adjusted during render
  // rather than in an effect, so the grid never paints the old page length.
  const filterKey = `${account ?? ''}|${query.trim().toLowerCase()}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey);
    setShown(PAGE);
  }

  // Extend the grid as the bottom comes into view.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown((n) => Math.min(n + PAGE, filtered.length));
        }
      },
      { rootMargin: '600px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const visible = filtered.slice(0, shown);
  const columnCount = useColumnCount();
  const columns = useMemo(() => {
    const cols: (typeof visible)[] = Array.from({ length: columnCount }, () => []);
    visible.forEach((post, i) => cols[i % columnCount].push(post));
    return cols;
  }, [visible, columnCount]);
  const reels = useMemo(
    () => INSPIRATION_POSTS.filter((p) => p.kind === 'reel').length,
    []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      {/* Page heading */}
      <div className="pt-10 md:pt-16 pb-7">
        <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-text mb-4">
          Inspiration
        </h1>
        <p className="text-[15px] text-text-secondary max-w-xl mb-8">
          {INSPIRATION_POSTS.length} things worth cooking, saved to the{' '}
          <a
            href={SAVED_COLLECTION_URL}
            target="_blank"
            rel="noreferrer"
            className="text-text underline underline-offset-4 decoration-1"
          >
            Food collection
          </a>{' '}
          on Instagram — {reels} reels and {INSPIRATION_POSTS.length - reels} posts,
          from {accounts.length} kitchens.
        </p>

        {/* Search by handle */}
        <div className="relative max-w-md mb-5">
          <Search
            className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary"
            size={16}
            strokeWidth={1.8}
          />
          <input
            type="text"
            placeholder="Search accounts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-2 bg-transparent border-0 border-b border-border focus:border-text text-[15px] placeholder:text-text-secondary transition-colors"
          />
        </div>

        {/* The accounts saved more than once, as underlined text links */}
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-sm">
          <button
            onClick={() => setAccount(null)}
            className={`lowercase underline-offset-4 decoration-1 cursor-pointer ${
              !account ? 'text-text underline' : 'text-text-secondary hover:text-text hover:underline'
            }`}
          >
            All
          </button>
          {regulars.map(({ user, count }) => (
            <button
              key={user}
              onClick={() => setAccount(account === user ? null : user)}
              className={`underline-offset-4 decoration-1 cursor-pointer ${
                account === user
                  ? 'text-text underline'
                  : 'text-text-secondary hover:text-text hover:underline'
              }`}
            >
              {user}
              <span className="ml-1.5 text-[11px] text-text-secondary">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-text-secondary text-sm">
            Nothing saved from an account by that name.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-3 border-b border-text pb-2.5 mb-6">
            <h2 className="text-[13px] uppercase tracking-[0.14em] text-text">
              {account ? account : 'Saved'}
            </h2>
            <span className="text-[12px] text-text-secondary">{filtered.length}</span>
          </div>

          <div className="flex items-start gap-6 md:gap-8 pb-8">
            {columns.map((column, i) => (
              <div
                key={i}
                className="flex-1 min-w-0 flex flex-col gap-6 md:gap-8"
                style={{ marginTop: i * COLUMN_OFFSET }}
              >
                {column.map((post) => (
                  <InstagramEmbed key={post.code} post={post} onImport={setImporting} />
                ))}
              </div>
            ))}
          </div>

          {/* Loads the next batch as it comes into view */}
          <div ref={sentinel} className="h-px" />
          {shown < filtered.length && (
            <div className="flex justify-center pb-24 pt-6">
              <button
                onClick={() => setShown((n) => Math.min(n + PAGE, filtered.length))}
                className="text-sm text-text-secondary hover:text-text underline underline-offset-4 decoration-1 cursor-pointer"
              >
                Show more — {filtered.length - shown} left
              </button>
            </div>
          )}
          {shown >= filtered.length && <div className="pb-24" />}
        </>
      )}

      <CaptionImport
        key={importing?.code ?? 'closed'}
        post={importing}
        onClose={() => setImporting(null)}
      />
    </div>
  );
}
