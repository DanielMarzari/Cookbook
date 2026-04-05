'use client';

import { useState, useRef } from 'react';
import { Upload, Plus, X, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeIngredient, Tag } from '@/lib/types';

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
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    notes: string;
  }>;
  instructions: Array<{
    text: string;
    timer_minutes?: number;
    timer_label?: string;
  }>;
}

const CUISINES = [
  'Italian',
  'Japanese',
  'Mexican',
  'French',
  'Chinese',
  'Indian',
  'Thai',
  'Mediterranean',
  'American',
  'Korean',
];

const UNITS = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'piece'];

export default function AddRecipePage() {
  const [activeTab, setActiveTab] = useState<'manual' | 'url' | 'image'>(
    'manual'
  );
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importedData, setImportedData] = useState<Partial<FormRecipe> | null>(
    null
  );
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
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
        setActiveTab('manual');
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
        .filter((ing) => ing.name.trim())
        .map((ing, idx) => ({
          recipe_id: recipeData.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          notes: ing.notes,
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

      alert('Recipe saved successfully!');
      setFormData({
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
      setImportedData(null);
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
                  <input
                    type="number"
                    name="prep_time_minutes"
                    placeholder="Prep Time (min)"
                    value={formData.prep_time_minutes}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    name="cook_time_minutes"
                    placeholder="Cook Time (min)"
                    value={formData.cook_time_minutes}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    name="servings"
                    placeholder="Servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
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
                {formData.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(idx, 'name', e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={ing.quantity}
                      onChange={(e) =>
                        updateIngredient(idx, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      className="w-20 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(idx, 'unit', e.target.value)
                      }
                      className="w-24 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                ))}
              </div>

              <button
                onClick={addIngredient}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Ingredient
              </button>
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
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    Recipe imported! Click the Manual Entry tab to edit and save.
                  </p>
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
