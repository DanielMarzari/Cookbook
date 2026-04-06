import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { titleCaseIngredient } from '@/lib/utils';

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  is_header?: boolean;
  is_or?: boolean;
}

interface ParsedRecipe {
  title: string;
  description?: string;
  image?: string;
  ingredients: ParsedIngredient[];
  instructions: Array<{ text: string }>;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  yield?: string;
}

async function fetchRecipe(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  return response.text();
}

// Find Recipe object in JSON-LD, handling @graph arrays and nested structures
function findRecipeInJsonLd(obj: any): any | null {
  if (!obj) return null;

  // Direct Recipe type
  if (obj['@type'] === 'Recipe') return obj;

  // Array of types (e.g. ["Recipe"])
  if (Array.isArray(obj['@type']) && obj['@type'].includes('Recipe')) return obj;

  // @graph array (very common on WordPress recipe sites)
  if (obj['@graph'] && Array.isArray(obj['@graph'])) {
    for (const item of obj['@graph']) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
  }

  // Top-level array
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
  }

  return null;
}

// Extract ingredient section headers from the HTML structure
// Many recipes have headers like "For the Dough:", "For the Filling:" in the HTML
// but NOT in the JSON-LD. This function finds them and maps them to ingredient indices.
function extractIngredientSectionsFromHtml($: any): Array<{ name: string; beforeIndex: number }> {
  const sections: Array<{ name: string; beforeIndex: number }> = [];

  // Strategy: find the ingredient container, then walk its direct children in order.
  // Section headers are typically <p><strong>For the X:</strong></p> between <ul> lists.
  const containerSelectors = [
    '.tasty-recipes-ingredients',
    '[class*="ingredient"]',
    '[id*="ingredient"]',
    '.wprm-recipe-ingredients-container',
    '.recipe-ingredients',
    '.ingredients-list',
  ];

  let container: any = null;
  for (const sel of containerSelectors) {
    const el = $(sel).first();
    if (el.length && el.find('li').length > 0) {
      container = el;
      break;
    }
  }
  if (!container) return sections;

  // Collect all <p>, <strong>, <h3>, <h4>, <li> elements in DOM order within the container
  let ingredientCount = 0;
  const allElements = container.find('p, strong, b, h3, h4, h5, li');

  allElements.each((_: number, el: any) => {
    const $el = $(el);
    const tag = el.tagName?.toLowerCase();

    if (tag === 'li') {
      const text = $el.text().trim();
      if (text.length > 2 && text.length < 200) {
        ingredientCount++;
      }
      return;
    }

    // For non-li elements, check if they're section headers
    // Use only the element's own text (not nested children text) to avoid false positives
    const ownText = $el.clone().children().remove().end().text().trim();
    const fullText = $el.text().trim();
    // Use ownText if available (for <p> containing <strong>), else fullText (for <strong> directly)
    const headerText = ownText || fullText;

    if (!headerText || headerText.length > 80 || headerText.match(/^\d/)) return;

    // Check if this looks like a section header
    const sectionPattern = /^(for\s+(the\s+)?)/i;
    if (sectionPattern.test(headerText)) {
      // Avoid duplicates: a <p> containing <strong> would both match.
      // Only add if this text isn't already the last section we added.
      const cleanName = headerText.replace(/:$/, '').trim();
      const last = sections[sections.length - 1];
      if (!last || last.name !== cleanName || last.beforeIndex !== ingredientCount) {
        sections.push({ name: cleanName, beforeIndex: ingredientCount });
      }
    }
  });

  return sections;
}

