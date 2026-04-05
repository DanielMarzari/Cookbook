import { create } from 'zustand';
import { Recipe, GroceryList, Collection, RecipeFilters } from './types';

interface CookbookStore {
  // Recipes
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  setRecipes: (recipes: Recipe[]) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;

  // Filters
  filters: RecipeFilters;
  setFilters: (filters: Partial<RecipeFilters>) => void;
  resetFilters: () => void;

  // Grocery lists
  groceryLists: GroceryList[];
  activeGroceryList: GroceryList | null;
  setGroceryLists: (lists: GroceryList[]) => void;
  setActiveGroceryList: (list: GroceryList | null) => void;

  // Collections
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: 'recipes' | 'add-recipe' | 'techniques' | 'grocery' | 'collections';
  setActiveView: (view: 'recipes' | 'add-recipe' | 'techniques' | 'grocery' | 'collections') => void;
}

const defaultFilters: RecipeFilters = {
  search: '',
  cuisine: null,
  dietary: [],
  difficulty: null,
  maxTime: null,
};

export const useCookbookStore = create<CookbookStore>((set) => ({
  // Recipes
  recipes: [],
  selectedRecipe: null,
  setRecipes: (recipes) => set({ recipes }),
  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

  // Filters
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),

  // Grocery lists
  groceryLists: [],
  activeGroceryList: null,
  setGroceryLists: (lists) => set({ groceryLists: lists }),
  setActiveGroceryList: (list) => set({ activeGroceryList: list }),

  // Collections
  collections: [],
  setCollections: (collections) => set({ collections }),

  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeView: 'recipes',
  setActiveView: (view) => set({ activeView: view }),
}));
