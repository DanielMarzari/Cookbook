'use client';

import { useCookbookStore } from '@/lib/store';
import { Search, X } from 'lucide-react';

const cuisines = [
  'Italian', 'Japanese', 'Mexican', 'French', 'Chinese',
  'Indian', 'Thai', 'Mediterranean', 'American', 'Korean',
];

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Keto',
];

const difficulties = ['Easy', 'Medium', 'Hard'];

export default function FilterBar() {
  const filters = useCookbookStore((state) => state.filters);
  const setFilters = useCookbookStore((state) => state.setFilters);
  const resetFilters = useCookbookStore((state) => state.resetFilters);

  const hasActiveFilters =
    filters.search ||
    filters.cuisine ||
    filters.dietary.length > 0 ||
    filters.difficulty ||
    filters.maxTime;

  return (
    <div className="bg-surface border-b border-border shadow-warm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={filters.cuisine || ''}
            onChange={(e) => setFilters({ cuisine: e.target.value || null })}
            className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine.toLowerCase()}>
                {cuisine}
              </option>
            ))}
          </select>

          <select
            value={filters.difficulty || ''}
            onChange={(e) => setFilters({ difficulty: e.target.value || null })}
            className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
          >
            <option value="">All Levels</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty.toLowerCase()}>
                {difficulty}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max time (minutes)"
            value={filters.maxTime || ''}
            onChange={(e) =>
              setFilters({ maxTime: e.target.value ? parseInt(e.target.value) : null })
            }
            className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-text"
          />

          {hasActiveFilters && (
            <button
              onClick={() => resetFilters()}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Reset
            </button>
          )}
        </div>

        {/* Dietary Chips */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">
            Dietary Preferences
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const val = option.toLowerCase();
                  const newDietary = filters.dietary.includes(val)
                    ? filters.dietary.filter((d) => d !== val)
                    : [...filters.dietary, val];
                  setFilters({ dietary: newDietary });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.dietary.includes(option.toLowerCase())
                    ? 'bg-primary text-white'
                    : 'bg-background border border-border text-text hover:border-primary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
