'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Leaf } from 'lucide-react';
import { Ingredient } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import IngredientModal from '@/components/IngredientModal';

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

        {/* Search and Filter */}
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
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
                        {/* Header */}
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

                        {/* Badge */}
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

                        {/* Nutrition Summary */}
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

                        {/* Actions */}
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
