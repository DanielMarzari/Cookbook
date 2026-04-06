import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// In-memory session store - sessions persist across requests in the Node.js process
const validSessions = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const providedPassword = body.password;

    // Get the auth password from environment
    const authPassword = process.env.AUTH_PASSWORD;

    if (!authPassword) {
      return NextResponse.json(
        { error: 'Auth not configured' },
        { status: 500 }
      );
    }

    // Validate password
    if (providedPassword !== authPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = randomUUID();
    validSessions.add(sessionToken);

    // Set httpOnly cookie with 30 day expiry
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken || !validSessions.has(sessionToken)) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}
