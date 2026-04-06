'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, X, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeIngredient, Tag } from '@/lib/types';
import { toFraction } from '@/lib/utils';

interface FormIngredientItem {
  name: string;
  quantity: number;
  unit: string;
  notes: string;
  is_header?: boolean;  // Section header like "For the Dough"
  is_or?: boolean;      // OR divider between alternatives
}

interface FormRecipe {
  title: string;
  description: string;
  cuisine_type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  image_url: string;
  source_url: string;
  source_name: string;
  source_author: string;
  ingredients: FormIngredientItem[];
  instructions: Array<{
    text: string;
    timer_minutes?: number;
    timer_label?: string;
  }>;
}

const CUISINES = [
  'American', 'Brazilian', 'Caribbean', 'Chinese', 'Ethiopian',
  'Filipino', 'French', 'German', 'Greek', 'Indian',
  'Italian', 'Japanese', 'Jewish', 'Korean', 'Lebanese',
  'Mediterranean', 'Mexican', 'Moroccan', 'Persian', 'Polish',
  'Southern', 'Spanish', 'Thai', 'Turkish', 'Vietnamese',
  'Other',
];

const UNITS = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'piece', 'stick', 'clove', 'slice', 'can', 'pinch', 'dash', 'sprig', 'bunch', 'head', 'stalk', 'package', 'bag', 'large', 'medium', 'small'];


