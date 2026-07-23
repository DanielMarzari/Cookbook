import { getDb } from '@/lib/db';

// US local-food listings (USDA Local Food Portal), ZIP-geocoded, by state.
//   GET ?state=CA          -> that state's farms + category counts
//   GET ?lat=..&lng=..     -> nearest state (from coords) + its farms
//   GET  (no params)       -> list of states with counts (for the picker)
export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    let state = (searchParams.get('state') || '').toUpperCase().slice(0, 2) || null;
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    let detected = false;

    // no state + coords → detect nearest state from the closest listing
    if (!state && Number.isFinite(lat) && Number.isFinite(lng)) {
      const row = db.prepare(
        `SELECT state FROM local_farms WHERE lat IS NOT NULL
         ORDER BY (lat-?)*(lat-?)+(lng-?)*(lng-?) ASC LIMIT 1`
      ).get(lat, lat, lng, lng) as { state: string } | undefined;
      if (row) { state = row.state; detected = true; }
    }

    if (!state) {
      const states = db.prepare(
        'SELECT state, COUNT(*) AS count FROM local_farms WHERE lat IS NOT NULL GROUP BY state ORDER BY state'
      ).all();
      return Response.json({ states });
    }

    const farms = db.prepare(
      `SELECT id, name, category, state, city, street, zip, phone, website, lat, lng
       FROM local_farms WHERE state = ? AND lat IS NOT NULL ORDER BY category, name`
    ).all(state);
    const categories = db.prepare(
      'SELECT category, COUNT(*) AS count FROM local_farms WHERE state = ? AND lat IS NOT NULL GROUP BY category ORDER BY count DESC'
    ).all(state);
    return Response.json({ state, detected, farms, categories });
  } catch (error) {
    console.error('Farms error:', error);
    return Response.json({ error: 'Failed to load farms' }, { status: 500 });
  }
}
