'use client';

import LinkCard, { hostOf } from '@/components/LinkCard';

/**
 * Notes, with the links in them treated as links.
 *
 * Notes are where a URL gets pasted — the video you followed, the thread that
 * explained the hydration, the shop that sells the flour. Printed as plain text
 * they are a wall of punctuation in the middle of a sentence, and they aren't
 * even clickable.
 *
 * Two treatments, decided by how the link was written:
 *
 * A URL alone on its line is someone filing a reference, so it becomes a card —
 * the site, the page's name, and somewhere obvious to click.
 *
 * A URL inside a sentence is part of the sentence, so it stays inline and just
 * gets shortened to the site's name. Dropping a card into the middle of a
 * paragraph would break the sentence in half to say less.
 *
 * Everything else is left exactly as typed, including the line breaks, because
 * notes are written the way they are for a reason.
 */

// Deliberately conservative: http(s) only, and it stops before trailing
// punctuation so "see https://example.com." doesn't swallow the full stop.
const URL_RE = /https?:\/\/[^\s<>()[\]{}"']+[^\s<>()[\]{}"'.,;:!?]/g;

export default function NoteText({ text, className = '' }: { text: string; className?: string }) {
  // Blank lines separate blocks; single newlines stay inside one, so a note
  // written as a paragraph keeps its shape.
  const blocks = text.split(/\n{2,}/);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // A line that is nothing but a URL — the whole block, or one line of a
        // block that is only links — gets the card treatment.
        const lines = trimmed.split('\n');
        const everyLineIsALink = lines.every((l) => {
          const t = l.trim();
          return !t || /^https?:\/\/\S+$/.test(t);
        });

        if (everyLineIsALink) {
          return (
            <div key={bi} className="flex flex-col gap-2">
              {lines
                .map((l) => l.trim())
                .filter(Boolean)
                .map((href, li) => (
                  <LinkCard key={`${bi}-${li}`} href={href} />
                ))}
            </div>
          );
        }

        // Prose. Any URLs inside it shorten to the site's name in place.
        const parts: React.ReactNode[] = [];
        let last = 0;
        for (const m of trimmed.matchAll(URL_RE)) {
          const at = m.index ?? 0;
          if (at > last) parts.push(trimmed.slice(last, at));
          parts.push(
            <a
              key={`${bi}-${at}`}
              href={m[0]}
              target="_blank"
              rel="noopener noreferrer"
              title={m[0]}
              className="underline underline-offset-4 decoration-1 text-text hover:text-text-secondary"
            >
              {hostOf(m[0])}
            </a>,
          );
          last = at + m[0].length;
        }
        if (last < trimmed.length) parts.push(trimmed.slice(last));

        return (
          <p key={bi} className="whitespace-pre-wrap">
            {parts.length ? parts : trimmed}
          </p>
        );
      })}
    </div>
  );
}
