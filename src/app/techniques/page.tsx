'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Zap } from 'lucide-react';
import { Technique } from '@/lib/types';
import { api } from '@/lib/api-client';

// Show foundational categories first (Knife Skills up top).
const CATEGORY_ORDER = ['knife skills', 'prep techniques', 'heat methods', 'sauce techniques', 'baking techniques', 'advanced techniques'];
const categoryRank = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c.toLowerCase());
  return i === -1 ? 99 : i;
};

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        setLoading(true);
        const data = await api.techniques.list();

        setTechniques(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching techniques:', err);
        setError(err instanceof Error ? err.message : 'Failed to load techniques');
      } finally {
        setLoading(false);
      }
    };

    fetchTechniques();
  }, []);

  const categories = Array.from(
    new Set(techniques.map((t) => t.category.toLowerCase()))
  ).sort();

  const difficulties = ['beginner', 'intermediate', 'advanced'] as const;

  const filteredTechniques = techniques.filter((technique) => {
    const matchesSearch =
      technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technique.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory ||
      technique.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = !selectedDifficulty ||
      technique.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const orderedCategories = Array.from(
    new Set(filteredTechniques.map((t) => t.category.toLowerCase()))
  ).sort((a, b) => categoryRank(a) - categoryRank(b) || a.localeCompare(b));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      {/* Page heading */}
      <div className="pt-10 md:pt-16 pb-7">
        <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-text mb-8">
          Techniques
        </h1>

        {/* Search */}
        <div className="relative max-w-md mb-5">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary" size={16} strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search techniques…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pr-2 py-2 bg-transparent border-0 border-b border-border focus:border-text text-[15px] placeholder:text-text-secondary transition-colors"
          />
        </div>

        {/* Category + difficulty filters as underlined text links */}
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`lowercase underline-offset-4 decoration-1 cursor-pointer ${!selectedCategory ? 'text-text underline' : 'text-text-secondary hover:text-text hover:underline'}`}
          >
            All
          </button>
          {categories.sort((a, b) => categoryRank(a) - categoryRank(b) || a.localeCompare(b)).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`lowercase underline-offset-4 decoration-1 cursor-pointer ${selectedCategory === category ? 'text-text underline' : 'text-text-secondary hover:text-text hover:underline'}`}
            >
              {category}
            </button>
          ))}
          <span className="ml-auto flex items-baseline gap-x-5">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`lowercase underline-offset-4 decoration-1 cursor-pointer text-[12.5px] ${selectedDifficulty === d ? 'text-text underline' : 'text-text-secondary hover:text-text hover:underline'}`}
              >
                {d}
              </button>
            ))}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96"><p className="text-text-secondary text-sm">Loading techniques…</p></div>
      ) : error ? (
        <div className="flex items-center justify-center h-96"><p className="text-text text-sm">{error}</p></div>
      ) : filteredTechniques.length === 0 ? (
        <div className="flex items-center justify-center h-96"><p className="text-text-secondary text-sm">No techniques found. Try adjusting your search.</p></div>
      ) : (
        <div className="space-y-14 pb-24">
          {orderedCategories.map((category) => {
            const items = filteredTechniques.filter((t) => t.category.toLowerCase() === category);
            return (
              <section key={category}>
                <div className="flex items-baseline gap-3 border-b border-text pb-2.5 mb-6">
                  <h2 className="text-[13px] uppercase tracking-[0.14em] text-text">{category}</h2>
                  <span className="text-[12px] text-text-secondary">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {items.map((technique) => (
                    <Link key={technique.id} href={`/techniques/${technique.slug}`} className="group">
                      <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#F4F4F4] flex items-center justify-center">
                        {technique.image_urls && technique.image_urls.length > 0 ? (
                          // Inline SVG diagram data URIs — plain img renders these reliably.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={technique.image_urls[0]}
                            alt={technique.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Zap size={28} strokeWidth={1.4} className="text-text-secondary/40" />
                        )}
                      </div>
                      <h3 className="text-[16.5px] text-text mt-3.5 group-hover:underline underline-offset-4 decoration-1">
                        {technique.name}
                      </h3>
                      <p className="text-[12.5px] text-text-secondary mt-1 lowercase">{technique.difficulty}</p>
                      <p className="text-[13.5px] text-text-secondary mt-1.5 line-clamp-2 max-w-[40ch]">{technique.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
