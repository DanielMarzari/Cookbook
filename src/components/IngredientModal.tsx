'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Search, Upload, Copy } from 'lucide-react';
import { Ingredient, NutritionInfo } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Tesseract from 'tesseract.js';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient?: Ingredient;
  onSave: (ingredient: Ingredient) => void;
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

export default function IngredientModal({
  isOpen,
  onClose,
  ingredient,
  onSave,
}: IngredientModalProps) {
  const [name, setName] = useState(ingredient?.name || '');
  const [brand, setBrand] = useState(ingredient?.brand || '');
  const [category, setCategory] = useState(ingredient?.category || 'Other');
  const [isCustom, setIsCustom] = useState(ingredient?.is_custom || false);
  const [fdcId, setFdcId] = useState(ingredient?.fdc_id || '');
  const [aliasesText, setAliasesText] = useState((ingredient?.aliases || []).join(', '));

  const [nutrition, setNutrition] = useState<NutritionInfo>(
    ingredient ? {
      calories: ingredient.calories_per_100g,
      protein: ingredient.protein_per_100g,
      carbs: ingredient.carbs_per_100g,
      fat: ingredient.fat_per_100g,
      fiber: ingredient.fiber_per_100g,
      sugar: ingredient.sugar_per_100g,
      sodium: ingredient.sodium_per_100g,
    } : {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }
  );

  // Sync form state when ingredient prop changes
  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setBrand(ingredient.brand || '');
      setCategory(ingredient.category);
      setIsCustom(ingredient.is_custom);
      setFdcId(ingredient.fdc_id || '');
      setAliasesText((ingredient.aliases || []).join(', '));
      setNutrition({
        calories: ingredient.calories_per_100g,
        protein: ingredient.protein_per_100g,
        carbs: ingredient.carbs_per_100g,
        fat: ingredient.fat_per_100g,
        fiber: ingredient.fiber_per_100g,
        sugar: ingredient.sugar_per_100g,
        sodium: ingredient.sodium_per_100g,
      });
    } else {
      // Reset for new ingredient
      setName('');
      setBrand('');
      setCategory('Other');
      setIsCustom(false);
      setFdcId('');
      setAliasesText('');
      setNutrition({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
    }
  }, [ingredient]);

  const [customNutrition, setCustomNutrition] = useState<NutritionInfo | undefined>(
    ingredient?.custom_nutrition as NutritionInfo | undefined
  );

  const [tab, setTab] = useState<'form' | 'usda' | 'scan'>('form');
  const [usda_results, setUSDAResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNutritionChange = (field: keyof NutritionInfo, value: string) => {
    const numValue = parseFloat(value) || 0;
    setNutrition(prev => ({ ...prev, [field]: numValue }));
  };

  const searchUSDA = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/nutrition/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setUSDAResults(data || []);
    } catch (error) {
      console.error('USDA search error:', error);
      alert('Failed to search USDA database');
    } finally {
      setLoading(false);
    }
  };

  const selectUSDAResult = async (result: any) => {
    try {
      const response = await fetch(`/api/nutrition/${result.fdcId}`);
      const detailedData = await response.json();

      if (detailedData) {
        setFdcId(detailedData.fdcId);
        setName(name || detailedData.description);
        setNutrition(detailedData.nutrition);
      }
      setTab('form');
    } catch (error) {
      console.error('Failed to get USDA details:', error);
      alert('Failed to load nutrition data');
    }
  };

  const scanLabel = async (file: File) => {
    if (!file) return;

    setScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;

        const { data: { text } } = await Tesseract.recognize(
          imageData,
          'eng',
          { logger: () => {} }
        );

        // Parse nutrition values from OCR text
        const parsedNutrition = parseNutritionFromText(text);
        setCustomNutrition(parsedNutrition);
        setTab('form');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('OCR error:', error);
      alert('Failed to scan image');
    } finally {
      setScanning(false);
    }
  };

  const parseNutritionFromText = (text: string): NutritionInfo => {
    const patterns = {
      calories: /(?:calories?|cal|energy)[\s:]*(\d+(?:\.\d+)?)/i,
      protein: /(?:protein)[\s:]*(\d+(?:\.\d+)?)/i,
      carbs: /(?:carbohydrates?|carbs|total carbs)[\s:]*(\d+(?:\.\d+)?)/i,
      fat: /(?:total fat|fat)[\s:]*(\d+(?:\.\d+)?)/i,
      fiber: /(?:dietary fiber|fiber)[\s:]*(\d+(?:\.\d+)?)/i,
      sugar: /(?:sugars?)[\s:]*(\d+(?:\.\d+)?)/i,
      sodium: /(?:sodium)[\s:]*(\d+(?:\.\d+)?)/i,
    };

    const extracted = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      if (match) {
        extracted[key as keyof NutritionInfo] = parseFloat(match[1]);
      }
    });

    return extracted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category) {
      alert('Please fill in name and category');
      return;
    }

    const newIngredient: Ingredient = {
      id: ingredient?.id || crypto.randomUUID(),
      name: name.trim(),
      brand: brand.trim() || undefined,
      category,
      calories_per_100g: nutrition.calories,
      protein_per_100g: nutrition.protein,
      carbs_per_100g: nutrition.carbs,
      fat_per_100g: nutrition.fat,
      fiber_per_100g: nutrition.fiber,
      sugar_per_100g: nutrition.sugar,
      sodium_per_100g: nutrition.sodium,
      custom_nutrition: customNutrition,
      fdc_id: fdcId || undefined,
      aliases: aliasesText ? aliasesText.split(',').map(a => a.trim()).filter(Boolean) : [],
      is_custom: isCustom,
      created_at: ingredient?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // Use Supabase to save/update ingredient
      const { data, error } = await supabase
        .from('ingredients')
        .upsert([newIngredient], { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;

      onSave(data);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save ingredient');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-warm-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface">
          <h2 className="text-2xl font-bold text-primary">
            {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setTab('form')}
              className={`px-4 py-2 font-medium transition-colors ${
                tab === 'form'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setTab('usda')}
              className={`px-4 py-2 font-medium transition-colors ${
                tab === 'usda'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              Look Up USDA
            </button>
            <button
              onClick={() => setTab('scan')}
              className={`px-4 py-2 font-medium transition-colors ${
                tab === 'scan'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              Scan Label
            </button>
          </div>

          {/* Form Tab */}
          {tab === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Also Known As
                </label>
                <input
                  type="text"
                  value={aliasesText}
                  onChange={(e) => setAliasesText(e.target.value)}
                  placeholder="e.g. confectioners sugar, powdered sugar"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <p className="text-xs text-text-secondary mt-1">Comma-separated alternate names for matching</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustom}
                      onChange={(e) => setIsCustom(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium text-text">Custom Source</span>
                  </label>
                </div>
              </div>

              {/* Nutrition Info */}
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-semibold text-text mb-4">Nutrition per 100g</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(nutrition).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-text-secondary mb-1 capitalize">
                        {key === 'carbs' ? 'Carbs' : key}
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleNutritionChange(key as keyof NutritionInfo, e.target.value)}
                        step="0.1"
                        className="w-full px-2 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-border rounded-lg font-medium text-text hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          )}

          {/* USDA Tab */}
          {tab === 'usda' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUSDA()}
                  placeholder="Search USDA database..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={searchUSDA}
                  disabled={loading}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Search size={18} />
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {usda_results.length === 0 && searchQuery && !loading && (
                  <p className="text-text-secondary text-sm">No results found. Try a different search.</p>
                )}
                {usda_results.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectUSDAResult(result)}
                    className="p-3 border border-border rounded-lg hover:bg-background cursor-pointer transition-colors"
                  >
                    <p className="font-medium text-text text-sm">{result.description}</p>
                    <p className="text-xs text-text-secondary mt-1">{result.foodCategory}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan Tab */}
          {tab === 'scan' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && scanLabel(e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={scanning}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Upload size={20} />
                  {scanning ? 'Scanning...' : 'Upload Nutrition Label'}
                </button>
                <p className="text-text-secondary text-sm mt-4">
                  Upload a clear photo of the nutrition label from your ingredient package
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
