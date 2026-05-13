/**
 * Recursively merges two plain objects (no arrays, no class instances).
 *
 * `override` values win over `base` values at every depth level.
 * Arrays and non-plain-object values are replaced wholesale, not merged.
 *
 * Used internally by `GiselleThemeProvider` to merge `themeOverrides`
 * on top of `giselleThemeOptions` before passing the result to `extendTheme()`.
 */
export function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...(base as Record<string, unknown>) } as Record<string, unknown>;
  const src = override as Record<string, unknown>;

  for (const key in src) {
    const baseVal = result[key];
    const overrideVal = src[key];

    if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>
      );
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal;
    }
  }

  return result as T;
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return (
    typeof val === 'object' &&
    val !== null &&
    !Array.isArray(val) &&
    Object.getPrototypeOf(val) === Object.prototype
  );
}
