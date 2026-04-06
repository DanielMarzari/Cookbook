'use client';

import { useEffect, useState } from 'react';
import FilterBar from '@/components/FilterBar';
import RecipeCard from '@/components/RecipeCard';
import { useCookbookStore } from '@/lib/store';
import { Recipe } from '@/lib/types';
import { api } from '@/lib/api-client';
import Link from 'next/link';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filters = useCookbookStore((state) => state.filters);

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        const data = await api.recipes.list({
          search: filters.search || undefined,
          cuisine: filters.cuisine || undefined,
          difficulty: filters.difficulty || undefined,
          maxTime: filters.maxTime || undefined,
        });

        // Filter by dietary if needed (client-side for now)
        let filteredData = data || [];
        if (filters.dietary.length > 0) {
          // This would need dietary tags in the database to filter properly
          // For now, we'll keep all results
        }

        setRecipes(filteredData);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recipes');
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [filters]);

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await api.recipes.update(id, { is_favorite: isFavorite });
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  return (
    <div className="w-full">
      <FilterBar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
              <p className="text-text-secondary">Loading recipes...</p>
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
        ) : recipes.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">🍴</div>
              <h2 className="text-2xl font-bold text-text mb-2">
                No recipes found
              </h2>
              <p className="text-text-secondary mb-6">
                {filters.search || filters.cuisine || filters.difficulty
                  ? 'Try adjusting your filters'
                  : 'Start by adding your first recipe'}
              </p>
              {!filters.search &&
                !filters.cuisine &&
                !filters.difficulty &&
                !filters.maxTime &&
                filters.dietary.length === 0 && (
                  <Link
                    href="/add-recipe"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    Add Your First Recipe
                  </Link>
                )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-sm font-medium text-text-secondary">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
              </h2>
            </div>
            <div className="grid grid-responsive gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
