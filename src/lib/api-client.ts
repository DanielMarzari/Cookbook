import {
  Recipe,
  RecipeIngredient,
  Ingredient,
  Tag,
  Collection,
  GroceryList,
  GroceryListItem,
  Technique,
  UserTechniqueSkill,
  RecipeTag,
  CookLog,
  MealPlanEntry,
  RecipePhoto
} from './types';

// Meal plan entry joined with its recipe's title/image (as returned by GET /api/meal-plan).
export type MealPlanEntryWithRecipe = MealPlanEntry & {
  recipe_title: string | null;
  recipe_image_url: string | null;
};

interface FetchOptions {
  method?: string;
  body?: any;
}

async function fetchJson<T>(url: string, options?: FetchOptions): Promise<T> {
  const response = await fetch(url, {
    method: options?.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${error}`);
  }

  return response.json();
}

export const api = {
  recipes: {
    list: (filters?: any) => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.cuisine) params.append('cuisine', filters.cuisine);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.maxTime) params.append('maxTime', filters.maxTime);
      const queryString = params.toString();
      return fetchJson<Recipe[]>(`/api/recipes${queryString ? '?' + queryString : ''}`);
    },
    get: (id: string) => fetchJson<Recipe>(`/api/recipes/${id}`),
    create: (data: Partial<Recipe>) => fetchJson<Recipe>('/api/recipes', { method: 'POST', body: data }),
    update: (id: string, data: Partial<Recipe>) => fetchJson<Recipe>(`/api/recipes/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/recipes/${id}`, { method: 'DELETE' }),
  },

  flavor: {
    wheel: () =>
      fetchJson<{
        categories: { name: string; count: number }[];
        ingredients: { id: number; name: string; category: string }[];
      }>('/api/flavor/wheel'),
    pairings: (id: number) =>
      fetchJson<{
        id: number;
        name: string;
        category: string;
        pairings: { id: number; name: string; category: string; shared: number; strength: number; notes: string[] }[];
      }>(`/api/flavor/pairings?id=${id}`),
    pairingsByName: (name: string) =>
      fetchJson<{
        id: number;
        name: string;
        category: string;
        pairings: { id: number; name: string; category: string; shared: number; strength: number; notes: string[] }[];
      }>(`/api/flavor/pairings?name=${encodeURIComponent(name)}`),
    notesList: () =>
      fetchJson<{
        families: string[];
        vocabulary: Record<string, string[]>;
        ingredients: { id: number; name: string; category: string }[];
      }>('/api/flavor/notes'),
    profile: (id: number) =>
      fetchJson<{
        id: number;
        name: string;
        category: string;
        activeNotes: number;
        families: { name: string; notes: { note: string; intensity: number }[] }[];
        strongest: { note: string; family: string; intensity: number }[];
      }>(`/api/flavor/notes?id=${id}`),
    harmonies: (id: number) =>
      fetchJson<{
        base: { id: number; name: string; category: string };
        baseNotes: { note: string; family: string; intensity: number }[];
        partners: { name: string; category: string; synergy: number; shared: number; dominantFamily: string | null; bridgeFamily: string | null }[];
        insightFamilies: string[];
      }>(`/api/flavor/harmonies?id=${id}`),
    compare: (a: string, b: string) =>
      fetchJson<{
        a: { id: number; name: string; category: string; activeNotes: number; families: { name: string; notes: { note: string; intensity: number }[] }[] };
        b: { id: number; name: string; category: string; activeNotes: number; families: { name: string; notes: { note: string; intensity: number }[] }[] };
        facets: { family: string; a: number; b: number }[];
        synergy: number;
        sharedCompounds: number;
        compoundNotes: string[];
        bridging: { note: string; family: string; intensity: number }[];
      }>(`/api/flavor/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`),
    lab: (ids: number[]) =>
      fetchJson<{
        members: { id: number; name: string }[];
        inNetwork: number;
        merged: { families: { name: string; notes: { note: string; intensity: number }[] }[]; activeNotes: number; strongest: { note: string; family: string; intensity: number }[] };
        harmony: number;
        affinity: number;
        tightestPairs: { a: string; b: string; harmony: number }[];
        harmonyAdds: { name: string; noteId: number | null; fit: number; family: string | null }[];
        affinityAdds: { name: string; noteId: number | null; fit: number; family: string | null }[];
      }>('/api/flavor/lab', { method: 'POST', body: { ids } }),
    recipesForIngredient: (id: number) =>
      fetchJson<{ recipes: { id: string; title: string; image_url: string | null; cuisine: string | null }[] }>(`/api/flavor/recipes-for-ingredient?id=${id}`),
    relationship: (a: string, b: string) =>
      fetchJson<{
        a: { id: number; name: string; category: string; activeNotes: number; families: { name: string; notes: { note: string; intensity: number }[] }[] };
        b: { id: number; name: string; category: string; activeNotes: number; families: { name: string; notes: { note: string; intensity: number }[] }[] };
        affinity: number;
        sharedCompounds: number;
        compoundNotes: string[];
        harmony: number;
        proven: boolean;
        cooccur: number | null;
        bridges: { noteA: string; noteB: string; familyA: string; familyB: string; strength: number }[];
        complement: number;
        muddyRisk: boolean;
        complementWhy: string;
        facets: { family: string; a: number; b: number }[];
        recipes: { id: string; title: string; image_url: string | null; cuisine: string | null }[];
      }>(`/api/flavor/relationship?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`),
    recipesForPair: (a: number, b: number) =>
      fetchJson<{
        a: { id: number; name: string };
        b: { id: number; name: string };
        recipes: { id: string; title: string; image_url: string | null; cuisine: string | null }[];
      }>(`/api/flavor/recipes-for-pair?a=${a}&b=${b}`),
    recipeHarmonyList: () =>
      fetchJson<{ recipes: { id: string; title: string; image_url: string | null; mapped: number }[] }>('/api/flavor/recipe-harmony'),
    recipeHarmony: (recipeId: string) =>
      fetchJson<{
        recipe: { id: string; title: string; cuisine: string | null; image_url: string | null };
        ingredients: string[];
        merged: { families: { name: string; notes: { note: string; intensity: number }[] }[]; activeNotes: number; strongest: { note: string; family: string; intensity: number }[] };
        harmony: number;
        tightestPairs: { a: string; b: string; synergy: number }[];
        boost: { name: string; lift: number } | null;
      }>(`/api/flavor/recipe-harmony?recipe_id=${encodeURIComponent(recipeId)}`),
  },

  books: {
    list: () =>
      fetchJson<{ id: string; title: string; author: string | null; format: string; filename: string; size_bytes: number; page_count: number | null; cover: string | null; created_at: string }[]>('/api/books'),
    get: (id: string) =>
      fetchJson<{ id: string; title: string; author: string | null; format: string; filename: string; size_bytes: number; page_count: number | null; cover: string | null; created_at: string }>(`/api/books/${id}`),
    delete: (id: string) => fetch(`/api/books/${id}`, { method: 'DELETE' }),
    setCover: (id: string, cover: string) => fetch(`/api/books/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cover }) }),
    fileUrl: (id: string) => `/api/books/${id}/file`,
  },

  farms: {
    states: () => fetchJson<{ states: { state: string; count: number }[] }>('/api/farms'),
    byState: (state: string) =>
      fetchJson<{
        state: string; detected: boolean;
        farms: { id: number; name: string; category: string; state: string; city: string | null; street: string | null; zip: string | null; phone: string | null; website: string | null; lat: number; lng: number }[];
        categories: { category: string; count: number }[];
      }>(`/api/farms?state=${encodeURIComponent(state)}`),
    near: (lat: number, lng: number) =>
      fetchJson<{
        state: string; detected: boolean;
        farms: { id: number; name: string; category: string; state: string; city: string | null; street: string | null; zip: string | null; phone: string | null; website: string | null; lat: number; lng: number }[];
        categories: { category: string; count: number }[];
      }>(`/api/farms?lat=${lat}&lng=${lng}`),
  },

  recipeIngredients: {
    list: (recipeId?: string) => {
      const params = recipeId ? `?recipe_id=${recipeId}` : '';
      return fetchJson<RecipeIngredient[]>(`/api/recipe-ingredients${params}`);
    },
    get: (id: string) => fetchJson<RecipeIngredient>(`/api/recipe-ingredients/${id}`),
    // Accepts a single ingredient or a batch; the route handles both shapes.
    create: (data: Partial<RecipeIngredient> | Partial<RecipeIngredient>[]) =>
      fetchJson<RecipeIngredient | RecipeIngredient[]>('/api/recipe-ingredients', { method: 'POST', body: data }),
    update: (id: string, data: Partial<RecipeIngredient>) => fetchJson<RecipeIngredient>(`/api/recipe-ingredients/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/recipe-ingredients/${id}`, { method: 'DELETE' }),
    deleteByRecipeId: (recipeId: string) => fetch(`/api/recipe-ingredients?recipe_id=${recipeId}`, { method: 'DELETE' }),
    // Point every recipe_ingredients row with a matching name at a library ingredient.
    linkByName: (name: string, ingredientId: string) =>
      fetchJson<{ success: boolean; updated: number }>('/api/recipe-ingredients', {
        method: 'PATCH',
        body: { name, ingredient_id: ingredientId },
      }),
  },

  ingredients: {
    list: () => fetchJson<Ingredient[]>('/api/ingredients'),
    get: (id: string) => fetchJson<Ingredient>(`/api/ingredients/${id}`),
    create: (data: Partial<Ingredient>) => fetchJson<Ingredient>('/api/ingredients', { method: 'POST', body: data }),
    update: (id: string, data: Partial<Ingredient>) => fetchJson<Ingredient>(`/api/ingredients/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/ingredients/${id}`, { method: 'DELETE' }),
  },

  tags: {
    list: () => fetchJson<Tag[]>('/api/tags'),
    get: (id: string) => fetchJson<Tag>(`/api/tags/${id}`),
    create: (data: Partial<Tag>) => fetchJson<Tag>('/api/tags', { method: 'POST', body: data }),
    update: (id: string, data: Partial<Tag>) => fetchJson<Tag>(`/api/tags/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/tags/${id}`, { method: 'DELETE' }),
  },

  recipeTags: {
    list: (recipeId?: string) => {
      const params = recipeId ? `?recipe_id=${recipeId}` : '';
      return fetchJson<RecipeTag[]>(`/api/recipe-tags${params}`);
    },
    create: (data: Partial<RecipeTag>) => fetchJson<RecipeTag>('/api/recipe-tags', { method: 'POST', body: data }),
    delete: (recipeId: string, tagId: string) => fetch(`/api/recipe-tags?recipe_id=${recipeId}&tag_id=${tagId}`, { method: 'DELETE' }),
  },

  collections: {
    list: () => fetchJson<Collection[]>('/api/collections'),
    get: (id: string) => fetchJson<Collection>(`/api/collections/${id}`),
    create: (data: Partial<Collection>) => fetchJson<Collection>('/api/collections', { method: 'POST', body: data }),
    update: (id: string, data: Partial<Collection>) => fetchJson<Collection>(`/api/collections/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/collections/${id}`, { method: 'DELETE' }),
  },

  collectionRecipes: {
    list: (collectionId?: string) => {
      const params = collectionId ? `?collection_id=${collectionId}` : '';
      return fetchJson<any[]>(`/api/collection-recipes${params}`);
    },
    create: (data: any) => fetchJson<any>('/api/collection-recipes', { method: 'POST', body: data }),
    delete: (collectionId: string, recipeId: string) => fetch(`/api/collection-recipes?collection_id=${collectionId}&recipe_id=${recipeId}`, { method: 'DELETE' }),
  },

  groceryLists: {
    list: () => fetchJson<GroceryList[]>('/api/grocery-lists'),
    get: (id: string) => fetchJson<GroceryList>(`/api/grocery-lists/${id}`),
    create: (data: Partial<GroceryList>) => fetchJson<GroceryList>('/api/grocery-lists', { method: 'POST', body: data }),
    update: (id: string, data: Partial<GroceryList>) => fetchJson<GroceryList>(`/api/grocery-lists/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/grocery-lists/${id}`, { method: 'DELETE' }),
  },

  groceryListItems: {
    list: (listId?: string) => {
      const params = listId ? `?list_id=${listId}` : '';
      return fetchJson<GroceryListItem[]>(`/api/grocery-list-items${params}`);
    },
    get: (id: string) => fetchJson<GroceryListItem>(`/api/grocery-list-items/${id}`),
    create: (data: Partial<GroceryListItem>) => fetchJson<GroceryListItem>('/api/grocery-list-items', { method: 'POST', body: data }),
    update: (id: string, data: Partial<GroceryListItem>) => fetchJson<GroceryListItem>(`/api/grocery-list-items/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/grocery-list-items/${id}`, { method: 'DELETE' }),
  },

  techniques: {
    list: () => fetchJson<Technique[]>('/api/techniques'),
    get: (slug: string) => fetchJson<Technique>(`/api/techniques/${slug}`),
    create: (data: Partial<Technique>) => fetchJson<Technique>('/api/techniques', { method: 'POST', body: data }),
    update: (id: string, data: Partial<Technique>) => fetchJson<Technique>(`/api/techniques/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/techniques/${id}`, { method: 'DELETE' }),
  },

  recipePhotos: {
    list: (recipeId: string) => fetchJson<RecipePhoto[]>(`/api/recipe-photos?recipe_id=${recipeId}`),
    create: (data: { recipe_id: string; url: string; sort_order?: number }) =>
      fetchJson<RecipePhoto>('/api/recipe-photos', { method: 'POST', body: data }),
    delete: (id: string) => fetch(`/api/recipe-photos?id=${id}`, { method: 'DELETE' }),
  },

  cookLogs: {
    list: (recipeId?: string) => {
      const params = recipeId ? `?recipe_id=${recipeId}` : '';
      return fetchJson<CookLog[]>(`/api/cook-logs${params}`);
    },
    create: (data: Partial<CookLog>) => fetchJson<CookLog>('/api/cook-logs', { method: 'POST', body: data }),
    delete: (id: string) => fetch(`/api/cook-logs?id=${id}`, { method: 'DELETE' }),
  },

  mealPlan: {
    list: (start?: string, end?: string) => {
      const params = start && end ? `?start=${start}&end=${end}` : '';
      return fetchJson<MealPlanEntryWithRecipe[]>(`/api/meal-plan${params}`);
    },
    create: (data: Partial<MealPlanEntry>) => fetchJson<MealPlanEntry>('/api/meal-plan', { method: 'POST', body: data }),
    delete: (id: string) => fetch(`/api/meal-plan?id=${id}`, { method: 'DELETE' }),
  },

  userTechniqueSkills: {
    list: () => fetchJson<UserTechniqueSkill[]>('/api/user-technique-skills'),
    get: (id: string) => fetchJson<UserTechniqueSkill>(`/api/user-technique-skills/${id}`),
    getByTechnique: (techniqueId: string) => fetchJson<UserTechniqueSkill>(`/api/user-technique-skills?technique_id=${techniqueId}`),
    create: (data: Partial<UserTechniqueSkill>) => fetchJson<UserTechniqueSkill>('/api/user-technique-skills', { method: 'POST', body: data }),
    update: (id: string, data: Partial<UserTechniqueSkill>) => fetchJson<UserTechniqueSkill>(`/api/user-technique-skills/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/user-technique-skills/${id}`, { method: 'DELETE' }),
  },
};
