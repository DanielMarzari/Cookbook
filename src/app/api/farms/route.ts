import { getDb } from '@/lib/db';

// PA local-food listings (farmers markets, CSAs, on-farm markets, food hubs,
// agritourism) from the USDA Local Food Portal, ZIP-geocoded. GET returns all
// with coordinates (for the map) plus the category counts.
export async function GET() {
  try {
    const db = getDb();
    const farms = db
      .prepare(
        `SELECT id, name, category, city, street, zip, phone, website, lat, lng
         FROM pa_farms WHERE lat IS NOT NULL ORDER BY category, name`
      )
      .all();
    const categories = db
      .prepare('SELECT category, COUNT(*) AS count FROM pa_farms WHERE lat IS NOT NULL GROUP BY category ORDER BY count DESC')
      .all();
    return Response.json({ farms, categories });
  } catch (error) {
    console.error('Farms error:', error);
    return Response.json({ error: 'Failed to load farms' }, { status: 500 });
  }
}
