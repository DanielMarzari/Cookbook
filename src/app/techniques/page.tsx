'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Zap, BookOpen } from 'lucide-react';
import { Technique } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const categoryIcons: Record<string, string> = {
  'heat methods': '🔥',
  'sauce techniques': '🍲',
  'prep techniques': '🔪',
  'mixing methods': '🥄',
  'dough techniques': '🥐',
  'grilling': '🍗',
  'baking': '🍰',
  'fermenting': '🥒',
  'curing': '🍖',
  'plating': '🍽️',
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
        const { data, error: supabaseError } = await supabase
          .from('techniques')
          .select('*')
          .order('name', { ascending: true });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

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

  const groupedTechniques = Array.from(
    new Set(filteredTechniques.map((t) => t.category.toLowerCase()))
  ).reduce(
    (acc, category) => {
      acc[category] = filteredTechniques.filter(
        (t) => t.category.toLowerCase() === category
      );
      return acc;
    },
    {} as Record<string, Technique[]>
  );

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold text-text mb-2">Cooking Techniques</h1>
          <p className="text-text-secondary">
            Master essential cooking methods and culinary skills
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search techniques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-surface text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category and Difficulty Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-border text-text hover:bg-background'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-border text-text hover:bg-background'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDifficulty(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === null
                      ? 'bg-primary text-white'
                      : 'bg-surface border border-border text-text hover:bg-background'
                  }`}
                >
                  All
                </button>
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      selectedDifficulty === difficulty
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-border text-text hover:bg-background'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <p className="text-text-secondary">Loading techniques...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-text-secondary text-sm">
                Make sure your Supabase connection is configured correctly
              </p>
            </div>
          </div>
        ) : filteredTechniques.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-text mb-2">
                No techniques found
              </h2>
              <p className="text-text-secondary">
                Try adjusting your search or filters
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedTechniques).map(([category, categoryTechniques]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">
                    {categoryIcons[category.toLowerCase()] || '👨‍🍳'}
                  </span>
                  <h2 className="text-2xl font-bold text-text">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h2>
                  <span className="text-sm text-text-secondary">
                    ({categoryTechniques.length})
                  </span>
                </div>

                <div className="grid grid-responsive gap-6">
                  {categoryTechniques.map((technique) => (
                    <div
                      key={technique.id}
                      className="group h-full"
                    >
                      <Link
                        href={`/techniques/${technique.slug}`}
                      >
                        <article className="h-full overflow-hidden rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-surface border border-border hover:border-primary">
                          {/* Image */}
                          {technique.image_urls && technique.image_urls.length > 0 ? (
                            <div className="relative w-full h-40 overflow-hidden bg-gradient-to-br from-background to-border">
                              <img
                                src={technique.image_urls[0]}
                                alt={technique.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="relative w-full h-40 bg-gradient-to-br from-background to-border flex items-center justify-center">
                              <Zap size={40} className="text-primary/20" />
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-bold text-text line-clamp-1 group-hover:text-primary transition-colors flex-1">
                                {technique.name}
                              </h3>
                              <span
                                className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                  difficultyColors[technique.difficulty]
                                }`}
                              >
                                {technique.difficulty.charAt(0).toUpperCase() +
                                  technique.difficulty.slice(1)}
                              </span>
                            </div>

                            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                              {technique.description}
                            </p>

                            {/* Tips Preview */}
                            {technique.tips && technique.tips.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                                <BookOpen size={14} />
                                {technique.tips.length} tip{technique.tips.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </article>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
