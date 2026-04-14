'use client';

import React, { forwardRef, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Collection, Recipe, RecipeIngredient } from '@/lib/types';
import { formatTime, toFraction, titleCaseIngredient } from '@/lib/utils';
import { X } from 'lucide-react';

// react-pageflip uses CSS 3D transforms and has no server equivalent.
// Load client-side only so SSR doesn't try to instantiate it.
const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

interface Props {
  collection: Collection;
  recipes: Recipe[];
  ingredientsByRecipe: Record<string, RecipeIngredient[]>;
  onClose: () => void;
}

/**
 * Full-screen flipbook reader for a collection.
 * Layout: Cover → Table of Contents → one page per recipe → Back cover.
 * Page size is fixed 500×700 so both margins and typography stay tasteful; the
 * flipbook scales itself via `size: "stretch"` within the viewport container.
 */
export default function CollectionBook({
  collection,
  recipes,
  ingredientsByRecipe,
  onClose,
}: Props) {
  const bookRef = useRef<any>(null);

  // Close on Escape.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Page index: 0 cover, 1 TOC, 2..N recipe pages, N+1 back cover.
  const jumpToRecipe = (recipeIdx: number) => {
    const pageIdx = 2 + recipeIdx;
    bookRef.current?.pageFlip()?.flip(pageIdx);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center">
        <HTMLFlipBook
          // @ts-expect-error — the lib's types want every field but most have defaults.
          ref={bookRef}
          width={500}
          height={700}
          size="stretch"
          minWidth={300}
          maxWidth={800}
          minHeight={420}
          maxHeight={1120}
          showCover={true}
          maxShadowOpacity={0.5}
          usePortrait={true}
          mobileScrollSupport={true}
          drawShadow={true}
          flippingTime={700}
          className="book-shadow"
        >
          <CoverPage collection={collection} recipeCount={recipes.length} />
          <TocPage recipes={recipes} onJump={jumpToRecipe} />
          {recipes.map((r) => (
            <RecipePage
              key={r.id}
              recipe={r}
              ingredients={ingredientsByRecipe[r.id] || []}
            />
          ))}
          <BackCoverPage />
        </HTMLFlipBook>
      </div>
    </div>
  );
}

// ---------- individual pages ----------

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { children, className = '' },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`h-full w-full bg-[#faf6ee] text-[#2a2420] overflow-hidden shadow-inner ${className}`}
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <div className="h-full w-full overflow-y-auto px-8 py-10">{children}</div>
    </div>
  );
});

const CoverPage = forwardRef<
  HTMLDivElement,
  { collection: Collection; recipeCount: number }