function parseJsonLd(html: string, $root?: any): Partial<ParsedRecipe> | null {
  const $ = $root || cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const json = JSON.parse($(scripts[i]).html() || '{}');
      const recipe = findRecipeInJsonLd(json);

      if (recipe) {
        // Parse image - can be string, object, or array
        let image = '';
        if (typeof recipe.image === 'string') {
          image = recipe.image;
        } else if (Array.isArray(recipe.image)) {
          image = typeof recipe.image[0] === 'string' ? recipe.image[0] : recipe.image[0]?.url || '';
        } else if (recipe.image?.url) {
          image = recipe.image.url;
        }

        // Parse instructions - can be strings, objects, or sections
        // Sections become header markers like "--- For the Dough ---"
        const instructions: Array<{ text: string }> = [];
        const rawInstructions = recipe.recipeInstructions || [];
        for (const inst of rawInstructions) {
          if (typeof inst === 'string') {
            instructions.push({ text: inst });
          } else if (inst['@type'] === 'HowToStep') {
            instructions.push({ text: inst.text || '' });
          } else if (inst['@type'] === 'HowToSection') {
            // Add section name as a header step
            if (inst.name) {
              instructions.push({ text: `--- ${inst.name} ---` });
            }
            if (inst.itemListElement) {
              for (const step of inst.itemListElement) {
                instructions.push({ text: typeof step === 'string' ? step : step.text || '' });
              }
            }
          }
        }

        // Parse ingredient groups - some recipes have sections like "For the Dough", "For the Filling"
        // JSON-LD recipeIngredient is usually a flat array. Try to find section headers from:
        // 1. The ingredient text itself (rare but possible)
        // 2. The HTML structure (common — look for headings near ingredient lists)
        const ingredientGroups: ParsedIngredient[] = [];
        const rawIngredients = recipe.recipeIngredient || [];

        // Try to extract section headers from HTML ingredient structure
        const sectionHeaders = extractIngredientSectionsFromHtml($);

        // Build a map of ingredient index → section header
        // Match each section header to the ingredient that follows it
        let sectionIdx = 0;
        for (let ingIdx = 0; ingIdx < rawIngredients.length; ingIdx++) {
          const ing = rawIngredients[ingIdx];
          if (typeof ing !== 'string') continue;
          const trimmed = ing.trim();

          // Check if there's a section header that should appear before this ingredient
          if (sectionIdx < sectionHeaders.length) {
            const section = sectionHeaders[sectionIdx];
            if (section.beforeIndex === ingIdx) {
              ingredientGroups.push({ name: section.name, quantity: 0, unit: '', is_header: true });
              sectionIdx++;
            }
          }

          // Detect group headers from ingredient text: "For the dough:", "Filling:", etc.
          if (/^(for\s+(the\s+)?|the\s+)/i.test(trimmed) && trimmed.length < 60 && !trimmed.match(/^\d/)) {
            ingredientGroups.push({ name: trimmed.replace(/:$/, ''), quantity: 0, unit: '', is_header: true });
          } else {
            // Split compound ingredients (e.g. "2 egg yolks + 1 tsp water + 1 tsp honey")
            const compounds = splitCompoundIngredient(trimmed);
            for (const compound of compounds) {
              const parsed = parseIngredient(compound.trim());
              const orSplit = splitOrIngredient(parsed);
              ingredientGroups.push(...orSplit);
            }
          }
        }

        return {
          title: recipe.name || '',
          description: recipe.description || '',
          image,
          servings: parseInt(recipe.recipeYield?.[0] || recipe.recipeYield) || undefined,
          yield: Array.isArray(recipe.recipeYield) ? recipe.recipeYield[0] : recipe.recipeYield,
          prepTime: parseDuration(recipe.prepTime),
          cookTime: parseDuration(recipe.cookTime),
          totalTime: parseDuration(recipe.totalTime),
          ingredients: ingredientGroups,
          instructions,
        };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

// Parse ISO 8601 duration (PT1H30M, PT45M, PT2H, P1DT2H, etc.)
function parseDuration(duration: string | undefined): number | undefined {
  if (!duration || typeof duration !== 'string') return undefined;

  // Must start with P, reject negatives like PT-493177H
  if (!duration.startsWith('P') || duration.includes('-')) return undefined;

  let minutes = 0;
  const days = duration.match(/(\d+)D/);
  const hours = duration.match(/(\d+)H/);
  const mins = duration.match(/(\d+)M/);

  if (days) minutes += parseInt(days[1]) * 24 * 60;
  if (hours) minutes += parseInt(hours[1]) * 60;
  if (mins) minutes += parseInt(mins[1]);

  // Sanity check: cap at 7 days (10080 minutes)
  if (minutes > 10080 || minutes <= 0) return undefined;

  return minutes;
}

// Extract time mentions from instruction text and sum them up
// Looks for patterns like "1 hour", "30 minutes", "2-3 hours", "45 min", etc.
function extractTimesFromInstructions(instructions: Array<{ text: string }>): number {
  let totalMinutes = 0;
  const timePattern = /(\d+(?:\.\d+)?)\s*(?:-\s*\d+(?:\.\d+)?\s*)?\s*(hours?|hrs?|minutes?|mins?)/gi;

  for (const inst of instructions) {
    let match;
    while ((match = timePattern.exec(inst.text)) !== null) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      if (unit.startsWith('hour') || unit.startsWith('hr')) {
        totalMinutes += value * 60;
      } else {
        totalMinutes += value;
      }
    }
  }

  return Math.round(totalMinutes);
}

// Unicode fraction map
const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5, '⅓': 1/3, '⅔': 2/3, '¼': 0.25, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
  '⅙': 1/6, '⅚': 5/6, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

// Convert Unicode fractions to decimal in a string
function resolveUnicodeFractions(text: string): string {
  let result = text;
  for (const [frac, val] of Object.entries(UNICODE_FRACTIONS)) {
    // "1½" or "1 ½" → combined decimal
    result = result.replace(new RegExp(`(\\d+)\\s*${frac}`, 'g'), (_, whole) => {
      return String(parseFloat(whole) + val);
    });
    // standalone "½" → "0.5"
    result = result.replace(new RegExp(frac, 'g'), String(val));
  }
  return result;
}

// Parse a raw quantity string (handles "1 1/2", "1/2", "0.75", "1.5", etc.)
function parseQuantity(raw: string): number {
  const s = raw.trim();
  if (s.includes('/')) {
    // Could be "1 1/2" or just "1/2"
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

// Known unit patterns (order matters: longer/more-specific first)
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

// Parse a single ingredient string like "1 stick (½ cup) unsalted butter" or "¾ cup sugar"
function parseIngredient(text: string): ParsedIngredient {
  let cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return { quantity: 1, unit: 'piece', name: text };

  // Resolve Unicode fractions first (½ → 0.5, ¾ → 0.75, 1½ → 1.5, etc.)
  cleaned = resolveUnicodeFractions(cleaned);

  const noteParts: string[] = [];

  // 1) Extract ALL parentheticals and decide what to do with each
  // e.g. "(1.5 sticks)" → notes, "(2 bags)" → notes, "(optional)" → notes
  // Handles nested parentheses like "(between 105°F (40°C) and 46°C)"
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
        // Extract the full parenthetical including nested parens
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

  // 2) Extract temperature references → notes
  // Handles: "approx. 110°F", "105-110°F", "350°F", "warm"
  const tempMatch = cleaned.match(/,?\s*(?:approx\.?\s*)?(\d+(?:\s*-\s*\d+)?\s*°[FCfc])\s*/);
  if (tempMatch) {
    noteParts.push(tempMatch[0].replace(/^,?\s*/, '').trim());
    cleaned = cleaned.replace(tempMatch[0], ' ').replace(/\s+/g, ' ').trim();
  }
  // Move "warm", "hot", "cold", "room temperature", "lukewarm" to notes
  const tempDescriptors = /\b(warm|hot|cold|lukewarm|room\s+temperature)\b/i;
  const tempDescMatch = cleaned.match(tempDescriptors);
  if (tempDescMatch) {
    noteParts.push(tempDescMatch[1].trim());
    cleaned = cleaned.replace(tempDescriptors, ' ').replace(/\s+/g, ' ').trim();
  }

  // 3) Handle commas smarter: collect ALL comma-separated segments,
  // then figure out which are notes vs. name parts
  // "¾ cups, plus a pinch, white granulated sugar" → qty=0.75, unit=cup, name="white granulated sugar", notes="plus a pinch"
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
    // Rejoin the non-note parts — the first part has qty+unit, last part(s) have the name
    cleaned = mainParts.join(' ').replace(/\s+/g, ' ').trim();
  }

  // 4) Main regex: number (decimal or fraction) + optional unit + name
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

    // If unit matched "large"/"medium"/"small", fold it into the name as a descriptor
    let unit = rawUnit;
    if (/^(large|medium|small)$/i.test(rawUnit)) {
      name = rawUnit.toLowerCase() + ' ' + name;
      unit = 'piece';
    }

    const normalizedUnit = unit ? normalizeUnit(unit) : 'piece';

    // 5) Strip leading "of" from name: "of vanilla extract" → "vanilla extract"
    name = name.replace(/^of\s+/i, '').trim();

    // Clean up name: remove trailing periods, extra whitespace
    name = name.replace(/\.\s*$/, '').trim();

    const notes = noteParts.length > 0 ? noteParts.join(', ') : undefined;
    return { quantity, unit: normalizedUnit, name: titleCaseIngredient(name), notes };
  }

  // No quantity match — strip leading "of" anyway
  cleaned = cleaned.replace(/^of\s+/i, '').trim();
  const notes = noteParts.length > 0 ? noteParts.join(', ') : undefined;
  return { quantity: 1, unit: 'piece', name: titleCaseIngredient(cleaned), notes };
}

// Split an ingredient with "or" in its name into alternatives
// e.g. "semisweet or dark chocolate chips" → [{name: "semisweet chocolate chips"}, {is_or: true}, {name: "dark chocolate chips"}]
// Carries shared noun suffix to both alternatives when the "before" part is just an adjective
function splitOrIngredient(parsed: ParsedIngredient): ParsedIngredient[] {
  const name = parsed.name;

  // Don't split if "or" is part of a word (oregano, orange, orzo, etc.)
  // Look for " or " as a standalone word in the name
  const orMatch = name.match(/^(.+?)\s+or\s+(.+)$/i);
  if (!orMatch) return [parsed];

  let before = orMatch[1].trim();
  const after = orMatch[2].trim();

  // Don't split very short fragments or things that look like notes
  if (before.length < 2 || after.length < 2) return [parsed];

  // Don't split if "or" is inside parentheses or after a comma (it's a note)
  if (before.includes('(') && !before.includes(')')) return [parsed];

  // Detect shared noun suffix: if "before" has fewer words than "after",
  // the trailing words of "after" are likely the shared noun.
  // e.g. "semisweet" or "dark chocolate chips" → before has 1 word, after has 3
  // The last N words of "after" (where N = afterWords - beforeWords) are the shared suffix
  const beforeWords = before.split(/\s+/);
  const afterWords = after.split(/\s+/);

  if (beforeWords.length < afterWords.length) {
    // "before" is likely just adjective(s), "after" has adj + noun
    // Figure out how many leading words in "after" are the alternative adjective(s)
    // by assuming the "before" side has the same number of adjective words
    const adjCount = beforeWords.length;
    const sharedSuffix = afterWords.slice(adjCount).join(' ');
    const afterAdj = afterWords.slice(0, adjCount).join(' ');

    if (sharedSuffix) {
      before = before + ' ' + sharedSuffix;
      // "after" already has the full name, keep it as-is
      return [
        { ...parsed, name: before },
        { name: 'OR', quantity: 0, unit: '', is_or: true },
        { ...parsed, name: after },
      ];
    }
  }

  return [
    { ...parsed, name: before },
    { name: 'OR', quantity: 0, unit: '', is_or: true },
    { ...parsed, name: after },
  ];
}

// Split compound ingredients joined by "+" into separate items
// e.g. "2 egg yolks + 1 tsp water + 1 tsp honey" → 3 separate ingredients
function splitCompoundIngredient(text: string): string[] {
  // Only split on " + " when it's surrounded by what looks like separate ingredients
  // i.e. a number follows the "+"
  const parts = text.split(/\s*\+\s*/);
  if (parts.length <= 1) return [text];

  // Verify that at least the second part starts with a number or unicode fraction
  const startsWithQty = /^[\d½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/;
  const validParts = parts.filter(p => p.trim().length > 0);
  if (validParts.length > 1 && validParts.slice(1).some(p => startsWithQty.test(p.trim()))) {
    return validParts;
  }
  return [text];
}

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

// Fallback HTML parser - specifically looks for ingredient and instruction sections
function parseFallback(html: string): Partial<ParsedRecipe> {
  const $ = cheerio.load(html);

  // Title: first h1, or h2 with recipe-like class
  const title =
    $('h1').first().text().trim() ||
    $('h2').first().text().trim() ||
    'Imported Recipe';

  // Description: meta description or first paragraph
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  // Image: og:image or first large image
  const image =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    '';

  // --- INGREDIENTS ---
  // Strategy: find a heading that says "Ingredients", then grab the list items after it
  const ingredients: ParsedIngredient[] = [];

  // Method 1: Look for elements with ingredient-related classes/IDs
  const ingredientSelectors = [
    '[class*="ingredient"] li',
    '[class*="ingredient"] span',
    '[class*="ingredient"] p',
    '[id*="ingredient"] li',
    '[data-ingredient]',
    '.wprm-recipe-ingredient',
    '.tasty-recipe-ingredients li',
    '.recipe-ingredients li',
    '.ingredients-list li',
    '.ingredient-list li',
    '.recipe__ingredients li',
  ];

  for (const selector of ingredientSelectors) {
    $(selector).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 2 && text.length < 200) {
        for (const c of splitCompoundIngredient(text)) { ingredients.push(...splitOrIngredient(parseIngredient(c.trim()))); }
      }
    });
    if (ingredients.length > 0) break;
  }

  // Method 2: Find heading that says "Ingredients" and grab the next list
  if (ingredients.length === 0) {
    $('h1, h2, h3, h4, h5, h6, strong, b, [class*="heading"]').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase();
      if (headingText.includes('ingredient') && ingredients.length === 0) {
        // Look for the next <ul> or <ol> after this heading
        let next = $(heading).next();
        // Walk up to parent if heading is inside a wrapper
        if (!next.length || (!next.is('ul') && !next.is('ol'))) {
          next = $(heading).parent().next();
        }
        // Keep walking siblings
        let attempts = 0;
        while (next.length && attempts < 5) {
          if (next.is('ul') || next.is('ol')) {
            next.find('li').each((_, li) => {
              const text = $(li).text().replace(/\s+/g, ' ').trim();
              if (text.length > 2 && text.length < 200) {
                for (const c of splitCompoundIngredient(text)) { ingredients.push(...splitOrIngredient(parseIngredient(c.trim()))); }
              }
            });
            break;
          }
          // Some sites put each ingredient in a <p> or <div>
          if (next.is('p, div') && !next.find('h1, h2, h3, h4, h5, h6').length) {
            const text = next.text().replace(/\s+/g, ' ').trim();
            if (text.length > 2 && text.length < 200 && !text.toLowerCase().includes('instruction')) {
              for (const c of splitCompoundIngredient(text)) { ingredients.push(...splitOrIngredient(parseIngredient(c.trim()))); }
            }
          }
          next = next.next();
          attempts++;
        }
      }
    });
  }

  // --- INSTRUCTIONS ---
  const instructions: Array<{ text: string }> = [];

  // Method 1: Look for elements with instruction-related classes
  const instructionSelectors = [
    '[class*="instruction"] li',
    '[class*="instruction"] p',
    '[class*="direction"] li',
    '[class*="direction"] p',
    '[class*="step"] li',
    '[class*="step"] p',
    '.wprm-recipe-instruction',
    '.tasty-recipe-instructions li',
    '.recipe-directions li',
    '.recipe__instructions li',
  ];

  for (const selector of instructionSelectors) {
    $(selector).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 10 && text.length < 1000) {
        instructions.push({ text });
      }
    });
    if (instructions.length > 0) break;
  }

  // Method 2: Find heading that says "Instructions/Directions" and grab the next list
  if (instructions.length === 0) {
    $('h1, h2, h3, h4, h5, h6, strong, b, [class*="heading"]').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase();
      if ((headingText.includes('instruction') || headingText.includes('direction') || headingText.includes('method') || headingText.includes('steps')) && instructions.length === 0) {
        let next = $(heading).next();
        if (!next.length) {
          next = $(heading).parent().next();
        }
        let attempts = 0;
        while (next.length && attempts < 10) {
          if (next.is('ol')) {
            next.find('li').each((_, li) => {
              const text = $(li).text().replace(/\s+/g, ' ').trim();
              if (text.length > 10 && text.length < 1000) {
                instructions.push({ text });
              }
            });
            break;
          }
          if (next.is('ul')) {
            next.find('li').each((_, li) => {
              const text = $(li).text().replace(/\s+/g, ' ').trim();
              if (text.length > 10 && text.length < 1000) {
                instructions.push({ text });
              }
            });
            break;
          }
          if (next.is('p, div') && !next.find('h1, h2, h3, h4, h5, h6').length) {
            const text = next.text().replace(/\s+/g, ' ').trim();
            if (text.length > 10 && text.length < 1000) {
              instructions.push({ text });
            }
          }
          next = next.next();
          attempts++;
        }
      }
    });
  }

  return {
    title,
    description,
    image,
    ingredients: ingredients.slice(0, 50),
    instructions: instructions.slice(0, 30),
    servings: undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const html = await fetchRecipe(url);

    // Extract site title from meta tags or hostname
    const $ = cheerio.load(html);
    const siteTitle = $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname.replace('www.', '');

    // Try JSON-LD first (most reliable), then fall back to HTML parsing
    let recipe = parseJsonLd(html, $);
    if (!recipe || !recipe.ingredients?.length) {
      const fallback = parseFallback(html);
      // Merge: prefer JSON-LD data but use fallback for missing fields
      recipe = {
        title: recipe?.title || fallback.title,
        description: recipe?.description || fallback.description,
        image: recipe?.image || fallback.image,
        ingredients: recipe?.ingredients?.length ? recipe.ingredients : fallback.ingredients,
        instructions: recipe?.instructions?.length ? recipe.instructions : fallback.instructions,
        prepTime: recipe?.prepTime || fallback.prepTime,
        cookTime: recipe?.cookTime || fallback.cookTime,
        totalTime: recipe?.totalTime,
        servings: recipe?.servings || fallback.servings,
      };
    }

    let prepTime = recipe.prepTime || 0;
    let cookTime = recipe.cookTime || 0;
    let totalTime = recipe.totalTime || 0;

    // Always extract times from instructions as a reference
    const extractedMinutes = recipe.instructions?.length
      ? extractTimesFromInstructions(recipe.instructions)
      : 0;

    // Fill in missing times from instruction extraction
    if (!totalTime && !prepTime && !cookTime && extractedMinutes > 0) {
      totalTime = extractedMinutes;
    } else if (totalTime && !prepTime && cookTime) {
      // Have total and cook but not prep — derive prep
      prepTime = Math.max(0, totalTime - cookTime);
    } else if (!totalTime && prepTime && cookTime) {
      totalTime = prepTime + cookTime;
    } else if (totalTime && !prepTime && !cookTime && extractedMinutes > 0) {
      // Have total from JSON-LD but no breakdown — use extracted as total reference
      // and try to split: extracted likely covers active time
      cookTime = totalTime > extractedMinutes ? extractedMinutes : totalTime;
    }

    if (!totalTime) {
      totalTime = prepTime + cookTime;
    }

    // Collect all meaningful images from the page for user selection
    const allImages: string[] = [];
    const seenUrls = new Set<string>();

    // Add the primary recipe image first
    if (recipe.image) {
      allImages.push(recipe.image);
      seenUrls.add(recipe.image);
    }

    // Gather all images from the page
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (!src) return;

      // Resolve relative URLs
      let fullUrl = src;
      try {
        fullUrl = new URL(src, url).href;
      } catch {}

      // Skip tiny images (icons, tracking pixels), duplicates, and data URIs
      const width = parseInt($(el).attr('width') || '0');
      const height = parseInt($(el).attr('height') || '0');
      if ((width > 0 && width < 100) || (height > 0 && height < 100)) return;
      if (seenUrls.has(fullUrl)) return;
      if (fullUrl.startsWith('data:')) return;
      if (fullUrl.includes('pixel') || fullUrl.includes('tracking') || fullUrl.includes('badge') || fullUrl.includes('icon')) return;

      seenUrls.add(fullUrl);
      allImages.push(fullUrl);
    });

    // Also grab og:image and other meta images
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && !seenUrls.has(ogImage)) {
      allImages.push(ogImage);
      seenUrls.add(ogImage);
    }

    return NextResponse.json({
      title: recipe.title || 'Imported Recipe',
      description: recipe.description || '',
      image_url: recipe.image || '',
      all_images: allImages.slice(0, 20), // Cap at 20 images
      ingredients: recipe.ingredients || [],
      instructions:
        recipe.instructions?.map((inst, i) => ({
          step_number: i + 1,
          text: inst.text,
        })) || [],
      prep_time_minutes: prepTime,
      cook_time_minutes: cookTime,
      total_time_minutes: totalTime,
      servings: recipe.servings || 4,
      source_url: url,
      source_name: siteTitle,
    });
  } catch (error) {
    console.error('Error importing recipe:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to import recipe from URL',
      },
      { status: 500 }
    );
  }
}
