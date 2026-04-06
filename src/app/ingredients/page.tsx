'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Leaf, Link2, AlertCircle, Check, Download, Loader } from 'lucide-react';
import { Ingredient } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { titleCaseIngredient } from '@/lib/utils';
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
  'Extracts & Flavorings',
  'Produce',
  'Fruits',
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
  'Alcohol',
  'Snacks',
  'Other',
];

const CATEGORY_EMOJIS: Record<string, string> = {
  'Pantry': '🧂',
  'Aromatics': '🧄',
  'Herbs & Spices': '🌿',
  'Extracts & Flavorings': '🧪',
  'Produce': '🥬',
  'Fruits': '🍎',
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
  'Alcohol': '🍷',
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

      // Get all DB ingredient names + aliases (lowercase for comparison)
      const dbNames = new Set<string>();
      for (const i of ingredients) {
        dbNames.add(i.name.toLowerCase());
        if (i.aliases) {
          for (const alias of i.aliases) {
            dbNames.add(alias.toLowerCase());
          }
        }
      }

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

  const [importingUsda, setImportingUsda] = useState<string | null>(null);

  const handleCreateFromUnmatched = (name: string) => {
    // Open modal with name pre-filled
    setEditingIngredient({ name, category: 'Other' } as any);
    setIsModalOpen(true);
  };

  // Track which unmatched name triggered the USDA import so we can link after save
  const [pendingUsdaLink, setPendingUsdaLink] = useState<string | null>(null);

  const USDA_CATEGORY_MAP: Record<string, string> = {
    'Dairy and Egg Products': 'Dairy',
    'Spices and Herbs': 'Herbs & Spices',
    'Fats and Oils': 'Oils & Fats',
    'Poultry Products': 'Proteins',
    'Beef Products': 'Proteins',
    'Pork Products': 'Proteins',
    'Sausages and Luncheon Meats': 'Proteins',
    'Finfish and Shellfish Products': 'Proteins',
    'Lamb, Veal, and Game Products': 'Proteins',
    'Vegetables and Vegetable Products': 'Produce',
    'Fruits and Fruit Juices': 'Fruits',
    'Nut and Seed Products': 'Pantry',
    'Legumes and Legume Products': 'Pantry',
    'Grain Products': 'Grains & Carbs',
    'Cereal Grains and Pasta': 'Grains & Carbs',
    'Baked Products': 'Baking',
    'Beverages': 'Beverages',
    'Sweets': 'Baking',
    'Soups, Sauces, and Gravies': 'Sauces',
    'Snacks': 'Snacks',
  };

  const refineCategoryByName = (baseCategory: string, ingredientName: string): string => {
    const lowerName = ingredientName.toLowerCase();
    if (/\b(extract|vanilla|almond extract|peppermint|flavoring|syrup|molasses|maple syrup|honey|agave)\b/.test(lowerName)) {
      return 'Extracts & Flavorings';
    }
    if (/\b(wine|beer|rum|bourbon|whiskey|vodka|brandy|liqueur|champagne|sake|mirin|sherry|port|marsala|amaretto|kahlua|cointreau|liquor)\b/.test(lowerName)) {
      return 'Alcohol';
    }
    return baseCategory;
  };

  const handleImportFromUsda = async (unmatchedName: string) => {
    setImportingUsda(unmatchedName);
    try {
      const res = await fetch(`/api/nutrition/search?query=${encodeURIComponent(unmatchedName)}`);
      const results = await res.json();

      if (!results || results.length === 0 || results.error) {
        handleCreateFromUnmatched(unmatchedName);
        return;
      }

      const best = results[0];
      const nutrition = best.nutrition;
      const baseCategory = USDA_CATEGORY_MAP[best.foodCategory] || 'Other';
      const finalCategory = refineCategoryByName(baseCategory, unmatchedName);

      // Open modal with USDA data pre-filled so user can review & edit
      setPendingUsdaLink(unmatchedName);
      setEditingIngredient({
        name: titleCaseIngredient(unmatchedName),
        category: finalCategory,
        calories_per_100g: Math.round(nutrition.calories * 10) / 10,
        protein_per_100g: Math.round(nutrition.protein * 10) / 10,
        carbs_per_100g: Math.round(nutrition.carbs * 10) / 10,
        fat_per_100g: Math.round(nutrition.fat * 10) / 10,
        fiber_per_100g: Math.round(nutrition.fiber * 10) / 10,
        sugar_per_100g: Math.round(nutrition.sugar * 10) / 10,
        sodium_per_100g: Math.round(nutrition.sodium * 10) / 10,
        fdc_id: String(best.fdcId),
        is_custom: false,
      } as any);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error searching USDA:', error);
      handleCreateFromUnmatched(unmatchedName);
    } finally {
      setImportingUsda(null);
    }
  };

  const handleLinkIngredient = async (unmatchedName: string, dbIngredient: Ingredient) => {
    // Update all recipe_ingredients with this name to link to the DB ingredient
    try {
      const { error } = await supabase
        .from('recipe_ingredients')
        .update({ ingredient_id: dbIngredient.id })
        .ilike('name', unmatchedName);

      if (error) throw error;

      // Save the unmatched name as an alias on the DB ingredient (if different)
      const lowerName = unmatchedName.toLowerCase().trim();
      const lowerDbName = dbIngredient.name.toLowerCase().trim();
      if (lowerName !== lowerDbName) {
        const currentAliases = dbIngredient.aliases || [];
        if (!currentAliases.some(a => a.toLowerCase() === lowerName)) {
          const newAliases = [...currentAliases, unmatchedName.trim()];
          await supabase
            .from('ingredients')
            .update({ aliases: newAliases })
            .eq('id', dbIngredient.id);

          // Update local state
          setIngredients(prev => prev.map(i =>
            i.id === dbIngredient.id ? { ...i, aliases: newAliases } : i
          ));
        }
      }

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

  const handleSaveIngredient = async (ingredient: Ingredient) => {
    const existing = ingredients.find(i => i.id === ingredient.id);
    if (existing) {
      setIngredients(ingredients.map(i => (i.id === ingredient.id ? ingredient : i)));
    } else {
      setIngredients([...ingredients, ingredient]);
    }

    // If this was from a USDA import, auto-link the recipe_ingredients
    if (pendingUsdaLink) {
      try {
        await supabase
          .from('recipe_ingredients')
          .update({ ingredient_id: ingredient.id })
          .ilike('name', pendingUsdaLink);

        // Also save alias if names differ
        const lowerLink = pendingUsdaLink.toLowerCase().trim();
        const lowerIng = ingredient.name.toLowerCase().trim();
        if (lowerLink !== lowerIng) {
          const currentAliases = ingredient.aliases || [];
          if (!currentAliases.some(a => a.toLowerCase() === lowerLink)) {
            await supabase
              .from('ingredients')
              .update({ aliases: [...currentAliases, pendingUsdaLink.trim()] })
              .eq('id', ingredient.id);
          }
        }

        setUnmatchedIngredients(prev => prev.filter(u => u.name.toLowerCase() !== pendingUsdaLink.toLowerCase()));
      } catch (error) {
        console.error('Error linking USDA ingredient:', error);
      }
      setPendingUsdaLink(null);
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
                                    {titleCaseIngredient(ingredient.name)}
                                  </h3>
                                  {ingredient.brand && (
                                    <p className="text-sm text-text-secondary">{ingredient.brand}</p>
                                  )}
                                </div>
                              </div>
                            </div>


                            {ingredient.calories_per_100g != null && (
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
                                  {(ingredient.protein_per_100g ?? 0).toFixed(1)}g
                                </p>
                              </div>
                              <div className="bg-background p-2 rounded">
                                <p className="text-text-secondary font-medium">Carbs</p>
                                <p className="text-text font-bold">
                                  {(ingredient.carbs_per_100g ?? 0).toFixed(1)}g
                                </p>
                              </div>
                              <div className="bg-background p-2 rounded">
                                <p className="text-text-secondary font-medium">Fat</p>
                                <p className="text-text font-bold">
                                  {(ingredient.fat_per_100g ?? 0).toFixed(1)}g
                                </p>
                              </div>
                            </div>
                            )}

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
                {unmatchedIngredients.map((item) => (
                  <div key={item.name} className="bg-surface border border-border rounded-lg p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text">{titleCaseIngredient(item.name)}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Used in {item.count} recipe{item.count > 1 ? 's' : ''}
                        {item.recipeNames.length > 0 && `: ${item.recipeNames.slice(0, 3).join(', ')}${item.recipeNames.length > 3 ? '...' : ''}`}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {/* Quick-link: find best match from DB */}
                      <select
                        key={item.name}
                        value=""
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
                        onClick={() => handleImportFromUsda(item.name)}
                        disabled={importingUsda === item.name}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 flex items-center gap-1"
                        title="Search USDA and auto-import with nutrition data"
                      >
                        {importingUsda === item.name ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        USDA
                      </button>
                      <button
                        onClick={() => handleCreateFromUnmatched(item.name)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
                      >
                        Manual
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
