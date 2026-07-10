'use client';

import { useState } from 'react';
import { useCookbookStore } from '@/lib/store';
import { Search } from 'lucide-react';
import { useCuisines } from '@/lib/useCuisines';

const difficulties = ['Easy', 'Medium', 'Hard'];

export default function FilterBar() {
  const { cuisines } = useCuisines();
  const filters = useCookbookStore((state) => state.filters);
  const setFilters = useCookbookStore((state) => state.setFilters);
  const resetFilters = useCookbookStore((state) => state.resetFilters);
  const [moreOpen, setMoreOpen] = useState(false);

  const hasActiveFilters =
    filters.search || filters.cuisine || filters.difficulty || filters.maxTime;

  return (
    <div className="space-y-5">
      {/* Search — a single hairline-underlined field */}
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

      {/* Cuisine filters as underlined text links */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
        <button
          onClick={() => setFilters({ cuisine: null })}
          className={`lowercase transition-colors underline-offset-4 decoration-1 cursor-pointer ${
            !filters.cuisine
              ? 'text-text underline'
              : 'text-text-secondary hover:text-text hover:underline'
          }`}
        >
          All
        </button>
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() =>
              setFilters({
                cuisine:
                  filters.cuisine === cuisine.toLowerCase()
                    ? null
                    : cuisine.toLowerCase(),
              })
            }
            className={`lowercase transition-colors underline-offset-4 decoration-1 cursor-pointer ${
              filters.cuisine === cuisine.toLowerCase()
                ? 'text-text underline'
                : 'text-text-secondary hover:text-text hover:underline'
            }`}
          >
            {cuisine}
          </button>
        ))}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="text-text-secondary hover:text-text underline underline-offset-4 decoration-1 cursor-pointer ml-auto text-[12.5px]"
        >
          {moreOpen ? 'fewer filters' : 'more filters'}
        </button>
        {hasActiveFilters && (
          <button
            onClick={() => resetFilters()}
            className="text-text-secondary hover:text-text underline underline-offset-4 decoration-1 cursor-pointer text-[12.5px]"
          >
            reset
          </button>
        )}
      </div>

      {/* Secondary filters, tucked away */}
      {moreOpen && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm border-t border-border pt-4">
          <div className="flex items-baseline gap-4">
            <span className="text-[12.5px] text-text-secondary">difficulty —</span>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() =>
                  setFilters({
                    difficulty:
                      filters.difficulty === difficulty.toLowerCase()
                        ? null
                        : difficulty.toLowerCase(),
                  })
                }
                className={`lowercase transition-colors underline-offset-4 decoration-1 cursor-pointer ${
                  filters.difficulty === difficulty.toLowerCase()
                    ? 'text-text underline'
                    : 'text-text-secondary hover:text-text hover:underline'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
          <label className="flex items-baseline gap-3">
            <span className="text-[12.5px] text-text-secondary">max time —</span>
            <input
              type="number"
              placeholder="minutes"
              value={filters.maxTime || ''}
              onChange={(e) =>
                setFilters({
                  maxTime: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-24 bg-transparent border-0 border-b border-border focus:border-text py-1 text-sm placeholder:text-text-secondary transition-colors"
            />
          </label>
        </div>
      )}
    </div>
  );
}
