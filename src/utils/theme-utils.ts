/**
 * Theme utility helpers for MUI v7 CSS Variables mode.
 *
 * These are commonly needed when building themes with `extendTheme()` and
 * `theme.vars.palette.*`. They are intentionally tiny, dependency-free, and
 * safe to use in any consumer project alongside `@mui/material` v7.
 */

// ----------------------------------------------------------------------

/**
 * Produces an `rgba(r, g, b, alpha)` string from a CSS-variable channel value.
 *
 * MUI v7 CSS Variables mode exposes palette colours as space-separated RGB
 * channels (e.g. `theme.vars.palette.primary.mainChannel → "99 102 241"`).
 * This helper converts that channel string + an alpha value to a valid CSS
 * colour expression.
 *
 * @param channel - Space-separated RGB string, e.g. `"99 102 241"`. Matches the
 *   format of `theme.vars.palette[color].mainChannel` in MUI v7.
 * @param alpha - Opacity value between `0` (fully transparent) and `1` (fully opaque).
 * @returns A valid `rgba(...)` CSS string.
 *
 * @example
 * ```tsx
 * sx={(theme) => ({
 *   backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
 * })}
 * ```
 */
export function varAlpha(channel: string, alpha: number): string {
  return `rgba(${channel.replace(/ /g, ', ')}, ${alpha})`;
}

// ----------------------------------------------------------------------

/**
 * Converts a hex colour string to a space-separated RGB channel string
 * compatible with MUI v7 CSS Variables palette channels.
 *
 * Use this when you need to define a custom colour in a theme that uses
 * `varAlpha` for tinting. The output can be stored as a custom channel and
 * passed to `varAlpha`.
 *
 * @param hex - A 6-digit hex colour string with or without the `#` prefix,
 *   e.g. `"#6366f1"` or `"6366f1"`.
 * @returns A space-separated RGB channel string, e.g. `"99 102 241"`.
 * @throws {Error} If the hex value cannot be parsed (invalid format).
 *
 * @example
 * ```ts
 * const channel = createPaletteChannel('#6366f1'); // "99 102 241"
 * varAlpha(channel, 0.08);                         // "rgba(99, 102, 241, 0.08)"
 * ```
 */
export function createPaletteChannel(hex: string): string {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  if (clean.length !== 6) {
    throw new Error(`createPaletteChannel: expected a 6-digit hex value, got "${hex}"`);
  }
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    throw new Error(`createPaletteChannel: invalid hex value "${hex}"`);
  }
  return `${r} ${g} ${b}`;
}

// ----------------------------------------------------------------------

/**
 * Converts a pixel value to a `rem` string using a 16px root font size baseline.
 *
 * Useful for defining typography scales in `extendTheme()` where rem units are
 * preferred for accessibility (user font-size overrides apply).
 *
 * @param px - The pixel value to convert (e.g. `14`).
 * @returns A `rem` string (e.g. `"0.875rem"`).
 *
 * @example
 * ```ts
 * pxToRem(14)  // "0.875rem"
 * pxToRem(16)  // "1rem"
 * pxToRem(24)  // "1.5rem"
 * ```
 */
export function pxToRem(px: number): string {
  return `${px / 16}rem`;
}

// ----------------------------------------------------------------------

/**
 * Converts a `rem` value to its pixel equivalent using a 16px root font size baseline.
 *
 * Useful when consuming a typography scale defined in `rem` and needing a numeric
 * pixel value for canvas calculations, fixed-size containers, or Storybook annotations.
 *
 * @param rem - The rem value to convert (e.g. `0.875`).
 * @returns The pixel value as a number (e.g. `14`).
 *
 * @example
 * ```ts
 * remToPx(0.875)  // 14
 * remToPx(1)      // 16
 * remToPx(1.5)    // 24
 * ```
 */
export function remToPx(rem: number): number {
  return rem * 16;
}
