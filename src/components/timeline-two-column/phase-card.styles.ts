import type { SxProps, Theme } from '@mui/material/styles';

import { pulseDot } from './animations';

/**
 * Styles for the `PhaseCard` component.
 *
 * Static constants are created once at module load — zero per-render allocation.
 * Dynamic factories (`(arg) => SxProps<Theme>`) create a new object on every call.
 * ⚠️ Performance note: if a dynamic factory is called inside a `.map()` that runs
 * on every render, wrap the call site in `useMemo` if the phase array is stable.
 *
 * Size values that are referenced by exported constants in `phase-card.tsx`
 * (e.g. `ACTIVE_DOT_SIZE`, `EYE_BUTTON_MIN_SIZE`) are passed as parameters to the
 * relevant factory so the component and styles file stay in sync automatically.
 */

// ── LabeledIconStrip ──────────────────────────────────────────────────────────

/** Section overline label inside a `LabeledIconStrip` (clients, tech stack, etc.). */
export const labeledIconStripLabelSx: SxProps<Theme> = {
  display: 'block',
  mb: 1,
  fontSize: '0.65rem',
  color: 'text.disabled',
};

// ── CardDetailBullets ─────────────────────────────────────────────────────────

/** Collapse container that holds the expandable detail bullet list. */
export const detailBulletsContainerSx: SxProps<Theme> = {
  mt: 1.5,
  pt: 1.5,
  borderTop: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
};

/** Individual bullet row — bullet glyph + detail text side by side. */
export const detailBulletsRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  alignItems: 'flex-start',
  textAlign: 'left',
};

// ── CardCornerAlertBadge ──────────────────────────────────────────────────────

/** Tooltip content column — stacks alert rows with spacing. */
export const tooltipAlertListSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  py: 0.5,
  px: 0.25,
};

/**
 * Corner alert badge circle.
 *
 * Dynamic — position, error state, and click behaviour all affect rendering.
 *
 * @param positionOverride - `{ left: 0 }` for left-column cards, `{ right: 0 }` for right-column.
 * @param transform - CSS transform string from `resolveCornerBadgeAlign`.
 * @param hasError - true → error.main background; false → warning.dark.
 * @param hasClickHandler - true → pointer cursor; false → help cursor.
 * @param badgeSize - Pixel size of the circle. Defaults to 26 (`CORNER_ALERT_BADGE_SIZE`).
 */
export const cornerBadgeCircleSx =
  (opts: {
    positionOverride: { left?: number; right?: number };
    transform: string;
    hasError: boolean;
    hasClickHandler: boolean;
    badgeSize?: number;
  }): SxProps<Theme> =>
  (theme) => ({
    position: 'absolute',
    top: 0,
    ...opts.positionOverride,
    zIndex: 10,
    transform: opts.transform,
    width: opts.badgeSize ?? 26,
    height: opts.badgeSize ?? 26,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: opts.hasError ? 'error.main' : 'warning.dark',
    color: 'common.white',
    boxShadow: `0 2px 6px rgba(${(theme.vars!.palette.grey as unknown as Record<string, string>)['900Channel']} / 0.3)`,
    cursor: opts.hasClickHandler ? 'pointer' : 'help',
    pointerEvents: 'auto',
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: opts.hasError ? 'error.main' : 'warning.dark',
      outlineOffset: 2,
    },
  });

// ── NewBadge / ActiveBadge ────────────────────────────────────────────────────

/** Shared flex row wrapper for NewBadge and ActiveBadge. */
export const statusBadgeWrapperSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  mb: 1,
};

/** Pulsing dot for the `NewBadge` — always success-green. */
export const newStatusDotSx = (dotSize: number): SxProps<Theme> => ({
  width: dotSize,
  height: dotSize,
  borderRadius: '50%',
  flexShrink: 0,
  bgcolor: 'success.main',
  animation: `${pulseDot} 1.4s ease-in-out infinite`,
});

/** Status label typography for `NewBadge` — always success-green. */
export const newStatusLabelSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: 0.8,
  lineHeight: 1.6,
  color: 'success.main',
};

/**
 * Pulsing dot for `ActiveBadge` — tinted to the phase palette `color`.
 *
 * ⚠️ Performance note: called inside `.map()` indirectly via sub-component render.
 */
