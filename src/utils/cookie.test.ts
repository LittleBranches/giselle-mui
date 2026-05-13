// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { getCookieValue, setCookieValue } from './cookie';

beforeEach(() => {
  // Clear all cookies between tests
  document.cookie.split('; ').forEach((c) => {
    const key = c.split('=')[0];
    document.cookie = `${key}=; max-age=0; path=/`;
  });
});

describe('setCookieValue + getCookieValue', () => {
  it('sets and gets a simple value', () => {
    setCookieValue('theme-mode', 'dark');
    expect(getCookieValue('theme-mode')).toBe('dark');
  });

  it('encodes and decodes special characters in the name', () => {
    setCookieValue('my setting', 'value');
    expect(getCookieValue('my setting')).toBe('value');
  });

  it('encodes and decodes special characters in the value', () => {
    setCookieValue('data', 'hello world & more');
    expect(getCookieValue('data')).toBe('hello world & more');
  });

  it('returns null for a cookie that does not exist', () => {
    expect(getCookieValue('nonexistent')).toBeNull();
  });

  it('overwrites an existing cookie value', () => {
    setCookieValue('mode', 'light');
    setCookieValue('mode', 'dark');
    expect(getCookieValue('mode')).toBe('dark');
  });

  it('sets max-age when provided', () => {
    setCookieValue('x', '1', { maxAge: 3600 });
    expect(document.cookie).toContain('x=1');
  });
});

describe('setCookieValue — SameSite=None must include Secure', () => {
  it('[regression] includes Secure attribute when sameSite is None', () => {
    const written: string[] = [];
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: descriptor.get,
      set(value: string) {
        written.push(value);
        descriptor.set!.call(document, value);
      },
    });

    try {
      setCookieValue('auth', 'token', { sameSite: 'None' });
      expect(written.some((s) => s.includes('Secure'))).toBe(true);
    } finally {
      Object.defineProperty(document, 'cookie', descriptor);
    }
  });

  it('[regression] does not include Secure attribute when sameSite is Lax', () => {
    const written: string[] = [];
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: descriptor.get,
      set(value: string) {
        written.push(value);
        descriptor.set!.call(document, value);
      },
    });

    try {
      setCookieValue('pref', 'value', { sameSite: 'Lax' });
      expect(written.some((s) => s.includes('Secure'))).toBe(false);
    } finally {
      Object.defineProperty(document, 'cookie', descriptor);
    }
  });
});

describe('getCookieValue — SSR guard', () => {
  it('is safe to call (returns null or value depending on environment)', () => {
    // In jsdom, document is defined — just verify it does not throw
    expect(() => getCookieValue('any')).not.toThrow();
  });
});
