import type { StatCardColor } from '../components/card/stat/types';

// ----------------------------------------------------------------------

/**
 * Maps a maturity/readiness percentage to a MUI palette key.
 *
 * Colours follow **MUI semantic conventions** — not the mango visual palette.
 * The mango metaphor (green = unripe, golden = ripe) is brand language used
 * in release stage labels (`resolveMaturityLabel`) and docs. The colour
 * mapping here defers to MUI standards so components read correctly to any
 * MUI-fluent developer regardless of the brand story.
 *
 * | Range    | Palette key  | Semantic meaning      |
 * |----------|--------------|-----------------------|
 * | 0–19 %   | `'error'`    | Blocked / not started |
 * | 20–39 %  | `'warning'`  | Early / at risk       |
 * | 40–59 %  | `'info'`     | In progress           |
 * | 60–79 %  | `'primary'`  | On track              |
 * | 80–100 % | `'success'`  | Stable / shipped      |
 *
 * The function clamps the input to `[0, 100]` before mapping.
 *
 * **Typical usage — derive `color` from readiness data:**
 * ```tsx
 * <StatCard
 *   label="Store Readiness"
 *   value="35%"
 *   color={resolveMaturityColor(35)}
 * />
 * ```
 */
export function resolveMaturityColor(percent: number): StatCardColor {
  const clamped = Math.max(0, Math.min(100, percent));

  if (clamped >= 80) return 'success';
  if (clamped >= 60) return 'primary';
  if (clamped >= 40) return 'info';
  if (clamped >= 20) return 'warning';
  return 'error';
}

// ----------------------------------------------------------------------

/**
 * Returns a human-readable ripeness label for a maturity percentage.
 * Useful for `aria-label` text and tooltip descriptions.
 *
 * @example resolveMaturityLabel(35) → 'Early stage'
 */
export function resolveMaturityLabel(percent: number): string {
  const clamped = Math.max(0, Math.min(100, percent));

  if (clamped >= 80) return 'Stable';
  if (clamped >= 60) return 'Nearly ready';
  if (clamped >= 40) return 'In progress';
  if (clamped >= 20) return 'Early stage';
  return 'Not started';
}
