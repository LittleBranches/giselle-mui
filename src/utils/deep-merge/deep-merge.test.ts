// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { deepMerge } from './deep-merge';

// ----------------------------------------------------------------------

describe('deepMerge — basic merge', () => {
  it('returns base values when override is empty', () => {
    expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 });
  });

  it('override values win at the top level', () => {
    expect(deepMerge({ a: 1, b: 2 }, { a: 9 })).toEqual({ a: 9, b: 2 });
  });

  it('merges nested plain objects recursively', () => {
    const base = { palette: { primary: { main: '#000', dark: '#111' } } } as Record<
      string,
      unknown
    >;
    const override = { palette: { primary: { main: '#fff' } } } as Partial<Record<string, unknown>>;
    expect(deepMerge(base, override)).toEqual({
      palette: { primary: { main: '#fff', dark: '#111' } },
    });
  });

  it('preserves base keys that are absent from override', () => {
    const result = deepMerge(
      { a: { b: 1, c: 2 } } as Record<string, unknown>,
      { a: { b: 99 } } as Partial<Record<string, unknown>>
    );
    expect(result).toEqual({ a: { b: 99, c: 2 } });
  });

  it('adds new keys from override that are absent from base', () => {
    expect(deepMerge({ a: 1 } as Record<string, unknown>, { b: 2 })).toEqual({ a: 1, b: 2 });
  });
});

// ----------------------------------------------------------------------

describe('deepMerge — array handling', () => {
  it('replaces arrays wholesale (does not concat)', () => {
    expect(deepMerge({ list: [1, 2, 3] }, { list: [4, 5] })).toEqual({ list: [4, 5] });
  });

  it('replaces an array with an empty array', () => {
    expect(deepMerge({ list: [1, 2] }, { list: [] })).toEqual({ list: [] });
  });
});

// ----------------------------------------------------------------------

describe('deepMerge — undefined handling', () => {
  it('does not overwrite an existing value with undefined', () => {
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });
});

// ----------------------------------------------------------------------

describe('deepMerge — prototype pollution protection', () => {
  it('ignores __proto__ key to prevent prototype pollution', () => {
    const attack = { __proto__: { polluted: true } } as Record<string, unknown>;
    const result = deepMerge({} as Record<string, unknown>, attack);
    // __proto__ must not be written as an own property on the result
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
    // global prototype must not be polluted
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('ignores constructor key', () => {
    const attack = { constructor: { name: 'hacked' } } as Record<string, unknown>;
    const result = deepMerge({} as Record<string, unknown>, attack);
    // constructor must not be overwritten as an own property
    expect(Object.prototype.hasOwnProperty.call(result, 'constructor')).toBe(false);
  });

  it('ignores prototype key', () => {
    const attack = { prototype: { polluted: true } } as Record<string, unknown>;
    const result = deepMerge({} as Record<string, unknown>, attack);
    // prototype must not be written as an own property
    expect(Object.prototype.hasOwnProperty.call(result, 'prototype')).toBe(false);
  });

  it('does not pick up inherited enumerable properties from override', () => {
    const proto = { inherited: 'evil' };
    const override = Object.create(proto) as Record<string, unknown>;
    override['own'] = 'good';
    const result = deepMerge(
      { original: 'value' } as Record<string, unknown>,
      override as Partial<Record<string, unknown>>
    );
    expect(result['own']).toBe('good');
    expect(result['inherited']).toBeUndefined();
  });
});
