import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CANON, getCanon } from '@/data/canon';
import CanonViews from '@/components/canon/CanonViews';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return CANON.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canon = getCanon(slug);
  return { title: canon ? `${canon.name} · What a dish is · Cookbook` : 'Cookbook' };
}

/** Your own recipes that sit inside this family, matched on title. */
function yoursInFamily(fragments: string[] | undefined) {
  if (!fragments?.length) return [];
  try {
    const db = getDb();
    const like = fragments.map(() => 'LOWER(title) LIKE ?').join(' OR ');
    return db
      .prepare(
        `SELECT id, title FROM recipes
         WHERE parent_recipe_id IS NULL AND (${like})
         ORDER BY title`,
      )
      .all(...fragments.map((f) => `%${f.toLowerCase()}%`)) as { id: string; title: string }[];
  } catch {
    return [];
  }
}

export default async function CanonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canon = getCanon(slug);
  if (!canon) notFound();

  const mine = yoursInFamily(canon.yours);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-14">
        <Link href="/canon" className="text-[12px] uppercase tracking-[0.12em] text-text-secondary hover:text-text">
          What a dish is
        </Link>
        <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-text mt-3 mb-4">
          {canon.name}
        </h1>
        <p className="max-w-[68ch] text-[15px] leading-relaxed text-text-secondary mb-10">{canon.standfirst}</p>
      </div>

      <CanonViews canon={canon} />

      {canon.dishes.some((d) => d.note) && (
        <section className="mt-14">
          <h2 className="text-[12px] uppercase tracking-[0.13em] text-text-secondary mb-4">Worth knowing</h2>
          <div className="flex flex-col gap-2.5">
            {canon.dishes
              .filter((d) => d.note)
              .map((d) => (
                <p key={d.name} className="text-[13.5px] leading-[1.6] text-text-secondary max-w-[70ch]">
                  <span className="text-text">{d.name}.</span> {d.note}
                </p>
              ))}
          </div>
        </section>
      )}

      {mine.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[12px] uppercase tracking-[0.13em] text-text-secondary mb-3">Yours in this family</h2>
          <p className="text-[13px] text-text-secondary leading-[1.6] max-w-[62ch] mb-3">
            Read these against the table — a branch that changes one chip is a variation, and one that
            changes the chip a neighbour is named for has quietly become that neighbour.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {mine.map((r) => (
              <Link key={r.id} href={`/recipes/${r.id}`} className="tlink text-[14px] text-text">
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 border-t border-border pt-6 space-y-4">
        {canon.notes.map((n) => (
          <p key={n.title} className="text-[13.5px] leading-[1.6] text-text-secondary max-w-[70ch]">
            <span className="text-text">{n.title}.</span> {n.body}
          </p>
        ))}
        <p className="text-[12.5px] leading-[1.6] text-text-secondary">
          <span className="text-text">Sources.</span>{' '}
          {canon.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && ' · '}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="tlink">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
