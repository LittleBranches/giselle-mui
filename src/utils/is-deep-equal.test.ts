// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { isDeepEqual } from './is-deep-equal';

describe('isDeepEqual — primitives', () => {
  it('returns true for identical strings', () => {
    expect(isDeepEqual('light', 'light')).toBe(true);
  });
  it('returns false for different strings', () => {
    expect(isDeepEqual('light', 'dark')).toBe(false);
  });
  it('returns true for identical numbers', () => {
    expect(isDeepEqual(14, 14)).toBe(true);
  });
  it('returns false for different numbers', () => {
    expect(isDeepEqual(14, 16)).toBe(false);
  });
  it('returns true for identical booleans', () => {
    expect(isDeepEqual(true, true)).toBe(true);
  });
  it('returns false for different booleans', () => {
    expect(isDeepEqual(true, false)).toBe(false);
  });
  it('returns true for null === null', () => {
    expect(isDeepEqual(null, null)).toBe(true);
  });
  it('returns false for null vs non-null', () => {
    expect(isDeepEqual(null, 'a')).toBe(false);
  });
  it('returns true for undefined === undefined', () => {
    expect(isDeepEqual(undefined, undefined)).toBe(true);
  });
  it('returns false for mismatched types', () => {
    expect(isDeepEqual(1, '1')).toBe(false);
  });
});

describe('isDeepEqual — arrays', () => {
  it('returns true for identical arrays', () => {
    expect(isDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });
  it('returns false for arrays with different elements', () => {
    expect(isDeepEqual([1, 2], [1, 3])).toBe(false);
  });
  it('returns false for arrays of different length', () => {
    expect(isDeepEqual([1, 2], [1, 2, 3])).toBe(false);
  });
  it('returns true for empty arrays', () => {
    expect(isDeepEqual([], [])).toBe(true);
  });
  it('returns false when one is array and other is not', () => {
    expect(isDeepEqual([1], { 0: 1 })).toBe(false);
  });
});

describe('isDeepEqual — plain objects', () => {
  it('returns true for identical objects', () => {
    expect(isDeepEqual({ mode: 'light', version: '1' }, { mode: 'light', version: '1' })).toBe(
      true
    );
  });
  it('returns false for objects with different values', () => {
    expect(isDeepEqual({ mode: 'light' }, { mode: 'dark' })).toBe(false);
  });
  it('returns false for objects with different key counts', () => {
    expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });
  it('returns false for objects with different keys', () => {
    expect(isDeepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });
  it('returns true for empty objects', () => {
    expect(isDeepEqual({}, {})).toBe(true);
  });
  it('returns true for nested identical objects', () => {
    expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
  });
  it('returns false for nested objects with different values', () => {
    expect(isDeepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });
});

describe('isDeepEqual — settings state (real-world shapes)', () => {
  const defaults = { version: '1', mode: 'light', fontSize: 14, direction: 'ltr' };

  it('returns true when state equals defaults', () => {
    expect(isDeepEqual(defaults, { ...defaults })).toBe(true);
  });
  it('returns false when mode differs', () => {
    expect(isDeepEqual(defaults, { ...defaults, mode: 'dark' })).toBe(false);
  });
  it('returns false when version differs', () => {
    expect(isDeepEqual(defaults, { ...defaults, version: '2' })).toBe(false);
  });
});
