'use client';

import { useEffect, useState } from 'react';
import { Plus, X, Folder, Image } from 'lucide-react';
import Link from 'next/link';
import { Collection, Recipe } from '@/lib/types';
import { supabase } from '@/lib/supabase';

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
    subtitle: '',
    description: '',
    cover_image_url: '',
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
            subtitle: newCollection.subtitle || null,
            description: newCollection.description || null,
            cover_image_url: newCollection.cover_image_url || null,
            color: 'bg-amber-100',
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setCollections([data, ...collections]);
      setCollectionCounts({ ...collectionCounts, [data.id]: 0 });
      setNewCollection({ name: '', subtitle: '', description: '', cover_image_url: '' });
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
                Your curated cookbooks
              </p>
            </div>
            <button
              onClick={() => setShowNewCollectionModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              <Plus size={20} />
              New Cookbook
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
              No cookbooks yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first cookbook to organize recipes by theme,
              occasion, or cuisine
            </p>
            <button
              onClick={() => setShowNewCollectionModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Create Cookbook
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <article className="group cursor-pointer">
                  {/* Book Cover */}
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02] bg-white border border-gray-200">
                    {/* Spine shadow effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 to-transparent z-10" />

                    {/* Inner border frame */}
                    <div className="absolute inset-3 border border-primary/40 rounded-sm z-10 pointer-events-none" />

                    {/* Cover image or fallback */}
                    {collection.cover_image_url ? (
                      <>
                        <img
                          src={collection.cover_image_url}
                          alt={collection.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Title overlay on image */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 z-20">
                          <h3 className="text-xl md:text-2xl font-serif font-bold text-white text-center tracking-wide leading-tight mb-1">
                            {collection.name.toUpperCase()}
                          </h3>
                          {collection.subtitle && (
                            <>
                              <div className="w-12 h-px bg-white/60 my-2" />
                              <p className="text-sm text-white/80 italic text-center">
                                {collection.subtitle}
                              </p>
                            </>
                          )}
                          <p className="text-xs text-white/60 mt-3">
                            {collectionCounts[collection.id] || 0} {(collectionCounts[collection.id] || 0) === 1 ? 'recipe' : 'recipes'}
                          </p>
                        </div>
                      </>
                    ) : (
                      /* No cover image — elegant typographic cover */
                      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <h3 className="text-xl md:text-2xl font-serif font-bold text-primary text-center tracking-wide leading-tight">
                            {collection.name.toUpperCase()}
                          </h3>
                          {collection.subtitle && (
                            <>
                              <div className="w-12 h-px bg-primary/40 my-3" />
                              <p className="text-sm text-text-secondary italic text-center">
                                {collection.subtitle}
                              </p>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary">
                          {collectionCounts[collection.id] || 0} {(collectionCounts[collection.id] || 0) === 1 ? 'recipe' : 'recipes'}
                        </p>
                      </div>
                    )}
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
          <div className="bg-surface rounded-2xl shadow-warm-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text">
                Create New Cookbook
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
                  Cookbook Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Città del Tufo"
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mangiamo!"
                  value={newCollection.subtitle}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, subtitle: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="What's this cookbook about?"
                  value={newCollection.description}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newCollection.cover_image_url}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, cover_image_url: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {newCollection.cover_image_url && (
                  <div className="mt-2 aspect-[3/4] max-h-40 rounded-lg overflow-hidden bg-background">
                    <img
                      src={newCollection.cover_image_url}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
