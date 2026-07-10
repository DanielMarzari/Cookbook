import { getDb } from '@/lib/db';

interface UsdaRow {
  fdc_id: number;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// Look up one USDA food from the local mirror by its FDC id.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ fdcId: string }> }
) {
  const { fdcId } = await params;

  if (!fdcId) {
    return Response.json({ error: 'FDC ID is required' }, { status: 400 });
  }

  try {
    const db = getDb();
    const row = db
      .prepare('SELECT * FROM usda_foods WHERE fdc_id = ?')
      .get(parseInt(fdcId, 10)) as UsdaRow | undefined;

    if (!row) {
      return Response.json({ error: 'Food not found' }, { status: 404 });
    }

    return Response.json({
      fdcId: row.fdc_id,
      description: row.description,
      nutrition: {
        calories: row.calories || 0,
        protein: row.protein || 0,
        carbs: row.carbs || 0,
        fat: row.fat || 0,
        fiber: row.fiber || 0,
        sugar: row.sugar || 0,
        sodium: row.sodium || 0,
      },
    });
  } catch (error) {
    console.error('USDA local lookup error:', error);
    return Response.json({ error: 'Failed to fetch nutrition data' }, { status: 500 });
  }
}
