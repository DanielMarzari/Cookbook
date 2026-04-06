'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  ChefHat,
  Package,
} from 'lucide-react';
import { GroceryList, GroceryListItem, Recipe } from '@/lib/types';
import { api } from '@/lib/api-client';

const categoryColors: Record<string, string> = {
  produce: 'bg-green-100 text-green-800',
  dairy: 'bg-blue-100 text-blue-800',
  meat: 'bg-red-100 text-red-800',
  pantry: 'bg-yellow-100 text-yellow-800',
  frozen: 'bg-cyan-100 text-cyan-800',
  condiments: 'bg-purple-100 text-purple-800',
  beverages: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function GroceryPage() {
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [listItems, setListItems] = useState<GroceryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddFromRecipeModal, setShowAddFromRecipeModal] = useState(false);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: '',
    quantity: 1,
    unit: 'pieces',
    category: 'other',
  });
  const [recipes, setRecipes] = useState<Pick<Recipe, 'id' | 'title'>[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');

  // Fetch grocery lists and items
  useEffect(() => {
    fetchGroceryLists();
  }, []);

  useEffect(() => {
    if (activeListId) {
      fetchListItems(activeListId);
    }
  }, [activeListId]);

  const fetchGroceryLists = async () => {
    try {
      const lists = await api.groceryLists.list();
      setGroceryLists(lists || []);
      if (lists && lists.length > 0 && !activeListId) {
        setActiveListId(lists[0].id);
      }
    } catch (err) {
      console.error('Error fetching lists:', err);
      setError('Failed to load grocery lists');
    } finally {
      setLoading(false);
    }
  };

  const fetchListItems = async (listId: string) => {
    try {
      const data = await api.groceryListItems.list(listId);
      setListItems(data || []);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const fetchRecipes = async () => {
    try {
      const data = await api.recipes.list();
      setRecipes(data?.map(r => ({ id: r.id, title: r.title })) || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) return;

    try {
      const data = await api.groceryLists.create({ name: newListName });
      setGroceryLists([data, ...groceryLists]);
      setActiveListId(data.id);
      setNewListName('');
      setShowNewListModal(false);
    } catch (err) {
      console.error('Error creating list:', err);
    }
  };

  const addItem = async () => {
    if (!activeListId || !itemForm.name.trim()) return;

    try {
      const data = await api.groceryListItems.create({
        list_id: activeListId,
        name: itemForm.name,
        quantity: itemForm.quantity,
        unit: itemForm.unit,
        category: itemForm.category,
        checked: false,
      });

      setListItems([...listItems, data]);
      setItemForm({
        name: '',
        quantity: 1,
        unit: 'pieces',
        category: 'other',
      });
      setShowAddItemModal(false);
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const toggleItemChecked = async (itemId: string, checked: boolean) => {
    try {
      await api.groceryListItems.update(itemId, { checked: !checked });

      setListItems(
        listItems.map((item) =>
          item.id === itemId ? { ...item, checked: !checked } : item
        )
      );
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await api.groceryListItems.delete(itemId);
      setListItems(listItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const clearCheckedItems = async () => {
    const checkedItems = listItems.filter((item) => item.checked);
    if (checkedItems.length === 0) return;

    try {
      for (const item of checkedItems) {
        await api.groceryListItems.delete(item.id);
      }
      setListItems(listItems.filter((item) => !item.checked));
    } catch (err) {
      console.error('Error clearing items:', err);
    }
  };

  const groupItemsByCategory = () => {
    const grouped: Record<string, GroceryListItem[]> = {};
    const uncheckedItems = listItems.filter((item) => !item.checked);
    const checkedItems = listItems.filter((item) => item.checked);

    uncheckedItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    return { grouped, checkedItems };
  };

  const { grouped, checkedItems } = groupItemsByCategory();
  const checkedCount = checkedItems.length;
  const totalCount = listItems.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-text-secondary">Loading grocery lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl font-bold text-text mb-2">Grocery Lists</h1>
          <p className="text-text-secondary">
            Manage and organize your shopping lists
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - List Selection */}
          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl shadow-warm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text">My Lists</h2>
                <button
                  onClick={() => setShowNewListModal(true)}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                  title="Create new list"
                >
                  <Plus size={20} className="text-primary" />
                </button>
              </div>

              {groceryLists.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto text-text-secondary mb-2" size={32} />
                  <p className="text-sm text-text-secondary">
                    No lists yet. Create one to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groceryLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={() => setActiveListId(list.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeListId === list.id
                          ? 'bg-primary text-white'
                          : 'bg-background hover:bg-background border border-border'
                      }`}
                    >
                      <p className="font-medium">{list.name}</p>
                      <p className={`text-xs ${
                        activeListId === list.id
                          ? 'text-white/70'
                          : 'text-text-secondary'
                      }`}>
                        {listItems.filter((i) => i.list_id === list.id).length} items
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - List Items */}
          <div className="lg:col-span-3">
            {activeListId ? (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="bg-surface rounded-2xl shadow-warm border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-text">
                      {checkedCount} of {totalCount} items completed
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {progressPercent}%
                    </p>
                  </div>
                  <div className="w-full h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowAddItemModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    <Plus size={20} />
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      fetchRecipes();
                      setShowAddFromRecipeModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
                  >
                    <ChefHat size={20} />
                    Add from Recipe
                  </button>
                  {checkedItems.length > 0 && (
                    <button
                      onClick={clearCheckedItems}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                      Clear Checked
                    </button>
                  )}
                </div>

                {/* Items by Category */}
                {listItems.length === 0 ? (
                  <div className="bg-surface rounded-2xl shadow-warm border border-border p-12 text-center">
                    <Package className="mx-auto text-text-secondary mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-text mb-2">
                      No items yet
                    </h3>
                    <p className="text-text-secondary">
                      Add items to start your shopping list
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(grouped).map(([category, items]) => (
                      <div
                        key={category}
                        className="bg-surface rounded-2xl shadow-warm border border-border p-6"
                      >
                        <h3
                          className={`text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 ${
                            categoryColors[category] ||
                            categoryColors['other']
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group"
                            >
                              <button
                                onClick={() =>
                                  toggleItemChecked(item.id, item.checked)
                                }
                                className="flex-shrink-0 transition-colors"
                              >
                                <Circle
                                  size={24}
                                  className="text-text-secondary hover:text-primary"
                                />
                              </button>
                              <div className="flex-1">
                                <p className="text-text font-medium">
                                  {item.quantity} {item.unit} {item.name}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Checked Items */}
                    {checkedItems.length > 0 && (
                      <div className="bg-surface rounded-2xl shadow-warm border border-border p-6 opacity-60">
                        <h3 className="text-sm font-bold text-text mb-4">
                          Completed Items
                        </h3>
                        <div className="space-y-2">
                          {checkedItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 rounded-lg group"
                            >
                              <button
                                onClick={() =>
                                  toggleItemChecked(item.id, item.checked)
                                }
                                className="flex-shrink-0 transition-colors"
                              >
                                <CheckCircle2
                                  size={24}
                                  className="text-green-600"
                                />
                              </button>
                              <div className="flex-1">
                                <p className="text-text-secondary font-medium line-through">
                                  {item.quantity} {item.unit} {item.name}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-surface rounded-2xl shadow-warm border border-border p-12 text-center">
                <Package className="mx-auto text-text-secondary mb-4" size={48} />
                <h3 className="text-lg font-semibold text-text mb-2">
                  No lists available
                </h3>
                <p className="text-text-secondary mb-6">
                  Create a new list to get started
                </p>
                <button
                  onClick={() => setShowNewListModal(true)}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Create New List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-warm-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">Create New List</h3>
              <button
                onClick={() => setShowNewListModal(false)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              placeholder="List name (e.g., Weekly Shopping)"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewListModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-border text-text hover:bg-background transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createNewList}
                disabled={!newListName.trim()}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-warm-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">Add Item</h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Tomatoes"
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={itemForm.quantity}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Unit
                  </label>
                  <select
                    value={itemForm.unit}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, unit: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>pieces</option>
                    <option>kg</option>
                    <option>g</option>
                    <option>lbs</option>
                    <option>oz</option>
                    <option>cups</option>
                    <option>tbsp</option>
                    <option>tsp</option>
                    <option>ml</option>
                    <option>l</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Category
                </label>
                <select
                  value={itemForm.category}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="produce">Produce</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="pantry">Pantry</option>
                  <option value="frozen">Frozen</option>
                  <option value="condiments">Condiments</option>
                  <option value="beverages">Beverages</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-border text-text hover:bg-background transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                disabled={!itemForm.name.trim()}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add from Recipe Modal */}
      {showAddFromRecipeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-warm-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">Add from Recipe</h3>
              <button
                onClick={() => setShowAddFromRecipeModal(false)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Select a Recipe
              </label>
              <select
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              >
                <option value="">-- Choose a recipe --</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </option>
                ))}
              </select>
              <p className="text-sm text-text-secondary">
                Note: This would require recipe ingredients in your database.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddFromRecipeModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-border text-text hover:bg-background transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                disabled
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
              >
                Add Items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
