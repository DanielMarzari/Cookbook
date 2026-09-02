import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CANON, getCanon } from '@/data/canon';
import CanonLine from '@/components/CanonLine';
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

      <CanonLine canon={canon} />

      <p className="text-[12.5px] leading-[1.6] text-text-secondary max-w-[68ch] mt-5 pt-4 border-t border-border">
        Every condition has to hold at once. Anything feeding in from the left can be swapped without leaving
        the family; anything on the right is a single change that puts the dish somewhere else.
      </p>

      <section className="mt-14">
        <h2 className="text-[12px] uppercase tracking-[0.13em] text-text-secondary mb-4">Where the family sits</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[560px]">
            <thead>
              <tr>
                {['Dish', 'What carries it', 'Body from', 'Verdict'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="text-[11px] uppercase tracking-[0.12em] text-text-secondary font-normal pb-2.5 pr-5 border-b border-text"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {canon.family.map((f) => (
                <tr key={f.name}>
                  <td className="text-[14px] text-text py-3 pr-5 border-b border-border align-top whitespace-nowrap">
                    {f.name}
                  </td>
                  <td className="text-[13.5px] text-text-secondary py-3 pr-5 border-b border-border align-top">
                    {f.carries}
                  </td>
                  <td className="text-[13.5px] text-text-secondary py-3 pr-5 border-b border-border align-top">
                    {f.body}
                  </td>
                  <td className="py-3 pr-5 border-b border-border align-top">
                    <span
                      className={`text-[11px] uppercase tracking-[0.1em] ${
                        f.verdict === 'in' ? 'text-text border-b border-text' : 'text-[#a0522d]'
                      }`}
                    >
                      {f.verdict}
                    </span>
                    {f.note && (
                      <span className="block text-[12.5px] text-text-secondary mt-1 max-w-[34ch]">{f.note}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {mine.length > 0 && (
        <section className="mt-14">
          <h2 className="text-[12px] uppercase tracking-[0.13em] text-text-secondary mb-3">Yours in this family</h2>
          <p className="text-[13px] text-text-secondary leading-[1.6] max-w-[62ch] mb-3">
            Worth reading against the conditions above — a branch that breaks one of them isn&rsquo;t a
            variation of this dish, it&rsquo;s the start of another.
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
