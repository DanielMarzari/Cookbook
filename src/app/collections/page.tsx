'use client';

import { useEffect, useState } from 'react';
import { Plus, X, Folder } from 'lucide-react';
import Link from 'next/link';
import { Collection, Recipe } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const collectionColorOptions = [
  { name: 'Amber', value: 'bg-amber-100' },
  { name: 'Rose', value: 'bg-rose-100' },
  { name: 'Green', value: 'bg-green-100' },
  { name: 'Blue', value: 'bg-blue-100' },
  { name: 'Purple', value: 'bg-purple-100' },
  { name: 'Orange', value: 'bg-orange-100' },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionCounts, setCollectionCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: collectionColorOptions[0].value,
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setCollections(data || []);

      // Fetch recipe counts for each collection
      if (data && data.length > 0) {
        const counts: Record<string, number> = {};
        for (const collection of data) {
          const { count, error: countError } = await supabase
            .from('collection_recipes')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (!countError) {
            counts[collection.id] = count || 0;
          }
        }
        setCollectionCounts(counts);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load collections'
      );
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollection.name.trim()) return;

    try {
      const { data, error: supabaseError } = await supabase
        .from('collections')
        .insert([
          {
            name: newCollection.name,
            description: newCollection.description || null,
            color: newCollection.color,
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setCollections([data, ...collections]);
      setCollectionCounts({ ...collectionCounts, [data.id]: 0 });
      setNewCollection({
        name: '',
        description: '',
        color: collectionColorOptions[0].value,
      });
      setShowNewCollectionModal(false);
    } catch (err) {
      console.error('Error creating collection:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-text-secondary">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-text mb-2">Collections</h1>
              <p className="text-text-secondary">
                Organize recipes into curated collections
              </p>
            </div>
            <button
              onClick={() => setShowNewCollectionModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus size={20} />
              New Collection
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {collections.length === 0 ? (
          <div className="bg-surface rounded-2xl shadow-warm border border-border p-12 text-center">
            <Folder className="mx-auto text-text-secondary mb-4" size={48} />
            <h3 className="text-lg font-semibold text-text mb-2">
              No collections yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first collection to organize recipes by theme,
              occasion, or cuisine
            </p>
            <button
              onClick={() => setShowNewCollectionModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Create Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-responsive gap-6">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <article className="h-full group overflow-hidden rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-surface border border-border hover:border-primary">
                  {/* Color Header */}
                  <div className={`h-24 ${collection.color}`} />

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {collection.name}
                    </h3>

                    {collection.description && (
                      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm font-medium text-text">
                        {collectionCounts[collection.id] || 0}{' '}
                        {collectionCounts[collection.id] === 1
                          ? 'recipe'
                          : 'recipes'}
                      </span>
                      <span className="text-xs text-text-secondary">
                        View collection
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Collection Modal */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl shadow-warm-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text">
                Create New Collection
              </h3>
              <button
                onClick={() => setShowNewCollectionModal(false)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Collection Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Weekend Dinners"
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection({
                      ...newCollection,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add a description..."
                  value={newCollection.description}
                  onChange={(e) =>
                    setNewCollection({
                      ...newCollection,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Color Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {collectionColorOptions.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      onClick={() =>
                        setNewCollection({
                          ...newCollection,
                          color: colorOption.value,
                        })
                      }
                      className={`h-12 rounded-lg border-2 transition-all ${
                        newCollection.color === colorOption.value
                          ? 'border-primary scale-105'
                          : 'border-border'
                      } ${colorOption.value}`}
                      title={colorOption.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewCollectionModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-border text-text hover:bg-background transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createCollection}
                disabled={!newCollection.name.trim()}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
