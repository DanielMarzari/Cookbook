'use client';

import { useEffect, useState } from 'react';
import { Technique, UserTechniqueSkill } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ArrowLeft, Video, Lightbulb, AlertCircle, BookOpen, Check } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

export default function TechniqueDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [technique, setTechnique] = useState<Technique | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTechniques, setRelatedTechniques] = useState<Technique[]>([]);
  const [userSkill, setUserSkill] = useState<UserTechniqueSkill | null>(null);
  const [isKnown, setIsKnown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTechnique = async () => {
      try {
        setLoading(true);

        const { data, error: supabaseError } = await supabase
          .from('techniques')
          .select('*')
          .eq('slug', slug)
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!data) {
          throw new Error('Technique not found');
        }

        setTechnique(data);

        // Fetch user skill for this technique
        const { data: skillData } = await supabase
          .from('user_technique_skills')
          .select('*')
          .eq('technique_id', data.id)
          .single();

        if (skillData) {
          setUserSkill(skillData);
          setIsKnown(true);
        }

        // Fetch related techniques
        if (data.related_techniques && data.related_techniques.length > 0) {
          const { data: relatedData } = await supabase
            .from('techniques')
            .select('*')
            .in('id', data.related_techniques);

          setRelatedTechniques(relatedData || []);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching technique:', err);
        setError(err instanceof Error ? err.message : 'Failed to load technique');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTechnique();
    }
  }, [slug]);

  const handleToggleKnown = async () => {
    if (!technique) return;

    setIsSaving(true);
    try {
      if (isKnown && userSkill) {
        // Delete skill record
        await supabase
          .from('user_technique_skills')
          .delete()
          .eq('id', userSkill.id);
        setUserSkill(null);
        setIsKnown(false);
      } else {
        // Create skill record with 'mastered' level
        const { data } = await supabase
          .from('user_technique_skills')
          .insert({
            technique_id: technique.id,
            skill_level: 'mastered',
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (data) {
          setUserSkill(data);
          setIsKnown(true);
        }
      }
    } catch (err) {
      console.error('Error toggling skill:', err);
      alert('Failed to update technique');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-text-secondary">Loading technique...</p>
        </div>
      </div>
    );
  }

  if (error || !technique) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text mb-2">Technique not found</h1>
          <p className="text-text-secondary mb-6">
            {error || 'The technique you are looking for does not exist.'}
          </p>
          <Link
            href="/techniques"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Techniques
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <Link
            href="/techniques"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Techniques
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-text mb-3">{technique.name}</h1>
              <p className="text-lg text-text-secondary mb-4">
                {technique.description}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    difficultyColors[technique.difficulty]
                  }`}
                >
                  {technique.difficulty.charAt(0).toUpperCase() +
                    technique.difficulty.slice(1)}{' '}
                  Level
                </span>
                <span className="text-sm text-text-secondary">
                  {technique.category}
                </span>
              </div>
            </div>

            {/* Skill Tracking Section */}
            <button
              onClick={handleToggleKnown}
              disabled={isSaving}
              className={`mt-6 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isKnown
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-surface border border-border text-text hover:bg-primary hover:text-white hover:border-primary'
              } disabled:opacity-50`}
            >
              {isKnown && <Check size={18} />}
              {isSaving ? 'Saving...' : isKnown ? 'Technique Mastered' : 'I Know This Technique'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images Gallery */}
            {technique.image_urls && technique.image_urls.length > 0 && (
              <div className="mb-10">
                <div className="grid grid-cols-2 gap-4">
                  {technique.image_urls.slice(0, 4).map((url, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl overflow-hidden shadow-warm"
                    >
                      <img
                        src={url}
                        alt={`${technique.name} - Step ${idx + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {technique.video_url && (
              <div className="mb-10 bg-surface rounded-2xl shadow-warm border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Video className="text-primary" size={24} />
                  <h2 className="text-2xl font-bold text-text">Video Tutorial</h2>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  {technique.video_url.includes('youtube') ||
                  technique.video_url.includes('youtu.be') ? (
                    <iframe
                      src={technique.video_url.replace(
                        /watch\?v=/,
                        'embed/'
                      )}
                      title={technique.name}
                      className="w-full h-full"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <video controls className="w-full h-full">
                      <source src={technique.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Content */}
            <div className="bg-surface rounded-2xl shadow-warm border border-border p-6 md:p-8">
              <h2 className="text-2xl font-bold text-text mb-6">Guide</h2>
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={technique.content} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            {technique.tips && technique.tips.length > 0 && (
              <div className="bg-surface rounded-2xl shadow-warm border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="text-primary" size={24} />
                  <h3 className="text-xl font-bold text-text">Tips & Tricks</h3>
                </div>
                <div className="space-y-3">
                  {technique.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <p className="text-sm text-text-secondary">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Techniques */}
            {relatedTechniques.length > 0 && (
              <div className="bg-surface rounded-2xl shadow-warm border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="text-primary" size={24} />
                  <h3 className="text-xl font-bold text-text">Related</h3>
                </div>
                <div className="space-y-2">
                  {relatedTechniques.map((related) => (
                    <Link
                      key={related.id}
                      href={`/techniques/${related.slug}`}
                      className="block p-3 rounded-lg border border-border hover:border-primary bg-background hover:bg-primary/5 transition-all"
                    >
                      <p className="text-sm font-medium text-text hover:text-primary transition-colors">
                        {related.name}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {related.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm font-medium text-text mb-1">
                    Pro Tip
                  </p>
                  <p className="text-xs text-text-secondary">
                    Practice makes perfect. Master the basics before moving on to more advanced variations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