>(function CoverPage({ collection, recipeCount }, ref) {
  if (collection.cover_image_url) {
    return (
      <Page ref={ref} className="relative !p-0">
        <div className="relative h-full w-full">
          <img
            src={collection.cover_image_url}
            alt={collection.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide uppercase text-center">
              {collection.name}
            </h1>
            {collection.subtitle && (
              <>
                <div className="w-16 h-px bg-white/60 my-3" />
                <p className="italic text-center opacity-90">{collection.subtitle}</p>
              </>
            )}
            <p className="mt-3 text-sm opacity-70">
              {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
            </p>
          </div>
        </div>
      </Page>
    );
  }
  return (
    <Page ref={ref}>
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-[#8b4513]">
          {collection.name}
        </h1>
        {collection.subtitle && (
          <>
            <div className="w-16 h-px bg-[#8b4513]/40 my-4" />
            <p className="italic text-[#6b5d52]">{collection.subtitle}</p>
          </>
        )}
        <p className="mt-6 text-sm text-[#8b7e72]">
          {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
        </p>
      </div>
    </Page>
  );
});

const TocPage = forwardRef<
  HTMLDivElement,
  { recipes: Recipe[]; onJump: (idx: number) => void }
>(function TocPage({ recipes, onJump }, ref) {
  return (
    <Page ref={ref}>
      <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wider text-[#8b4513]">
        Contents
      </h2>
      <ol className="space-y-3">
        {recipes.map((r, idx) => (
          <li key={r.id}>
            <button
              onClick={() => onJump(idx)}
              className="w-full text-left flex items-baseline gap-3 hover:text-[#8b4513] transition-colors"
            >
              <span className="font-mono text-sm text-[#8b7e72] w-6 flex-shrink-0">
                {idx + 1}.
              </span>
              <span className="flex-1 border-b border-dotted border-[#c8bba8] pb-0.5 truncate">
                {r.title}
              </span>
              <span className="text-xs text-[#8b7e72] font-mono">
                {idx + 3}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {recipes.length === 0 && (
        <p className="text-center text-[#8b7e72] italic mt-10">
          This cookbook is empty. Add some recipes from the collection page.
        </p>
      )}
    </Page>
  );
});

const RecipePage = forwardRef<
  HTMLDivElement,
  { recipe: Recipe; ingredients: RecipeIngredient[] }
>(function RecipePage({ recipe, ingredients }, ref) {
  const difficultyColor =
    recipe.difficulty === 'easy'
      ? 'text-green-700'
      : recipe.difficulty === 'hard'
        ? 'text-red-700'
        : 'text-yellow-700';

  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  return (
    <Page ref={ref}>
      {/* Title */}
      <header className="mb-4 pb-3 border-b-2 border-[#8b4513]/30">
        <h2 className="text-2xl font-bold text-[#8b4513] leading-tight">
          {recipe.title}
        </h2>
        {recipe.cuisine_type && (
          <p className="text-xs uppercase tracking-widest text-[#8b7e72] mt-1">
            {recipe.cuisine_type}
          </p>
        )}
      </header>

      {recipe.image_url && (
        <div className="mb-4 h-32 -mx-2 rounded overflow-hidden">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
            style={{ transform: `rotate(${recipe.image_rotation || 0}deg)` }}
          />
        </div>
      )}

      {/* Metadata row */}
      <div className="flex flex-wrap gap-3 text-xs mb-4 text-[#6b5d52]">
        {recipe.total_time_minutes ? (
          <span>
            <span className="font-semibold uppercase tracking-wider">Time</span>{' '}
            {formatTime(recipe.total_time_minutes)}
          </span>
        ) : null}
        {recipe.servings ? (
          <span>
            <span className="font-semibold uppercase tracking-wider">Serves</span>{' '}
            {recipe.servings}
          </span>
        ) : null}
        {recipe.difficulty && (
          <span className={difficultyColor}>
            <span className="font-semibold uppercase tracking-wider text-[#6b5d52]">
              Level
            </span>{' '}
            {recipe.difficulty}
          </span>
        )}
      </div>

      {recipe.description && (
        <p className="italic text-sm text-[#6b5d52] mb-4">{recipe.description}</p>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <section className="mb-4">
          <h3 className="text-xs uppercase tracking-widest text-[#8b4513] mb-2 font-semibold">
            Ingredients
          </h3>
          <ul className="space-y-1 text-sm">
            {ingredients.map((ing, i) => {
              // OR divider
              if (ing.name === '---OR---') {
                return (
                  <li key={i} className="flex items-center gap-2 py-1 text-xs text-[#8b7e72]">
                    <span className="flex-1 border-t border-[#c8bba8]" />
                    <span className="uppercase tracking-wider">or</span>
                    <span className="flex-1 border-t border-[#c8bba8]" />
                  </li>
                );
              }
              // Section header (was "--- X ---")
              if (ing.name?.startsWith('---') && ing.name?.endsWith('---')) {
                return (
                  <li
                    key={i}
                    className="pt-2 text-xs font-bold uppercase tracking-wider text-[#8b4513]"
                  >
                    {ing.name.replace(/^-+\s*/, '').replace(/\s*-+$/, '')}
                  </li>
                );
              }
              const qty =
                ing.quantity > 0
                  ? ing.quantity % 1 !== 0
                    ? toFraction(ing.quantity)
                    : String(ing.quantity)
                  : '';
              const unit = ing.unit && ing.unit !== 'piece' ? ` ${ing.unit}` : '';
              return (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b4513] mt-2 flex-shrink-0" />
                  <span>
                    {qty && <span className="font-semibold">{qty}{unit} </span>}
                    {titleCaseIngredient(ing.name)}
                    {ing.notes && (
                      <span className="text-[#8b7e72] text-xs"> ({ing.notes})</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Instructions */}
      {instructions.length > 0 && (
        <section>
          <h3 className="text-xs uppercase tracking-widest text-[#8b4513] mb-2 font-semibold">
            Instructions
          </h3>
          <ol className="space-y-2 text-sm leading-relaxed">
            {instructions.map((inst: any, i: number) => (
              <li key={i} className="flex gap-2">
                <span className="font-mono font-bold text-[#8b4513] flex-shrink-0">
                  {inst.step_number || i + 1}.
                </span>
                <span>{inst.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {instructions.length === 0 && (
        <p className="text-sm italic text-[#8b7e72]">
          No instructions recorded for this recipe.
        </p>
      )}
    </Page>
  );
});

const BackCoverPage = forwardRef<HTMLDivElement>(function BackCoverPage(_, ref) {
  return (
    <Page ref={ref} className="!bg-[#8b4513] text-[#faf6ee]">
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-xs uppercase tracking-widest opacity-70">Cookbook</p>
        <div className="w-16 h-px bg-[#faf6ee]/40 my-4" />
        <p className="italic opacity-70 text-sm">Fin.</p>
      </div>
    </Page>
  );
});
