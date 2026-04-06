import { NextResponse } from 'next/server';
import { titleCaseIngredient } from '@/lib/utils';

// Same unit patterns as import-url
const UNIT_PATTERNS = [
  'tablespoons?', 'teaspoons?', 'tbsp', 'tsp',
  'cups?', 'ounces?', 'oz', 'pounds?', 'lbs?',
  'grams?', 'kilograms?', 'kg', 'milliliters?', 'ml', 'liters?', 'l',
  'g',
  'pinch(?:es)?', 'dash(?:es)?', 'cloves?', 'slices?',
  'pieces?', 'cans?', 'packages?', 'sticks?', 'bunches?',
  'sprigs?', 'heads?', 'stalks?', 'bags?', 'large', 'medium', 'small',
];
const UNIT_REGEX_STR = UNIT_PATTERNS.join('|');

function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase().replace(/\.$/, '');
  const map: Record<string, string> = {
    cup: 'cup', cups: 'cup',
    tablespoon: 'tbsp', tablespoons: 'tbsp', tbsp: 'tbsp',
    teaspoon: 'tsp', teaspoons: 'tsp', tsp: 'tsp',
    ounce: 'oz', ounces: 'oz', oz: 'oz',
    pound: 'lb', pounds: 'lb', lb: 'lb', lbs: 'lb',
    gram: 'g', grams: 'g', g: 'g',
    kilogram: 'kg', kilograms: 'kg', kg: 'kg',
    milliliter: 'ml', milliliters: 'ml', ml: 'ml',
    liter: 'l', liters: 'l', l: 'l',
    clove: 'clove', cloves: 'clove',
    slice: 'slice', slices: 'slice',
    piece: 'piece', pieces: 'piece',
    can: 'can', cans: 'can',
    stick: 'stick', sticks: 'stick',
    pinch: 'pinch', pinches: 'pinch',
    dash: 'dash', dashes: 'dash',
    sprig: 'sprig', sprigs: 'sprig',
    bunch: 'bunch', bunches: 'bunch',
    head: 'head', heads: 'head',
    stalk: 'stalk', stalks: 'stalk',
    package: 'package', packages: 'package',
    bag: 'bag', bags: 'bag',
  };
  return map[u] || u;
}

// Unicode fraction map
const FRACTION_MAP: Record<string, number> = {
  '½': 0.5, '⅓': 1/3, '⅔': 2/3, '¼': 0.25, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8, '⅙': 1/6,
  '⅚': 5/6, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

function resolveUnicodeFractions(text: string): string {
  let result = text;
  for (const [frac, val] of Object.entries(FRACTION_MAP)) {
    result = result.replace(new RegExp(`(\\d+)\\s*${frac}`, 'g'), (_, whole) => String(parseFloat(whole) + val));
    result = result.replace(new RegExp(frac, 'g'), String(val));
  }
  return result;
}

function parseQuantity(raw: string): number {
  const s = raw.trim();
  if (s.includes('/')) {
    const parts = s.split(/\s+/);
    let total = 0;
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, den] = part.split('/');
        total += parseInt(num) / parseInt(den);
      } else {
        total += parseFloat(part);
      }
    }
    return total || 1;
  }
  return parseFloat(s) || 1;
}

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  is_header?: boolean;
}

function parseIngredientLine(text: string): ParsedIngredient {
  let cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return { quantity: 1, unit: 'piece', name: text };

  cleaned = resolveUnicodeFractions(cleaned);

  // Remove leading bullet, dash, dot
  cleaned = cleaned.replace(/^[\-–—•·*]\s*/, '').trim();

  // Extract parentheticals as notes
  const noteParts: string[] = [];
  {
    let parenResult = '';
    let i = 0;
    while (i < cleaned.length) {
      if (cleaned[i] === '(') {
        let depth = 1;
        let j = i + 1;
        while (j < cleaned.length && depth > 0) {
          if (cleaned[j] === '(') depth++;
          else if (cleaned[j] === ')') depth--;
          j++;
        }
        const content = cleaned.slice(i + 1, j - 1).trim();
        if (content) noteParts.push(`(${content})`);
        parenResult += ' ';
        i = j;
      } else {
        parenResult += cleaned[i];
        i++;
      }
    }
    cleaned = parenResult.replace(/\s+/g, ' ').trim();
  }

  // Handle commas: separate notes from name parts
  const commaParts = cleaned.split(/,\s*/);
  if (commaParts.length > 1) {
    const noteKeywords = /^(at |room temp|softened|melted|divided|chopped|diced|minced|to taste|optional|packed|sifted|plus |for |thinly |finely |roughly |coarsely |freshly |lightly |well |cut |peeled|trimmed|seeded|deveined|thawed|drained|rinsed|warmed|cooled|chilled|beaten|whisked|grated|shredded|sliced|cubed|julienned|halved|quartered|crushed|crumbled|torn|toasted|roasted|approx)/i;
    const mainParts: string[] = [];
    for (const part of commaParts) {
      if (noteKeywords.test(part.trim())) {
        noteParts.push(part.trim());
      } else {
        mainParts.push(part.trim());
      }
    }
    cleaned = mainParts.join(' ').replace(/\s+/g, ' ').trim();
  }

  // Main regex: qty + optional unit + name
  const mainRegex = new RegExp(
    `^([\\d]+\\s+[\\d]+\\/[\\d]+|[\\d]+\\/[\\d]+|[\\d]+\\.\\d+|[\\d]+)\\s*(?:(${UNIT_REGEX_STR})\\.?\\s+)?(.+)$`,
    'i'
  );

  const match = cleaned.match(mainRegex);
  if (match) {
    const rawQty = match[1];
    const rawUnit = match[2] || '';
    let name = (match[3] || cleaned).trim();
    const quantity = parseQuantity(rawQty);

    let unit = rawUnit;
    if (/^(large|medium|small)$/i.test(rawUnit)) {
      name = rawUnit.toLowerCase() + ' ' + name;
      unit = 'piece';
    }

    const normalizedUnit = unit ? normalizeUnit(unit) : 'piece';
    name = name.replace(/^of\s+/i, '').replace(/\.\s*$/, '').trim();
    const notes = noteParts.length > 0 ? noteParts.join(', ') : undefined;
    return { quantity, unit: normalizedUnit, name: titleCaseIngredient(name), notes };
  }

  cleaned = cleaned.replace(/^of\s+/i, '').trim();
  const notes = noteParts.length > 0 ? noteParts.join(', ') : undefined;
  return { quantity: 1, unit: 'piece', name: titleCaseIngredient(cleaned), notes };
}

