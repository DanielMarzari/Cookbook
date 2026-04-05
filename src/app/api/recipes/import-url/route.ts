import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface ParsedRecipe {
  title: string;
  description?: string;
  image?: string;
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  instructions: Array<{ text: string }>;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

async function fetchRecipe(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  return response.text();
}

function parseJsonLd(html: string): Partial<ParsedRecipe> | null {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const json = JSON.parse($(scripts[i]).html() || '{}');

      if (json['@type'] === 'Recipe' || json.type === 'Recipe') {
        return {
          title: json.name || '',
          description: json.description || '',
          image: json.image?.url || json.image?.[0] || '',
          servings: parseInt(json.recipeYield) || 4,
          prepTime: json.prepTime ? parseDuration(json.prepTime) : 0,
          cookTime: json.cookTime ? parseDuration(json.cookTime) : 0,
          ingredients: (json.recipeIngredient || []).map(
            (ing: string | { name: string }) => {
              const ingStr =
                typeof ing === 'string' ? ing : ing.name || '';
              return parseIngredient(ingStr);
            }
          ),
          instructions: (json.recipeInstructions || []).map(
            (inst: string | { text: string }) => ({
              text: typeof inst === 'string' ? inst : inst.text || '',
            })
          ),
        };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+)M/);
  return match ? parseInt(match[1]) : 0;
}

function parseIngredient(
  text: string
): { name: string; quantity: number; unit: string } {
  const match = text.match(/^([\d.]+)\s*(\w+)?\s*(.+)$/);
  if (match) {
    return {
      quantity: parseFloat(match[1]) || 1,
      unit: match[2] || 'piece',
      name: match[3] || text,
    };
  }
  return { quantity: 1, unit: 'piece', name: text };
}

function parseFallback(html: string): Partial<ParsedRecipe> {
  const $ = cheerio.load(html);

  const title = $('h1').first().text() || 'Imported Recipe';

  const ingredients: Array<{ name: string; quantity: number; unit: string }> =
    [];
  $('ul li, ol li').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 0) {
      ingredients.push(parseIngredient(text));
    }
  });

  const instructions: Array<{ text: string }> = [];
  $('ol li').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 0 && instructions.length < 20) {
      instructions.push({ text });
    }
  });

  return {
    title,
    ingredients: ingredients.slice(0, 20),
    instructions: instructions.slice(0, 20),
    servings: 4,
    prepTime: 15,
    cookTime: 30,
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

    let recipe = parseJsonLd(html);
    if (!recipe) {
      recipe = parseFallback(html);
    }

    return NextResponse.json({
      title: recipe.title || 'Imported Recipe',
      description: recipe.description || '',
      image_url: recipe.image || '',
      ingredients: recipe.ingredients || [],
      instructions:
        recipe.instructions?.map((inst) => ({
          text: inst.text,
        })) || [],
      prep_time_minutes: recipe.prepTime || 15,
      cook_time_minutes: recipe.cookTime || 30,
      servings: recipe.servings || 4,
      cuisine_type: 'Mediterranean',
      difficulty: 'medium',
      source_url: url,
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
