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
  RecipeTag
} from './types';

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

  recipeIngredients: {
    list: (recipeId?: string) => {
      const params = recipeId ? `?recipe_id=${recipeId}` : '';
      return fetchJson<RecipeIngredient[]>(`/api/recipe-ingredients${params}`);
    },
    get: (id: string) => fetchJson<RecipeIngredient>(`/api/recipe-ingredients/${id}`),
    create: (data: Partial<RecipeIngredient>) => fetchJson<RecipeIngredient>('/api/recipe-ingredients', { method: 'POST', body: data }),
    update: (id: string, data: Partial<RecipeIngredient>) => fetchJson<RecipeIngredient>(`/api/recipe-ingredients/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/recipe-ingredients/${id}`, { method: 'DELETE' }),
    deleteByRecipeId: (recipeId: string) => fetch(`/api/recipe-ingredients?recipe_id=${recipeId}`, { method: 'DELETE' }),
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

  userTechniqueSkills: {
    list: () => fetchJson<UserTechniqueSkill[]>('/api/user-technique-skills'),
    get: (id: string) => fetchJson<UserTechniqueSkill>(`/api/user-technique-skills/${id}`),
    getByTechnique: (techniqueId: string) => fetchJson<UserTechniqueSkill>(`/api/user-technique-skills?technique_id=${techniqueId}`),
    create: (data: Partial<UserTechniqueSkill>) => fetchJson<UserTechniqueSkill>('/api/user-technique-skills', { method: 'POST', body: data }),
    update: (id: string, data: Partial<UserTechniqueSkill>) => fetchJson<UserTechniqueSkill>(`/api/user-technique-skills/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => fetch(`/api/user-technique-skills/${id}`, { method: 'DELETE' }),
  },
};
