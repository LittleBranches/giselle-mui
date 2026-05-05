import type { StatCardColor } from '../components/card/stat/types';

// ----------------------------------------------------------------------

/**
 * Maps a maturity/readiness percentage to a MUI palette key following the
 * Giselle mango ripeness scale:
 *
 * | Range      | Palette key  | Ripeness metaphor           |
 * |------------|--------------|-----------------------------|
 * | 0–19 %     | `'error'`    | 🟢 unripe — not ready       |
 * | 20–39 %    | `'warning'`  | 🟡 green-yellow — early     |
 * | 40–59 %    | `'info'`     | 🟠 turning — in progress    |
 * | 60–79 %    | `'primary'`  | 🟠 golden — nearly ripe     |
 * | 80–89 %    | `'success'`  | ✅ ripe — stable            |
 * | 90–100 %   | `'success'`  | 🟤 amber — LTS / shipped    |
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
 *
 * **Playground slider:**
 * ```tsx
 * const [pct, setPct] = useState(50);
 * <Slider value={pct} onChange={(_, v) => setPct(v as number)} />
 * <StatCard color={resolveMaturityColor(pct)} ... />
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
