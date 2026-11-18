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
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bases pulled in because one of their branches matched the search.
  const filters = useCookbookStore((state) => state.filters);

  // Total collection size, for the "Showing X of Y" line
  useEffect(() => {
    api.recipes
      .list()
      .then((all) => setTotalCount(all?.length ?? null))
      .catch(() => {});
  }, []);

  // Fetch recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        const data = await api.recipes.list({
          search: filters.search || undefined,
          cuisine: filters.cuisine || undefined,
          craft: filters.craft || undefined,
          mine: filters.mine || undefined,
          signature: filters.signature || undefined,
          difficulty: filters.difficulty || undefined,
          maxTime: filters.maxTime || undefined,
        });

        setRecipes(data || []);
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

  const hasActiveFilters =
    filters.search || filters.cuisine || filters.craft || filters.mine || filters.signature || filters.difficulty || filters.maxTime;

  // What a branch is, and when it stops being folded away.
  //
  // Unfiltered, a branch lives inside its base's collage tile: joining two
  // recipes says they are the same dish, and the grid should not list the same
  // dish four times. The exception is ownership — a variation you wrote on
  // somebody else's base is your recipe, and hiding your own work inside their
  // tile is how it goes missing.
  //
  // Filtered, the rule inverts: show what actually matched. Filtering for
  // Mediterranean when the rose cardamom branch is the Mediterranean one and
  // its vanilla base is not should answer with the rose cardamom. Swapping a
  // matching branch for its base — which is what this used to do — answers a
  // question nobody asked.
  const gridRecipes = (() => {
    if (hasActiveFilters) return recipes;

    const bases = recipes.filter((r) => !r.parent_recipe_id);
    const baseById = new Map(bases.map((r) => [r.id, r]));
    const mineOnSomeoneElses = recipes.filter(
      (r) => r.parent_recipe_id && r.is_mine && !baseById.get(r.parent_recipe_id)?.is_mine,
    );
    return [...bases, ...mineOnSomeoneElses];
  })();

  const countLine = (() => {
    if (loading || error) return ' ';
    if (totalCount !== null && recipes.length !== totalCount) {
      return `Showing ${recipes.length} of ${totalCount}`;
    }
    return `${gridRecipes.length} recipe${gridRecipes.length !== 1 ? 's' : ''}`;
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      {/* Page heading */}
      <div className="pt-10 md:pt-16 pb-7">
        <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-text mb-8">
          Recipes
        </h1>
        <FilterBar />
        <p className="text-[12.5px] text-text-secondary pt-5">{countLine}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-text-secondary text-sm">Loading recipes…</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-text mb-2">Couldn&apos;t load recipes</p>
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl text-text mb-2">No recipes found</h2>
            <p className="text-text-secondary text-sm mb-6">
              {hasActiveFilters
                ? 'Try adjusting your filters'
                : 'Start by adding your first recipe'}
            </p>
            {!hasActiveFilters && (
              <Link href="/add-recipe" className="tlink text-text text-sm">
                Add your first recipe
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-y-14 pb-24">
          {gridRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
