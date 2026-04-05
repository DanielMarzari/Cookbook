'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Trash2, Search } from 'lucide-react';
import { Collection, Recipe } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import RecipeCard from '@/components/RecipeCard';

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionRecipes, setCollectionRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');

  useEffect(() => {
    fetchCollectionAndRecipes();
  }, [id]);

  const fetchCollectionAndRecipes = async () => {
    try {
      setLoading(true);

      // Fetch collection
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();

      if (collectionError) {
        throw new Error(collectionError.message);
      }

      if (!collectionData) {
        throw new Error('Collection not found');
      }

      setCollection(collectionData);

      // Fetch collection recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('collection_recipes')
        .select('recipe_id')
        .eq('collection_id', id);

      if (recipesError) {
        throw new Error(recipesError.message);
      }

      const recipeIds = recipesData?.map((r) => r.recipe_id) || [];

      if (recipeIds.length > 0) {
        const { data: recipes, error: recipeDetailsError } = await supabase
          .from('recipes')
          .select('*')
          .in('id', recipeIds);

        if (recipeDetailsError) {
          throw new Error(recipeDetailsError.message);
        }

        setCollectionRecipes(recipes || []);
      }

      // Fetch all recipes for add modal
      const { data: allRecipesData, error: allRecipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('title');

      if (allRecipesError) {
        throw new Error(allRecipesError.message);
      }

      setAllRecipes(allRecipesData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const addRecipeToCollection = async (recipeId: string) => {
    try {
      // Check if already in collection
      const { data: existing } = await supabase
        .from('collection_recipes')
        .select('*')
        .eq('collection_id', id)
        .eq('recipe_id', recipeId)
        .single();

      if (existing) {
        return; // Already in collection
      }

      const { error: insertError } = await supabase
        .from('collection_recipes')
        .insert([{ collection_id: id, recipe_id: recipeId }]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Re-fetch collection recipes
      await fetchCollectionAndRecipes();
    } catch (err) {
      console.error('Error adding recipe:', err);
    }
  };

  const removeRecipeFromCollection = async (recipeId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('collection_recipes')
        .delete()
        .eq('collection_id', id)
        .eq('recipe_id', recipeId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setCollectionRecipes(
        collectionRecipes.filter((recipe) => recipe.id !== recipeId)
      );
    } catch (err) {
      console.error('Error removing recipe:', err);
    }
  };

  const filteredAvailableRecipes = allRecipes.filter((recipe) => {
    const isAlreadyInCollection = collectionRecipes.some(
      (cr) => cr.id === recipe.id
    );
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(recipeSearch.toLowerCase());
    return !isAlreadyInCollection && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-text-secondary">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text mb-2">
            Collection not found
          </h1>
          <p className="text-text-secondary mb-6">
            {error || 'The collection you are looking for does not exist.'}
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Collections
          </Link>

          <div className={`${collection.color} rounded-2xl p-8 mb-6`} />

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-text mb-3">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-lg text-text-secondary mb-4">
                  {collection.description}
                </p>
              )}
              <p className="text-sm text-text-secondary">
                {collectionRecipes.length}{' '}
                {collectionRecipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
            </div>

            <button
              onClick={() => setShowAddRecipeModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              Add Recipe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {collectionRecipes.length === 0 ? (
          <div className="bg-surface rounded-2xl shadow-warm border border-border p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-text mb-2">
              No recipes yet
            </h3>
            <p className="text-text-secondary mb-6">
              Add recipes to this collection to get started
            </p>
            <button
              onClick={() => setShowAddRecipeModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Add Recipe
            </button>
          </div>
        ) : (
          <div className="grid grid-responsive gap-6">
            {collectionRecipes.map((recipe) => (
              <div key={recipe.id} className="relative group">
                <RecipeCard
                  recipe={recipe}
                  onToggleFavorite={async (id, isFavorite) => {
                    await supabase
                      .from('recipes')
                      .update({ is_favorite: isFavorite })
                      .eq('id', id);
                  }}
                />
                <button
                  onClick={() => removeRecipeFromCollection(recipe.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remove from collection"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Recipe Modal */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-warm-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text">Add Recipe</h3>
              <button
                onClick={() => {
                  setShowAddRecipeModal(false);
                  setRecipeSearch('');
                }}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-border">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-text-secondary"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {filteredAvailableRecipes.length === 0 ? (
                <p className="text-center text-text-secondary py-8">
                  {recipeSearch
                    ? 'No recipes match your search'
                    : 'All recipes are already in this collection'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => addRecipeToCollection(recipe.id)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary bg-background hover:bg-primary/5 transition-all"
                    >
                      <p className="font-medium text-text line-clamp-1">
                        {recipe.title}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {recipe.cuisine_type}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
