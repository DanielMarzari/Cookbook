import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Temporary migration endpoint — delete after running
export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) {
    return NextResponse.json({ error: 'Missing env' }, { status: 500 });
  }

  const supabase = createClient(url, key, {
    db: { schema: 'public' },
  });

  // Step 1: Create a temporary helper function to run DDL
  const createFn = await fetch(`${url}/rest/v1/rpc/run_migration`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  // If the function doesn't exist, create it first via a bootstrap approach
  if (!createFn.ok) {
    // Use the pg_net extension or direct SQL — try creating the function
    // via supabase's SQL API
    const sqlUrl = `${url}/rest/v1/rpc/`;

    // Alternative: use the Supabase management API to run SQL
    // Since we can't do that, let's try a creative workaround:
    // Check if column exists first
    const { error: checkErr } = await supabase.from('ingredients').select('aliases').limit(1);

    if (!checkErr) {
      return NextResponse.json({ message: 'aliases column already exists, no migration needed' });
    }

    // Column doesn't exist — try adding via a database trigger workaround
    // Actually, let's try the new Supabase SQL endpoint
    const sqlRes = await fetch(`${url}/sql`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS aliases text[] DEFAULT ARRAY[]::text[];"
      }),
    });

    if (sqlRes.ok) {
      return NextResponse.json({ success: true, method: 'sql_endpoint' });
    }

    // Try the pg endpoint
    const pgRes = await fetch(`${url}/pg/query`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS aliases text[] DEFAULT ARRAY[]::text[];"
      }),
    });

    if (pgRes.ok) {
      return NextResponse.json({ success: true, method: 'pg_endpoint' });
    }

    return NextResponse.json({
      error: 'Could not run migration automatically',
      sql_endpoint_status: sqlRes.status,
      pg_endpoint_status: pgRes.status,
      sql: 'ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS aliases text[] DEFAULT ARRAY[]::text[];',
    }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
