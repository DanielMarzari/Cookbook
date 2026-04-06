'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Trash2, Search, Pencil, Check, Loader } from 'lucide-react';
import { Collection, Recipe } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import RecipeCard from '@/components/RecipeCard';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionRecipes, setCollectionRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');

  // Editing state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCoverUrl, setEditCoverUrl] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    fetchCollectionAndRecipes();
  }, [id]);

  const fetchCollectionAndRecipes = async () => {
    try {
      setLoading(true);

      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();

      if (collectionError) throw new Error(collectionError.message);
      if (!collectionData) throw new Error('Collection not found');

      setCollection(collectionData);

      const { data: recipesData, error: recipesError } = await supabase
        .from('collection_recipes')
        .select('recipe_id')
        .eq('collection_id', id);

      if (recipesError) throw new Error(recipesError.message);

      const recipeIds = recipesData?.map((r) => r.recipe_id) || [];

      if (recipeIds.length > 0) {
        const { data: recipes, error: recipeDetailsError } = await supabase
          .from('recipes')
          .select('*')
          .in('id', recipeIds);

        if (recipeDetailsError) throw new Error(recipeDetailsError.message);
        setCollectionRecipes(recipes || []);
      }

      const { data: allRecipesData, error: allRecipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('title');

      if (allRecipesError) throw new Error(allRecipesError.message);
      setAllRecipes(allRecipesData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    if (!collection) return;
    setEditName(collection.name);
    setEditSubtitle(collection.subtitle || '');
    setEditDescription(collection.description || '');
    setEditCoverUrl(collection.cover_image_url || '');
    setEditing(true);
  };

  const saveEdits = async () => {
    if (!collection || !editName.trim()) return;
    setEditSaving(true);
    try {
      const { error } = await supabase
        .from('collections')
        .update({
          name: editName,
          subtitle: editSubtitle || null,
          description: editDescription || null,
          cover_image_url: editCoverUrl || null,
        })
        .eq('id', collection.id);

      if (error) throw error;
      setCollection({
        ...collection,
        name: editName,
        subtitle: editSubtitle || undefined,
        description: editDescription || undefined,
        cover_image_url: editCoverUrl || undefined,
      });
      setEditing(false);
    } catch (err) {
      console.error('Error saving collection:', err);
    } finally {
      setEditSaving(false);
    }
  };

  const deleteCollection = async () => {
    if (!collection) return;
    if (!confirm(`Delete "${collection.name}"? The recipes inside won't be deleted.`)) return;
    try {
      await supabase.from('collection_recipes').delete().eq('collection_id', collection.id);
      await supabase.from('collections').delete().eq('id', collection.id);
      router.push('/collections');
    } catch (err) {
      console.error('Error deleting collection:', err);
    }
  };

  const addRecipeToCollection = async (recipeId: string) => {
    try {
      const { data: existing } = await supabase
        .from('collection_recipes')
        .select('*')
        .eq('collection_id', id)
        .eq('recipe_id', recipeId)
        .single();

      if (existing) return;

      const { error: insertError } = await supabase
        .from('collection_recipes')
        .insert([{ collection_id: id, recipe_id: recipeId }]);

      if (insertError) throw new Error(insertError.message);
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

      if (deleteError) throw new Error(deleteError.message);
      setCollectionRecipes(collectionRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (err) {
      console.error('Error removing recipe:', err);
    }
  };

  const filteredAvailableRecipes = allRecipes.filter((recipe) => {
    const isAlreadyInCollection = collectionRecipes.some((cr) => cr.id === recipe.id);
    const matchesSearch = recipe.title.toLowerCase().includes(recipeSearch.toLowerCase());
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
          <div className="text-6xl mb-4">&#9888;&#65039;</div>
          <h1 className="text-2xl font-bold text-text mb-2">Collection not found</h1>
          <p className="text-text-secondary mb-6">{error || 'The collection you are looking for does not exist.'}</p>
          <Link href="/collections" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
            <ArrowLeft size={18} />
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Cookbook Cover Header */}
      <div className="relative border-b border-border overflow-hidden">
        {collection.cover_image_url ? (
          <>
            <div className="absolute inset-0">
              <img src={collection.cover_image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8">
              <div className="flex items-center justify-between mb-8">
                <Link href="/collections" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors">
                  <ArrowLeft size={18} />
                  Back to Cookbooks
                </Link>
                <div className="flex items-center gap-2">
                  <button onClick={startEditing} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Edit cookbook">
                    <Pencil size={20} />
                  </button>
                  <button onClick={deleteCollection} className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors" title="Delete cookbook">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="py-8 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wide mb-2">
                  {collection.name.toUpperCase()}
                </h1>
                {collection.subtitle && (
                  <>
                    <div className="w-16 h-px bg-white/50 mx-auto my-3" />
                    <p className="text-lg text-white/80 italic">{collection.subtitle}</p>
                  </>
                )}
                {collection.description && (
                  <p className="text-white/60 mt-3 max-w-xl mx-auto">{collection.description}</p>
                )}
                <p className="text-sm text-white/50 mt-4">
                  {collectionRecipes.length} {collectionRecipes.length === 1 ? 'recipe' : 'recipes'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <Link href="/collections" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors">
                  <ArrowLeft size={18} />
                  Back to Cookbooks
                </Link>
                <div className="flex items-center gap-2">
                  <button onClick={startEditing} className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-full transition-colors" title="Edit cookbook">
                    <Pencil size={20} />
                  </button>
                  <button onClick={deleteCollection} className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete cookbook">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="py-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-wide mb-2">
                  {collection.name.toUpperCase()}
                </h1>
                {collection.subtitle && (
                  <>
                    <div className="w-16 h-px bg-primary/40 mx-auto my-3" />
                    <p className="text-lg text-text-secondary italic">{collection.subtitle}</p>
                  </>
                )}
                {collection.description && (
                  <p className="text-text-secondary mt-3 max-w-xl mx-auto">{collection.description}</p>
                )}
                <p className="text-sm text-text-secondary mt-4">
                  {collectionRecipes.length} {collectionRecipes.length === 1 ? 'recipe' : 'recipes'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text">Recipes</h2>
          <button
            onClick={() => setShowAddRecipeModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            Add Recipe
          </button>
        </div>

        {collectionRecipes.length === 0 ? (
          <div className="bg-surface rounded-2xl shadow-warm border border-border p-12 text-center">
            <div className="text-6xl mb-4">&#128218;</div>
            <h3 className="text-lg font-semibold text-text mb-2">No recipes yet</h3>
            <p className="text-text-secondary mb-6">Add recipes to this cookbook to get started</p>
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
                    await supabase.from('recipes').update({ is_favorite: isFavorite }).eq('id', id);
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

      {/* Edit Collection Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-warm-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text">Edit Cookbook</h3>
              <button onClick={() => setEditing(false)} className="p-2 hover:bg-background rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Title *</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Subtitle</label>
                <input type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="e.g., Mangiamo!"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="What's this cookbook about?"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Cover Image URL</label>
                <input type="url" value={editCoverUrl} onChange={(e) => setEditCoverUrl(e.target.value)} placeholder="https://..."
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
                {editCoverUrl && (
                  <div className="mt-2 h-32 rounded-lg overflow-hidden bg-background">
                    <img src={editCoverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(false)} className="flex-1 px-4 py-3 rounded-lg border border-border text-text hover:bg-background transition-colors font-medium">
                Cancel
              </button>
              <button onClick={saveEdits} disabled={!editName.trim() || editSaving}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {editSaving ? <><Loader size={16} className="animate-spin" /> Saving...</> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Recipe Modal */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-warm-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text">Add Recipe</h3>
              <button onClick={() => { setShowAddRecipeModal(false); setRecipeSearch(''); }} className="p-2 hover:bg-background rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
                <input type="text" placeholder="Search recipes..." value={recipeSearch} onChange={(e) => setRecipeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {filteredAvailableRecipes.length === 0 ? (
                <p className="text-center text-text-secondary py-8">
                  {recipeSearch ? 'No recipes match your search' : 'All recipes are already in this collection'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableRecipes.map((recipe) => (
                    <button key={recipe.id} onClick={() => addRecipeToCollection(recipe.id)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary bg-background hover:bg-primary/5 transition-all">
                      <p className="font-medium text-text line-clamp-1">{recipe.title}</p>
                      <p className="text-xs text-text-secondary">{recipe.cuisine_type}</p>
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