export default function AddRecipePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'manual' | 'url' | 'image'>(
    'manual'
  );
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importedData, setImportedData] = useState<Partial<FormRecipe> | null>(
    null
  );
  const [importedImages, setImportedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormRecipe>({
    title: '',
    description: '',
    cuisine_type: 'Italian',
    difficulty: 'medium',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 4,
    image_url: '',
    source_url: '',
    source_name: '',
    source_author: '',
    ingredients: [{ name: '', quantity: 0, unit: 'g', notes: '' }],
    instructions: [{ text: '', timer_minutes: undefined, timer_label: '' }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'prep_time_minutes' ||
        name === 'cook_time_minutes' ||
        name === 'servings'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const addSectionHeader = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: '', quantity: 0, unit: '', notes: '', is_header: true },
      ],
    }));
  };

  const addOrDivider = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: 'OR', quantity: 0, unit: '', notes: '', is_or: true },
      ],
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: '', quantity: 0, unit: 'g', notes: '' },
      ],
    }));
  };

  const updateIngredient = (
    idx: number,
    field: keyof FormRecipe['ingredients'][0],
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === idx ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const removeIngredient = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx),
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { text: '', timer_minutes: undefined, timer_label: '' },
      ],
    }));
  };

  const updateInstruction = (
    idx: number,
    field: keyof FormRecipe['instructions'][0],
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === idx ? { ...inst, [field]: value } : inst
      ),
    }));
  };

  const removeInstruction = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== idx),
    }));
  };

  const handleImportUrl = async () => {
    if (!importUrl.trim()) return;

    setImportLoading(true);
    try {
      const response = await fetch('/api/recipes/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setImportedData(data);
        // Store all images from the page for user selection
        if (data.all_images && data.all_images.length > 0) {
          setImportedImages(data.all_images);
        }
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
        // Don't auto-switch to manual — stay on URL tab to let user pick image
      } else {
        alert('Failed to import recipe: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to import URL: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImportLoading(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    try {
      const formDataForImage = new FormData();
      formDataForImage.append('image', file);

      const response = await fetch('/api/recipes/import-image', {
        method: 'POST',
        body: formDataForImage,
      });

      const data = await response.json();
      if (response.ok) {
        setImportedData(data);
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
        setActiveTab('manual');
      } else {
        alert('Failed to import image: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to import image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImportLoading(false);
    }
  };

  const generateAutoTags = async (): Promise<Tag[]> => {
    const tags: Tag[] = [];
    const ingredients = formData.ingredients.map((i) => i.name.toLowerCase());
    const title = formData.title.toLowerCase();

    const vegetarianIngredients = [
      'tofu',
      'tempeh',
      'chickpeas',
      'lentils',
      'beans',
    ];
    if (
      ingredients.some((ing) =>
        vegetarianIngredients.some((v) => ing.includes(v))
      ) &&
      !ingredients.some((ing) => ing.includes('meat'))
    ) {
      tags.push({
        id: 'auto-veg',
        name: 'Vegetarian',
        type: 'dietary',
        color: '#22c55e',
      });
    }

    if (title.includes('pasta')) {
      tags.push({
        id: 'auto-pasta',
        name: 'Pasta',
        type: 'cuisine',
        color: '#d97706',
      });
    }

    return tags;
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a recipe title');
      return;
    }

    setLoading(true);
    try {
      const autoTags = await generateAutoTags();

      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          cuisine_type: formData.cuisine_type,
          difficulty: formData.difficulty,
          prep_time_minutes: formData.prep_time_minutes,
          cook_time_minutes: formData.cook_time_minutes,
          total_time_minutes:
            formData.prep_time_minutes + formData.cook_time_minutes,
          servings: formData.servings,
          instructions: formData.instructions.map((inst, idx) => ({
            step_number: idx + 1,
            text: inst.text,
            timer_minutes: inst.timer_minutes,
            timer_label: inst.timer_label,
          })),
          source_url: formData.source_url,
          source_name: formData.source_name,
          source_author: formData.source_author,
          source_type: importedData ? 'url' : 'manual',
          is_favorite: false,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      const ingredientsWithRecipeId = formData.ingredients
        .filter((ing) => ing.name.trim() || ing.is_header || ing.is_or)
        .map((ing, idx) => ({
          recipe_id: recipeData.id,
          name: ing.is_header ? `--- ${ing.name} ---` : ing.is_or ? '---OR---' : ing.name,
          quantity: ing.is_header || ing.is_or ? 0 : ing.quantity,
          unit: ing.is_header || ing.is_or ? '' : ing.unit,
          notes: ing.is_header || ing.is_or ? '' : ing.notes,
          order_index: idx,
          ingredient_id: null,
        }));

      if (ingredientsWithRecipeId.length > 0) {
        const { error: ingredError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsWithRecipeId);

        if (ingredError) throw ingredError;
      }

      if (autoTags.length > 0) {
        const tagsWithRecipeId = autoTags.map((tag) => ({
          recipe_id: recipeData.id,
          tag_id: tag.id,
          auto_generated: true,
        }));

        const { error: tagError } = await supabase
          .from('recipe_tags')
          .insert(tagsWithRecipeId);

        if (tagError) console.error('Tag insertion error:', tagError);
      }

      router.push('/');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text mb-8">Add Recipe</h1>

        <div className="flex gap-2 mb-8 border-b border-border">
          {(['manual', 'url', 'image'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              {tab === 'manual' && 'Manual Entry'}
              {tab === 'url' && 'From URL'}
              {tab === 'image' && 'From Image'}
            </button>
          ))}
        </div>

        {activeTab === 'manual' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
              <h2 className="text-2xl font-bold text-text mb-4">
                Recipe Details
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Recipe Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="source_name"
                    placeholder="Source / Origin (optional)"
                    value={formData.source_name}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="source_author"
                    placeholder="Author (optional)"
                    value={formData.source_author}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="cuisine_type"
                    value={formData.cuisine_type}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {CUISINES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Prep Time (min)</label>
                    <input
                      type="number"
                      name="prep_time_minutes"
                      placeholder="15"
                      value={formData.prep_time_minutes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Cook Time (min)</label>
                    <input
                      type="number"
                      name="cook_time_minutes"
                      placeholder="30"
                      value={formData.cook_time_minutes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Servings</label>
                    <input
                      type="number"
                      name="servings"
                      placeholder="4"
                      value={formData.servings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <input
                  type="url"
                  name="image_url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <input
                  type="url"
                  name="source_url"
                  placeholder="Source URL (optional)"
                  value={formData.source_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
              <h2 className="text-2xl font-bold text-text mb-4">Ingredients</h2>

              <div className="space-y-3">
                {formData.ingredients.map((ing, idx) => {
                  // Section header
                  if (ing.is_header) {
                    return (
                      <div key={idx} className="flex items-center gap-2 pt-4 pb-1">
                        <div className="flex-1 border-t border-primary/30" />
                        <input
                          type="text"
                          placeholder="Section name (e.g. For the Dough)"
                          value={ing.name}
                          onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                          className="px-4 py-1.5 text-sm font-bold text-primary bg-primary/5 border border-primary/20 rounded-full text-center min-w-48 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex-1 border-t border-primary/30" />
                        <button
                          onClick={() => removeIngredient(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  }

                  // OR divider
                  if (ing.is_or) {
                    return (
                      <div key={idx} className="flex items-center gap-3 py-1">
                        <div className="flex-1 border-t border-orange-300" />
                        <span className="text-sm font-bold text-orange-500 tracking-wider">OR</span>
                        <div className="flex-1 border-t border-orange-300" />
                        <button
                          onClick={() => removeIngredient(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  }

                  // Normal ingredient row
                  return (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        value={ing.name}
                        onChange={(e) =>
                          updateIngredient(idx, 'name', e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="relative w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          step="0.01"
                          value={ing.quantity}
                          onChange={(e) =>
                            updateIngredient(idx, 'quantity', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {ing.quantity > 0 && ing.quantity % 1 !== 0 && (
                          <span className="absolute -top-2 right-1 text-xs font-semibold text-primary bg-surface px-1 rounded">
                            {toFraction(ing.quantity)}
                          </span>
                        )}
                      </div>
                      <select
                        value={UNITS.includes(ing.unit) ? ing.unit : 'piece'}
                        onChange={(e) =>
                          updateIngredient(idx, 'unit', e.target.value)
                        }
                        className="w-28 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Notes"
                        value={ing.notes}
                        onChange={(e) =>
                          updateIngredient(idx, 'notes', e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          onClick={() => removeIngredient(idx)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={addIngredient}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  Add Ingredient
                </button>
                <button
                  onClick={addSectionHeader}
                  className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-background rounded-lg transition-colors text-sm"
                >
                  + Section
                </button>
                <button
                  onClick={addOrDivider}
                  className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-sm"
                >
                  + OR
                </button>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
              <h2 className="text-2xl font-bold text-text mb-4">
                Instructions
              </h2>

              <div className="space-y-4">
                {formData.instructions.map((inst, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="font-semibold text-primary">
                        Step {idx + 1}
                      </span>
                      {formData.instructions.length > 1 && (
                        <button
                          onClick={() => removeInstruction(idx)}
                          className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <textarea
                      placeholder="Instruction text"
                      value={inst.text}
                      onChange={(e) =>
                        updateInstruction(idx, 'text', e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Timer (minutes)"
                        value={inst.timer_minutes || ''}
                        onChange={(e) =>
                          updateInstruction(
                            idx,
                            'timer_minutes',
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Timer label"
                        value={inst.timer_label || ''}
                        onChange={(e) =>
                          updateInstruction(idx, 'timer_label', e.target.value)
                        }
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addInstruction}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Step
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Recipe'
              )}
            </button>
          </div>
        )}

        {activeTab === 'url' && (
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-4">Import from URL</h2>

            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://example.com/recipe"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                onClick={handleImportUrl}
                disabled={importLoading || !importUrl.trim()}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Import Recipe'
                )}
              </button>

              {importedData && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      Recipe imported: {importedData.title}
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      {importedData.ingredients?.length || 0} ingredients, {importedData.instructions?.length || 0} steps found
                    </p>
                  </div>

                  {/* Image Picker */}
                  {importedImages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-3">Choose an image</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {importedImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setFormData(prev => ({ ...prev, image_url: imgUrl }))}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                              formData.image_url === imgUrl
                                ? 'border-primary shadow-warm-lg ring-2 ring-primary/30'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Option ${idx + 1}`}
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            {formData.image_url === imgUrl && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="mt-2 text-sm text-text-secondary hover:text-text transition-colors"
                      >
                        No image
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveTab('manual')}
                    className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Continue to Edit & Save
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-4">
              Import from Image
            </h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload size={40} className="mx-auto text-primary mb-2" />
              <p className="text-text-secondary">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-text-secondary mt-1">
                PNG, JPG, GIF up to 10MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {importedData && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">
                  Image processed! Click the Manual Entry tab to edit and save.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
