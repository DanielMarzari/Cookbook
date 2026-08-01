// Lets node scripts import app modules that use the '@/…' path alias, so scoring
// logic can be exercised directly instead of through a running dev server.
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const SRC = path.resolve(import.meta.dirname, '..', 'src');

import fs from 'node:fs';

export function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    return { url: pathToFileURL(path.join(SRC, specifier.slice(2) + '.ts')).href, shortCircuit: true };
  }
  // TS source omits the extension on relative imports; node's resolver requires it.
  if (specifier.startsWith('.') && !path.extname(specifier) && context.parentURL?.endsWith('.ts')) {
    const abs = path.resolve(path.dirname(new URL(context.parentURL).pathname), specifier);
    for (const cand of [abs + '.ts', path.join(abs, 'index.ts')])
      if (fs.existsSync(cand)) return { url: pathToFileURL(cand).href, shortCircuit: true };
  }
  return next(specifier, context);
}
