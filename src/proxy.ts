import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthSecret, verifySession } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow other static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp')
  ) {
    return NextResponse.next();
  }

  // Verify the session cookie's signature — presence alone is not enough.
  const sessionToken = request.cookies.get('session_token')?.value;
  const valid = await verifySession(getAuthSecret(), sessionToken);

  if (!valid) {
    // API callers get a clean 401; page navigations get redirected to login.
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
