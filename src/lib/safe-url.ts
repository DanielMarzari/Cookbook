/**
 * The guard every outbound fetch goes through.
 *
 * Anywhere the app fetches a URL the user typed, it is fetching from inside the
 * server — which can reach things the browser cannot, starting with the box's
 * own services and the cloud metadata endpoint. This rejects the obvious ones
 * before the request leaves.
 *
 * Best-effort on purpose: it validates the literal hostname and does not
 * resolve DNS, so a name that resolves to a private address still gets through.
 * That is enough for a personal deployment behind a password, and the honest
 * description of what it does.
 */

export const MAX_HTML_BYTES = 5_000_000;
export const FETCH_TIMEOUT_MS = 10_000;

/** Reject non-http(s) URLs and obvious internal targets. Returns the parsed URL. */
export function assertSafeUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error('Invalid URL');
  }

  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are allowed');
  }

  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (host === 'localhost' || host.endsWith('.localhost') || host === '0.0.0.0') {
    throw new Error('Blocked host');
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const a = parseInt(ipv4[1], 10);
    const b = parseInt(ipv4[2], 10);
    // loopback, private, link-local (incl. cloud metadata 169.254.169.254), "this host"
    if (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      throw new Error('Blocked private address');
    }
  }

  // IPv6 loopback / unique-local / link-local
  if (host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80')) {
    throw new Error('Blocked private address');
  }

  return u;
}
