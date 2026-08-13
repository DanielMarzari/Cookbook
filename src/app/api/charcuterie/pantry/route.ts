import { listPantry, setPantry } from '@/lib/charcuterie/store';

// What's in the fridge. Global rather than per-board — it's what every
// suggestion on every board ranks against.
export async function GET() {
  try {
    return Response.json({ pantry: listPantry() });
  } catch (error) {
    console.error('charcuterie/pantry GET', error);
    return Response.json({ error: 'Failed to load pantry' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { pantry?: unknown };
    if (!Array.isArray(body.pantry)) {
      return Response.json({ error: 'pantry must be an array' }, { status: 400 });
    }
    const ids = body.pantry.filter((v): v is string => typeof v === 'string');
    return Response.json({ pantry: setPantry(ids) });
  } catch (error) {
    console.error('charcuterie/pantry PUT', error);
    return Response.json({ error: 'Failed to save pantry' }, { status: 500 });
  }
}
