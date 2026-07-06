/**
 * Stateless signed-session helpers, usable from both the proxy middleware
 * (edge runtime) and route handlers. Uses Web Crypto only — no Node built-ins —
 * so it runs unchanged in the edge middleware.
 *
 * A session token is `${issuedAt}.${nonce}.${hmac(issuedAt.nonce)}`. The HMAC is
 * keyed by a server secret, so a token can't be forged without it. Verification
 * recomputes the HMAC and checks the token hasn't outlived `maxAgeMs`.
 */

const enc = new TextEncoder();

/** Signing secret. Falls back to AUTH_PASSWORD so no new env var is required. */
export function getAuthSecret(): string | undefined {
  return process.env.AUTH_SECRET || process.env.AUTH_PASSWORD;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

/** Constant-time-ish string compare to avoid leaking match length via timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signSession(secret: string): Promise<string> {
  const payload = `${Date.now()}.${crypto.randomUUID()}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function verifySession(
  secret: string | undefined,
  token: string | undefined,
  maxAgeMs: number = THIRTY_DAYS_MS
): Promise<boolean> {
  if (!secret || !token) return false;

  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return false;

  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  const expected = await hmac(secret, payload);
  if (!safeEqual(sig, expected)) return false;

  const issuedAt = parseInt(payload.split('.')[0], 10);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > maxAgeMs) return false;

  return true;
}
