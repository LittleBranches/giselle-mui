/**
 * Recursive deep equality check for plain values.
 *
 * Covers the full set of value types produced by `GiselleSettingsProvider` state:
 * - Primitives: `string`, `number`, `boolean`, `null`, `undefined`
 * - Plain arrays (element-by-element comparison)
 * - Plain objects (own enumerable key comparison, recursive)
 *
 * Out of scope (not needed for settings state): `Date`, `Map`, `Set`, `RegExp`,
 * `Symbol`, class instances. If passed, these are compared by reference only.
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object') {
    if (Array.isArray(b)) return false;
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
      if (!isDeepEqual(objA[key], objB[key])) return false;
    }
    return true;
  }

  return false;
}
