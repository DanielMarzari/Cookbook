import type { Recipe } from '@/lib/types';

/**
 * What a recipe looks like before it has a photo.
 *
 * The old fallback was a grey rectangle with "no photo yet" in the middle of
 * it. One of those in a grid is a gap; twenty-four of them — which is what
 * arrived with Gram's binder — is a page that looks broken, and the recipes
 * underneath them look like placeholders rather than things you can cook.
 *
 * So a recipe without a photo gets set rather than greyed: its own title in the
 * serif, large, with what it is underneath. The card carries the same
 * information the photographed ones do, in the only material available when
 * there is no picture, which is type.
 *
 * Paper is picked from the title, so a column of them doesn't read as one
 * repeated tile — stable, because a card that changed shade on every render
 * would be worse than a grey box.
 */

const PAPERS = [
  { paper: '#f7f5f1', ink: '#1d1a15' },
  { paper: '#f4f4f2', ink: '#1a1a18' },
  { paper: '#f6f3f2', ink: '#201b19' },
  { paper: '#f2f4f3', ink: '#17201c' },
  { paper: '#f5f4f7', ink: '#1b1920' },
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default function RecipeCardPlate({ recipe }: { recipe: Recipe }) {
  const p = PAPERS[hash(recipe.title || 'x') % PAPERS.length];
  const under = [recipe.craft, recipe.cuisine_type]
    .filter((v) => v && v.toLowerCase() !== 'other')
    .join(' · ');

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-5"
      style={{ background: p.paper, color: p.ink }}
    >
      {/* A hairline frame set in from the edge — the card reads as stock with
          something printed on it rather than as an empty slot. */}
      <span
        aria-hidden
        className="absolute inset-3 border"
        style={{ borderColor: 'rgba(0,0,0,0.09)' }}
      />
      <span
        className="relative text-[19px] leading-[1.25] tracking-[-0.01em]"
        style={{ fontFamily: '"Iowan Old Style", "Hoefler Text", Palatino, Georgia, serif' }}
      >
        {recipe.title}
      </span>
      {under && (
        <span
          className="relative text-[9.5px] uppercase tracking-[0.17em] mt-3"
          style={{ color: 'rgba(0,0,0,0.42)' }}
        >
          {under}
        </span>
      )}
    </div>
  );
}