export const activeDotSx = (color: string, dotSize: number): SxProps<Theme> => ({
  width: dotSize,
  height: dotSize,
  borderRadius: '50%',
  flexShrink: 0,
  bgcolor: `${color}.main`,
  animation: `${pulseDot} 1.4s ease-in-out infinite`,
});

/** Status label typography for `ActiveBadge` — tinted to phase palette `color`. */
export const activeStatusLabelSx = (color: string): SxProps<Theme> => ({
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: 0.8,
  lineHeight: 1.6,
  color: `${color}.main`,
});

// ── ScenarioBadge ─────────────────────────────────────────────────────────────

/** Pill label for scenario cards — soft tint of the phase color. */
export const scenarioBadgeSx = (color: string): SxProps<Theme> => ({
  display: 'inline-block',
  mb: 1,
  px: 1,
  py: 0.25,
  borderRadius: 0.75,
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: 0.8,
  color: `${color}.dark`,
  bgcolor: `rgba(var(--mui-palette-${color}-mainChannel) / 0.12)`,
});

// ── Main PhaseCard render ─────────────────────────────────────────────────────

/** Collapsed details-count pill — shows item count before expansion. */
export const detailCountPillSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  mb: 1,
  px: 0.75,
  py: 0.25,
  borderRadius: 1,
  bgcolor: 'action.hover',
  color: 'text.secondary',
};

/** Logo/icon strip container — used for clients and projects strips (gap: 2.5). */
export const logoStripSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 2.5,
};

/** Client logo `<img>` — sized, contained, greyscale until hover. */
export const clientLogoSx: SxProps<Theme> = {
  height: 40,
  width: 'auto',
  maxWidth: 140,
  objectFit: 'contain',
  opacity: 0.7,
  filter: 'grayscale(1)',
  transition: 'opacity 0.2s, filter 0.2s',
  '&:hover': { opacity: 1, filter: 'none' },
};

/** Platform/tech-stack strip container (gap: 1 — tighter than logo strips). */
export const platformStripSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 1,
};

/** Project logo `<img>` — smaller than client logos, subtle hover opacity. */
export const projectLogoSx: SxProps<Theme> = {
  height: 28,
  width: 'auto',
  maxWidth: 100,
  objectFit: 'contain',
  opacity: 0.85,
  transition: 'opacity 0.2s',
  '&:hover': { opacity: 1 },
};

// ── Viewed eye button ─────────────────────────────────────────────────────────

/**
 * Eye button that floats outside the card at the bottom outer edge.
 *
 * @param columnSide - `'left'` pins the button to the left outer edge; `'right'` to the right.
 * @param isViewed - Controls color and hover state.
 * @param minSize - Minimum tap target size in px. Defaults to 28 (`EYE_BUTTON_MIN_SIZE`).
 */
export const eyeButtonSx = (opts: {
  columnSide: 'left' | 'right';
  isViewed: boolean;
  minSize?: number;
}): SxProps<Theme> => ({
  position: 'absolute',
  bottom: 0,
  ...(opts.columnSide === 'left' ? { left: 0 } : { right: 0 }),
  transform: 'translate(0, calc(100% + 8px))',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: opts.minSize ?? 28,
  minHeight: opts.minSize ?? 28,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  p: 0,
  color: opts.isViewed ? 'success.main' : 'text.secondary',
  transition: 'color 0.15s',
  '&:hover': { color: opts.isViewed ? 'success.dark' : 'text.primary' },
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: opts.isViewed ? 'success.main' : 'primary.main',
    outlineOffset: 2,
    borderRadius: 0.5,
  },
});

// ── Photos ────────────────────────────────────────────────────────────────────

/**
 * Photo `<img>` element inside a phase card.
 *
 * The top margin differs between the first photo and subsequent ones:
 * - First photo: `mt: 2` — extra breathing room after the description.
 * - Additional photos: `mt: 1` — tighter gap within the photo strip.
 *
 * ⚠️ Performance note: this factory creates a new object on every call.
 * It is called inside `.map()` — keep it cheap (no heavy derivations).
 *
 * @param isFirst - True for the first photo in the array (`i === 0`).
 */
export const photoImgSx = (isFirst: boolean): SxProps<Theme> => ({
  mt: isFirst ? 2 : 1,
  width: '100%',
  maxWidth: 200,
  aspectRatio: '4/3',
  objectFit: 'cover',
  borderRadius: 1.5,
  border: '2px solid',
  borderColor: 'divider',
  display: 'block',
});