// Detect if a line looks like an ingredient (starts with number or fraction)
function looksLikeIngredient(line: string): boolean {
  const trimmed = line.replace(/^[\-–—•·*]\s*/, '').trim();
  // Starts with number, fraction, or unicode fraction
  return /^(\d|½|⅓|⅔|¼|¾|⅕|⅛|⅜|⅝|⅞)/.test(trimmed);
}

// Detect if a line looks like an instruction step
function looksLikeInstruction(line: string): boolean {
  const trimmed = line.trim();
  // Starts with step number like "1.", "1)", "Step 1"
  if (/^(step\s*)?\d+[\.\):\-]\s*/i.test(trimmed)) return true;
  // Contains cooking verbs
  if (/\b(preheat|mix|stir|add|combine|cook|bake|whisk|fold|pour|heat|sauté|saute|simmer|boil|fry|roast|grill|dice|chop|slice|blend|knead|let\s+rest|set\s+aside|bring|reduce|season|serve|place|remove|transfer|cover|cool|drain)\b/i.test(trimmed)) return true;
  return false;
}

// Detect section header patterns
function looksLikeSectionHeader(line: string): boolean {
  const trimmed = line.trim();
  // "For the X:", "X:", all caps short line, or bold markers
  if (/^(for\s+the\s+|for\s+)/i.test(trimmed) && trimmed.length < 50) return true;
  if (/^[A-Z][A-Z\s&]+:?\s*$/.test(trimmed) && trimmed.length < 40) return true;
  if (/^#+\s+/.test(trimmed)) return true; // Markdown headers
  if (/^\*\*.*\*\*$/.test(trimmed)) return true; // Bold markdown
  return false;
}

// Extract time info from instructions
function extractTimesFromInstructions(instructions: string[]): { prep: number; cook: number } {
  let totalMinutes = 0;
  const timeRegex = /(\d+)\s*(?:to\s*\d+\s*)?(?:minutes?|mins?|hours?|hrs?)/gi;

  for (const text of instructions) {
    let match;
    while ((match = timeRegex.exec(text)) !== null) {
      const num = parseInt(match[1]);
      const unit = match[0].toLowerCase();
      if (unit.includes('hour') || unit.includes('hr')) {
        totalMinutes += num * 60;
      } else {
        totalMinutes += num;
      }
    }
  }

  // Split: first 30% is prep, rest is cook (rough heuristic)
  if (totalMinutes > 0) {
    const prep = Math.round(totalMinutes * 0.3);
    const cook = totalMinutes - prep;
    return { prep, cook };
  }
  return { prep: 15, cook: 30 };
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Split into lines, filter empty
    const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) {
      return NextResponse.json({ error: 'No content found in text' }, { status: 400 });
    }

    // Phase 1: Detect title (first non-ingredient, non-instruction line)
    let title = '';
    let startIdx = 0;

    // Skip common Instagram prefixes like usernames, "Recipe:", etc.
    for (let i = 0; i < Math.min(5, rawLines.length); i++) {
      const line = rawLines[i];
      // Skip hashtag-only lines, @mentions, or very short lines
      if (/^[#@]/.test(line) || line.length < 3) continue;
      // Skip "recipe" label
      if (/^recipe:?\s*$/i.test(line)) continue;

      // This is likely the title
      if (!looksLikeIngredient(line) && !looksLikeInstruction(line)) {
        title = line.replace(/^(recipe:?\s*)/i, '').replace(/[🍕🍳🥘🍲🍝🍜🍛🍚🥗🥙🌮🌯🥪🫔🧆🍔🍟🍕🌭🥚🥓🥞🧇🥐🍞🥖🥨🧀🥩🍗🍖🍠🥟🥠🥡🍱🍣🍤🍙🍘🍥🥮🍡🍧🍦🧁🍩🍪🎂🍰🥧🍮🍭🍬🍫🍿🍩🧂🥫🍯]+/g, '').trim();
        startIdx = i + 1;
        break;
      }
    }

    if (!title && rawLines.length > 0) {
      title = rawLines[0].replace(/[^\w\s\-']/g, '').trim();
      startIdx = 1;
    }

    // Phase 2: Classify remaining lines
    const ingredients: ParsedIngredient[] = [];
    const instructionTexts: string[] = [];
    let currentSection: 'unknown' | 'ingredients' | 'instructions' = 'unknown';
    let servings = 4;

    // Look for explicit section headers
    const ingredientHeaderRegex = /^(ingredients?|what you.?ll need|you.?ll need|shopping list)\s*:?\s*$/i;
    const instructionHeaderRegex = /^(instructions?|directions?|method|steps?|how to make|preparation|procedure)\s*:?\s*$/i;
    const servingsRegex = /(?:serves?|servings?|makes?|yield|portions?)\s*:?\s*(\d+)/i;

    for (let i = startIdx; i < rawLines.length; i++) {
      const line = rawLines[i];

      // Check for servings info
      const servingsMatch = line.match(servingsRegex);
      if (servingsMatch) {
        servings = parseInt(servingsMatch[1]) || 4;
        continue;
      }

      // Skip hashtag lines (Instagram)
      if (/^#\w/.test(line) && !line.startsWith('# ')) continue;
      // Skip emoji-only lines
      if (/^[\p{Emoji}\s]+$/u.test(line) && !/\w/.test(line)) continue;

      // Check for section headers
      if (ingredientHeaderRegex.test(line)) {
        currentSection = 'ingredients';
        continue;
      }
      if (instructionHeaderRegex.test(line)) {
        currentSection = 'instructions';
        continue;
      }

      // Section sub-headers (e.g., "For the dough:")
      if (currentSection === 'ingredients' && looksLikeSectionHeader(line)) {
        const headerName = line.replace(/^(for\s+the\s+|for\s+|#+\s+|\*\*|\*)/i, '').replace(/[:*]+$/, '').trim();
        if (headerName) {
          ingredients.push({ name: headerName, quantity: 0, unit: '', is_header: true });
        }
        continue;
      }

      // Classify by context and content
      if (currentSection === 'ingredients') {
        if (looksLikeInstruction(line) && !looksLikeIngredient(line) && line.length > 60) {
          // Switched to instructions
          currentSection = 'instructions';
          instructionTexts.push(line.replace(/^(step\s*)?\d+[\.\):\-]\s*/i, '').trim());
        } else {
          const parsed = parseIngredientLine(line);
          if (parsed.name) ingredients.push(parsed);
        }
      } else if (currentSection === 'instructions') {
        const cleanedStep = line.replace(/^(step\s*)?\d+[\.\):\-]\s*/i, '').trim();
        if (cleanedStep) instructionTexts.push(cleanedStep);
      } else {
        // Unknown section — auto-detect
        if (looksLikeIngredient(line)) {
          currentSection = 'ingredients';
          const parsed = parseIngredientLine(line);
          if (parsed.name) ingredients.push(parsed);
        } else if (looksLikeInstruction(line)) {
          currentSection = 'instructions';
          const cleanedStep = line.replace(/^(step\s*)?\d+[\.\):\-]\s*/i, '').trim();
          if (cleanedStep) instructionTexts.push(cleanedStep);
        } else if (line.length > 80) {
          // Long line is probably an instruction paragraph
          currentSection = 'instructions';
          instructionTexts.push(line);
        } else {
          // Short unclassified line — could be a section header or description
          // Try as ingredient
          const parsed = parseIngredientLine(line);
          if (parsed.quantity > 0 && parsed.quantity !== 1) {
            currentSection = 'ingredients';
            ingredients.push(parsed);
          }
          // Otherwise skip
        }
      }
    }

    // Phase 3: Extract times
    const times = extractTimesFromInstructions(instructionTexts);

    // Phase 4: Format instructions
    const instructions = instructionTexts.map((text, idx) => ({
      step_number: idx + 1,
      text,
    }));

    // Phase 5: Format ingredients for the form
    const formIngredients = ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      notes: ing.notes || '',
      ...(ing.is_header ? { is_header: true } : {}),
    }));

    return NextResponse.json({
      title: title || 'Untitled Recipe',
      description: '',
      cuisine_type: 'Other',
      difficulty: 'medium',
      prep_time_minutes: times.prep,
      cook_time_minutes: times.cook,
      servings,
      ingredients: formIngredients,
      instructions,
      source_type: 'pasted',
    });
  } catch (error) {
    console.error('Parse text error:', error);
    return NextResponse.json(
      { error: 'Failed to parse recipe text' },
      { status: 500 }
    );
  }
}
