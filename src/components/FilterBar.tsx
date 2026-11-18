'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useCookbookStore } from '@/lib/store';
import { useCuisines } from '@/lib/useCuisines';
import { useCrafts } from '@/lib/useCrafts';

const difficulties = ['Easy', 'Medium', 'Hard'];

/**
 * One line of filters.
 *
 * This used to print every cuisine as a word on the page, which was fine at
 * six and unreadable at twenty-five — three wrapped rows of place names above
 * the recipes, most of them leading nowhere. Everything that is a list is a
 * menu now, and the row says what is currently on rather than what could be:
 * closed, it reads "Italian · Baking", which is the useful sentence.
 *
 * The two marks keep their own buttons because they are one tap and you reach
 * for them constantly — Mine, and the signature menu.
 */
export default function FilterBar() {
  const { cuisines } = useCuisines();
  const { crafts } = useCrafts();
  const filters = useCookbookStore((state) => state.filters);
  const setFilters = useCookbookStore((state) => state.setFilters);
  const resetFilters = useCookbookStore((state) => state.resetFilters);
  const [open, setOpen] = useState<'cuisine' | 'kind' | 'more' | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  // A menu that stays open after you have clicked away from it reads as a bug.
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const hasActiveFilters =
    filters.search || filters.cuisine || filters.craft || filters.mine ||
    filters.signature || filters.difficulty || filters.maxTime;

  const label = (list: string[], value: string | null, fallback: string) =>
    (value && list.find((x) => x.toLowerCase() === value)) || fallback;

  return (
    <div className="space-y-4" ref={wrap}>
      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary"
          size={16}
          strokeWidth={1.8}
        />
        <input
          id="recipe-search"
          type="text"
          placeholder="Search recipes…"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full pl-7 pr-2 py-2 bg-transparent border-0 border-b border-border focus:border-text text-[15px] placeholder:text-text-secondary transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <Menu
          id="cuisine"
          open={open}
          setOpen={setOpen}
          on={Boolean(filters.cuisine)}
          label={label(cuisines, filters.cuisine, 'Cuisine')}
          empty={cuisines.length === 0}
        >
          <Item onClick={() => { setFilters({ cuisine: null }); setOpen(null); }} on={!filters.cuisine}>
            Any cuisine
          </Item>
          {cuisines.map((c) => (
            <Item
              key={c}
              on={filters.cuisine === c.toLowerCase()}
              onClick={() => {
                setFilters({ cuisine: filters.cuisine === c.toLowerCase() ? null : c.toLowerCase() });
                setOpen(null);
              }}
            >
              {c}
            </Item>
          ))}
        </Menu>

        <Menu
          id="kind"
          open={open}
          setOpen={setOpen}
          on={Boolean(filters.craft)}
          label={label(crafts, filters.craft, 'Kind')}
        >
          <Item onClick={() => { setFilters({ craft: null }); setOpen(null); }} on={!filters.craft}>
            Any kind
          </Item>
          {crafts.map((c) => (
            <Item
              key={c}
              on={filters.craft === c.toLowerCase()}
              onClick={() => {
                setFilters({ craft: filters.craft === c.toLowerCase() ? null : c.toLowerCase() });
                setOpen(null);
              }}
            >
              {c}
            </Item>
          ))}
        </Menu>

        <Toggle on={filters.mine} onClick={() => setFilters({ mine: !filters.mine })}>
          Mine
        </Toggle>
        <Toggle on={filters.signature} onClick={() => setFilters({ signature: !filters.signature })}>
          Signature menu
        </Toggle>

        <Menu
          id="more"
          open={open}
          setOpen={setOpen}
          on={Boolean(filters.difficulty || filters.maxTime)}
          label={
            filters.difficulty || filters.maxTime
              ? [filters.difficulty, filters.maxTime ? `under ${filters.maxTime}m` : null].filter(Boolean).join(' · ')
              : 'More'
          }
        >
          <div className="px-3 py-2">
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <button
                onClick={() => setFilters({ difficulty: null })}
                className={`text-[13px] lowercase underline-offset-4 ${
                  !filters.difficulty ? 'text-text underline' : 'text-text-secondary hover:text-text'
                }`}
              >
                any
              </button>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    setFilters({ difficulty: filters.difficulty === d.toLowerCase() ? null : d.toLowerCase() })
                  }
                  className={`text-[13px] lowercase underline-offset-4 ${
                    filters.difficulty === d.toLowerCase() ? 'text-text underline' : 'text-text-secondary hover:text-text'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <p className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary mt-4 mb-2">Max time</p>
            <input
              type="number"
              placeholder="minutes"
              value={filters.maxTime || ''}
              onChange={(e) => setFilters({ maxTime: e.target.value ? parseInt(e.target.value) : null })}
              className="w-28 bg-transparent border-0 border-b border-border focus:border-text py-1 text-[13px] placeholder:text-text-secondary transition-colors"
            />
          </div>
        </Menu>

        {hasActiveFilters && (
          <button
            onClick={() => { resetFilters(); setOpen(null); }}
            className="text-[12.5px] text-text-secondary hover:text-text underline underline-offset-4 ml-auto"
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
}

function Menu({
  id, open, setOpen, on, label, children, empty,
}: {
  id: 'cuisine' | 'kind' | 'more';
  open: string | null;
  setOpen: (v: 'cuisine' | 'kind' | 'more' | null) => void;
  on: boolean;
  label: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  if (empty) return null;
  const isOpen = open === id;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(isOpen ? null : id)}
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-[13px] transition-colors ${
          on ? 'border-text text-text' : 'border-border text-text-secondary hover:border-text hover:text-text'
        }`}
      >
        {label}
        <ChevronDown size={13} strokeWidth={1.8} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 min-w-[180px] max-h-[320px] overflow-y-auto
                        border border-text bg-background py-1 shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
          {children}
        </div>
      )}
    </div>
  );
}

function Item({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-1.5 text-[13px] transition-colors ${
        on ? 'text-text bg-[#f4f4f4]' : 'text-text-secondary hover:text-text hover:bg-[#fafafa]'
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`px-3 py-1.5 border text-[13px] transition-colors ${
        on ? 'bg-text border-text text-background' : 'border-border text-text-secondary hover:border-text hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}
