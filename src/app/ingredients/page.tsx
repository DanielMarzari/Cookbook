'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Leaf, Link2, AlertCircle, Check } from 'lucide-react';
import { Ingredient } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import IngredientModal from '@/components/IngredientModal';

interface UnmatchedIngredient {
  name: string;
  count: number;
  recipeNames: string[];
}

const CATEGORIES = [
  'Pantry',
  'Aromatics',
  'Herbs & Spices',
  'Produce',
  'Proteins',
  'Dairy',
  'Grains & Carbs',
  'Condiments',
  'Sauces',
  'Baking',
  'Oils & Fats',
  'Canned Goods',
  'Frozen',
  'Beverages',
  'Snacks',
  'Other',
];

const CATEGORY_EMOJIS: Record<string, string> = {
  'Pantry': '🧂',
  'Aromatics': '🧄',
  'Herbs & Spices': '🌿',
  'Produce': '🍅',
  'Proteins': '🥩',
  'Dairy': '🧀',
  'Grains & Carbs': '🌾',
  'Condiments': '🍯',
  'Sauces': '🫗',
  'Baking': '🧁',
  'Oils & Fats': '🫒',
  'Canned Goods': '🥫',
  'Frozen': '🧊',
  'Beverages': '🥤',
  'Snacks': '🍿',
  'Other': '📦',
};

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>();
  const [activeTab, setActiveTab] = useState<'library' | 'matching'>('library');
  const [unmatchedIngredients, setUnmatchedIngredients] = useState<UnmatchedIngredient[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);

  useEffect(() => {
    loadIngredients();
  }, []);

  useEffect(() => {
    filterIngredients();
  }, [searchQuery, selectedCategory, ingredients]);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error('Error loading ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIngredients = () => {
    let filtered = ingredients;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ing =>
        ing.name.toLowerCase().includes(query) ||
        ing.brand?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(ing => ing.category === selectedCategory);
    }

    setFilteredIngredients(filtered);
  };

  const loadUnmatchedIngredients = async () => {
    setMatchingLoading(true);
    try {
      // Get all recipe ingredients
      const { data: recipeIngs } = await supabase
        .from('recipe_ingredients')
        .select('name, recipe_id');

      // Get all recipes for name lookup
      const { data: recipes } = await supabase
        .from('recipes')
        .select('id, title');

      const recipeMap = new Map(recipes?.map(r => [r.id, r.title]) || []);

      // Get all DB ingredient names (lowercase for comparison)
      const dbNames = new Set(ingredients.map(i => i.name.toLowerCase()));

      // Find recipe ingredients that don't match any DB ingredient
      const unmatchedMap = new Map<string, { count: number; recipeNames: Set<string> }>();

      for (const ri of recipeIngs || []) {
        if (!ri.name) continue;
        // Skip section headers
        if (ri.name.startsWith('---')) continue;

        const lowerName = ri.name.toLowerCase().trim();
        if (!dbNames.has(lowerName)) {
          const existing = unmatchedMap.get(lowerName);
          if (existing) {
            existing.count++;
            const recipeName = recipeMap.get(ri.recipe_id);
            if (recipeName) existing.recipeNames.add(recipeName);
          } else {
            const recipeName = recipeMap.get(ri.recipe_id);
            unmatchedMap.set(lowerName, {
              count: 1,
              recipeNames: new Set(recipeName ? [recipeName] : []),
            });
          }
        }
      }

      // Convert to array, sort by frequency
      const unmatched = Array.from(unmatchedMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        recipeNames: Array.from(data.recipeNames),
      })).sort((a, b) => b.count - a.count);

      setUnmatchedIngredients(unmatched);
    } catch (error) {
      console.error('Error loading unmatched ingredients:', error);
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleCreateFromUnmatched = (name: string) => {
    // Open modal with name pre-filled
    setEditingIngredient({ name, category: 'Other' } as any);
    setIsModalOpen(true);
  };

  const handleLinkIngredient = async (unmatchedName: string, dbIngredient: Ingredient) => {
    // Update all recipe_ingredients with this name to link to the DB ingredient
    try {
      const { error } = await supabase
        .from('recipe_ingredients')
        .update({ ingredient_id: dbIngredient.id })
        .ilike('name', unmatchedName);

      if (error) throw error;

      // Remove from unmatched list
      setUnmatchedIngredients(prev => prev.filter(u => u.name.toLowerCase() !== unmatchedName.toLowerCase()));
    } catch (error) {
      console.error('Error linking ingredient:', error);
    }
  };

  const handleAddIngredient = () => {
    setEditingIngredient(undefined);
    setIsModalOpen(true);
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleSaveIngredient = (ingredient: Ingredient) => {
    const existing = ingredients.find(i => i.id === ingredient.id);
    if (existing) {
      setIngredients(ingredients.map(i => (i.id === ingredient.id ? ingredient : i)));
    } else {
      setIngredients([...ingredients, ingredient]);
    }
    // Refresh unmatched list if on matching tab
    if (activeTab === 'matching') {
      setTimeout(() => loadUnmatchedIngredients(), 500);
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;

    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIngredients(ingredients.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Failed to delete ingredient');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Ingredients</h1>
            <p className="text-text-secondary">
              Manage your ingredient database and nutrition information
            </p>
          </div>
          <button
            onClick={handleAddIngredient}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Add Ingredient
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            }`}
          >
            Ingredient Library
          </button>
          <button
            onClick={() => {
              setActiveTab('matching');
              loadUnmatchedIngredients();
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'matching'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            }`}
          >
            <Link2 size={16} />
            Recipe Matching
            {unmatchedIngredients.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 rounded-full">
                {unmatchedIngredients.length}
              </span>
            )}
          </button>
        </div>

        {/* Search and Filter (library tab only) */}
        {activeTab === 'library' && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-text-secondary" />
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'library' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <p className="text-text-secondary">Loading ingredients...</p>
              </div>
            ) : filteredIngredients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Leaf size={48} className="text-text-secondary mb-4 opacity-50" />
                <p className="text-text-secondary text-lg">
                  {ingredients.length === 0 ? 'No ingredients yet' : 'No ingredients match your search'}
                </p>
                {ingredients.length === 0 && (
                  <button
                    onClick={handleAddIngredient}
                    className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                  >
                    Add Your First Ingredient
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {CATEGORIES.map(category => {
                  const categoryIngredients = filteredIngredients.filter(ing => ing.category === category);

                  if (categoryIngredients.length === 0) return null;

                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{CATEGORY_EMOJIS[category]}</span>
                        <h2 className="text-xl font-bold text-text">{category}</h2>
                        <span className="text-sm text-text-secondary ml-auto">
                          {categoryIngredients.length} item{categoryIngredients.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="grid grid-responsive gap-4">
                        {categoryIngredients.map(ingredient => (
                          <div
                            key={ingredient.id}
                            onClick={() => handleEditIngredient(ingredient)}
                            className="bg-surface border border-border rounded-lg p-5 hover:shadow-warm transition-shadow cursor-pointer"
                          >
                            <div className="mb-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg text-text">
                                    {ingredient.name}
                                  </h3>
                                  {ingredient.brand && (
                                    <p className="text-sm text-text-secondary">{ingredient.brand}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="mb-4 flex gap-2">
                              {ingredient.is_custom && (
                                <span className="px-2 py-1 bg-accent bg-opacity-20 text-accent text-xs font-medium rounded-full">
                                  Custom
                                </span>
                              )}
                              {ingredient.fdc_id && (
                                <span className="px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs font-medium rounded-full">
                                  USDA
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div className="bg-background p-2 rounded">
                                <p className="text-text-secondary font-medium">Calories</p>
                                <p className="text-text font-bold">
                                  {Math.round(ingredient.calories_per_100g)}
                                </p>
                              </div>
                              <div className="bg-background p-2 rounded">
                                <p className="text-text-secondary font-medium">Protein</p>
                                <p className="text-text font-bold">
                                  {ingredient.protein_per_100g.toFixed(1)}g
                                </p>
                              </div>
                              <div className="bg-background p-2 rounded">
                                <p className="text-text-secondary font-medium">Carbs</p>
                                <p className="text-text font-bold">
                                  {ingredient.carbs_per_100g.toFixed(1)}g
                                </p>
                              </div>
                              <div className="bg-background p-2 rounded">
                                <p className="text-text-secondary font-medium">Fat</p>
                                <p className="text-text font-bold">
                                  {ingredient.fat_per_100g.toFixed(1)}g
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditIngredient(ingredient);
                                }}
                                className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-background rounded transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteIngredient(ingredient.id);
                                }}
                                className="flex-1 px-3 py-2 text-sm font-medium text-accent hover:bg-background rounded transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'matching' && (
          <div>
            <div className="mb-6">
              <p className="text-text-secondary">
                Recipe ingredients that don't match any ingredient in your library. Link them to enable nutrition calculations.
              </p>
            </div>

            {matchingLoading ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-text-secondary">Scanning recipes...</p>
              </div>
            ) : unmatchedIngredients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48">
                <Check size={48} className="text-green-500 mb-4" />
                <p className="text-text text-lg font-medium">All recipe ingredients are matched!</p>
                <p className="text-text-secondary text-sm mt-1">Nutrition calculations will be accurate for all recipes.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unmatchedIngredients.map((item, idx) => (
                  <div key={idx} className="bg-surface border border-border rounded-lg p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text capitalize">{item.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Used in {item.count} recipe{item.count > 1 ? 's' : ''}
                        {item.recipeNames.length > 0 && `: ${item.recipeNames.slice(0, 3).join(', ')}${item.recipeNames.length > 3 ? '...' : ''}`}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {/* Quick-link: find best match from DB */}
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const dbIng = ingredients.find(i => i.id === e.target.value);
                          if (dbIng) handleLinkIngredient(item.name, dbIng);
                        }}
                        className="px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="" disabled>Link to...</option>
                        {ingredients
                          .filter(i => i.name.toLowerCase().includes(item.name.split(' ').pop()?.toLowerCase() || ''))
                          .slice(0, 10)
                          .map(i => (
                            <option key={i.id} value={i.id}>{i.name}</option>
                          ))}
                        {ingredients.length > 0 && <option disabled>──────────</option>}
                        {ingredients.map(i => (
                          <option key={`all-${i.id}`} value={i.id}>{i.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleCreateFromUnmatched(item.name)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
                      >
                        Create New
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ingredient={editingIngredient}
        onSave={handleSaveIngredient}
      />
    </div>
  );
}
