export type SetCookieOptions = {
  /** Max age in seconds. */
  maxAge?: number;
  /** Cookie path. @default '/' */
  path?: string;
  /** SameSite policy. @default 'Lax' */
  sameSite?: 'Strict' | 'Lax' | 'None';
};

// ----------------------------------------------------------------------

/**
 * Reads a cookie value by name.
 *
 * SSR-safe: returns `null` when called outside a browser context
 * (`typeof document === 'undefined'`).
 */
export function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));
  if (!match) return null;
  const raw = match.split('=').slice(1).join('=');
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

/**
 * Writes a cookie value.
 *
 * SSR-safe: no-op when called outside a browser context.
 */
export function setCookieValue(name: string, value: string, options: SetCookieOptions = {}): void {
  if (typeof document === 'undefined') return;
  const { maxAge, path = '/', sameSite = 'Lax' } = options;
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=${path}`,
    `SameSite=${sameSite}`,
  ];
  if (maxAge !== undefined) parts.push(`max-age=${maxAge}`);
  // SameSite=None requires Secure — modern browsers reject the cookie without it.
  if (sameSite === 'None') parts.push('Secure');
  document.cookie = parts.join('; ');
}
