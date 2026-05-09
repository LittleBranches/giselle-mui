import type { SxProps, Theme } from '@mui/material/styles';

import { pulseDot } from '../animations';
import type { HighlightedPaletteKey } from '../types';
import type { PaperSxParams, DateTypographySxParams } from './types';

/**
 * Styles for the `PhaseCard` component.
 *
 * Static constants are created once at module load — zero per-render allocation.
 * Dynamic factories (`(arg) => SxProps<Theme>`) create a new object on every call.
 * ⚠️ Performance note: if a dynamic factory is used inside a `.map()` on every
 * render, do not call hooks per item — that violates the Rules of Hooks.
 * Keep the factory cheap, or memoize the entire derived array at the component's
 * top level with `useMemo` if profiling shows a real need.
 */

// ── LabeledIconStrip ──────────────────────────────────────────────────────────

/** Section overline label inside a `LabeledIconStrip` (clients, tech stack, etc.). */
export const labeledIconStripLabelSx: SxProps<Theme> = {
  display: 'block',
  mb: 1,
  fontSize: '0.75rem',
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
 * If needed, memoize the entire mapped array at the call site with `useMemo`.
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

// ── Corner decorative icon ────────────────────────────────────────────────────

/**
 * Absolutely-positioned decorative icon Box in the top-right corner of a phase card.
 *
 * @param color - MUI palette key for the icon tint.
 * @param isOverduePending - When true, tints to error and reduces opacity.
 */
export const phaseCardIconBoxSx =
  (color: string, isOverduePending: boolean): SxProps<Theme> =>
  (theme) => ({
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Force the icon SVG to 32 × 32 via CSS instead of cloneElement,
    // so the icon element can remain an RSC-created React element.
    '& svg': { width: 32, height: 32 },
    color: isOverduePending
      ? theme.vars!.palette.error.main
      : ((theme.vars!.palette as unknown as Record<string, { main: string }>)[color]?.main ??
        theme.vars!.palette.primary.main),
    opacity: isOverduePending ? 0.55 : 0.35,
  });

/** Task toggle row — flex container for icon + title in the expanded detail list. */
export const taskRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  py: 0.25,
};

/** Task toggle icon button sx (interactive mode). */
export const taskToggleButtonSx: SxProps<Theme> = {
  all: 'unset',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  transition: 'color 0.2s',
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    borderRadius: '50%',
  },
};

/** Task toggle icon static (read-only mode). */
export const taskIconStaticSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  transition: 'color 0.2s',
};

/** Task title sx — done state passed dynamically. */
export const taskTitleSx = (isDone: boolean): SxProps<Theme> => ({
  color: isDone ? 'text.disabled' : 'text.secondary',
  lineHeight: 1.6,
  textDecoration: isDone ? 'line-through' : 'none',
  transition: 'color 0.2s, text-decoration 0.2s',
});

/** Task toggle icon colour sx — done state passed dynamically (interactive mode). */
export const taskToggleColorSx = (isDone: boolean): SxProps<Theme> => ({
  color: isDone ? 'success.main' : 'text.disabled',
  '&:hover': { color: isDone ? 'success.dark' : 'text.secondary' },
});

/** Task icon colour sx — done state passed dynamically (read-only mode). */
export const taskIconColorSx = (isDone: boolean): SxProps<Theme> => ({
  color: isDone ? 'success.main' : 'text.disabled',
});

// ── Paper root ────────────────────────────────────────────────────────────────

/** Returns the sx theme callback for the root Paper element of a PhaseCard. */
export function buildPaperSx(p: PaperSxParams) {
  return (theme: Theme) => ({
    p: 2.5,
    position: 'relative' as const,
    overflow: 'hidden',
    textAlign: p.textAlign ?? 'left',
    bgcolor: `rgba(${(theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']} / 0.08)`,
    transition: p.hasDetails
      ? 'box-shadow 0.2s, opacity 0.3s, filter 0.3s'
      : 'opacity 0.3s, filter 0.3s',
    ...(p.hasDetails && {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: `0 16px 40px rgba(${
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
          (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
        } / 0.22)`,
      },
      '&:focus-visible': {
        outline: '2px solid',
        outlineColor:
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.main ??
          theme.vars!.palette.primary.main,
        outlineOffset: 3,
      },
    }),
    ...(p.isDone && {
      opacity: 0.45,
      filter: 'grayscale(1)',
      '&:hover': {
        opacity: 1,
        filter: 'none',
        ...(p.hasDetails && {
          boxShadow: `0 16px 40px rgba(${
            theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
            (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
          } / 0.22)`,
        }),
      },
    }),
    ...(p.phaseSide === 'left' &&
      !p.isHighlighted && {
        bgcolor: 'background.paper',
        borderTop: '3px solid',
        borderColor: `${p.color ?? 'primary'}.main`,
        boxShadow: `0 8px 24px rgba(${
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
          (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
        } / 0.12)`,
      }),
    ...(p.isHighlighted && {
      borderLeft: '4px solid',
      borderColor: `${p.color}.main`,
      bgcolor: `rgba(${
        theme.vars!.palette[p.color as HighlightedPaletteKey]?.mainChannel ??
        (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
      } / ${p.isScenario ? 0.1 : 0.08})`,
    }),
    ...(p.isOverdue &&
      !p.isDone && {
        border: '2px solid',
        borderColor: 'error.main',
        boxShadow: `0 0 0 2px rgba(${theme.vars!.palette.error.mainChannel} / 0.2), 0 8px 32px rgba(${theme.vars!.palette.error.mainChannel} / 0.18)`,
      }),
    ...(p.suppressElevation && { boxShadow: 'none' }),
  });
}

// ── Date Typography ───────────────────────────────────────────────────────────

/** Returns the sx object for the phase date Typography element. */
export function buildDateTypographySx({
  isScenario,
  isHighlighted,
  hideDecoration,
  color,
}: DateTypographySxParams) {
  return {
    display: 'block',
    mb: 1.5,
    pr: !isHighlighted && !hideDecoration ? 6 : 0,
    fontSize: isScenario ? '0.875rem' : '0.8rem',
    fontWeight: isScenario ? 800 : undefined,
    letterSpacing: isScenario ? 0 : undefined,
    color: isScenario ? `${color ?? 'primary'}.main` : 'text.disabled',
  };
}

// ── CardDecoration gradient ───────────────────────────────────────────────────

/**
 * Rotating gradient rectangle that sits in the top-right corner of a PhaseCard.
 *
 * @param color - MUI palette key for the gradient colour (already resolved from phase.color).
 * @param isOverduePending - When true, switches to the error palette and raises opacity.
 */
export const buildCardDecorationGradientSx =
  (color: string, isOverduePending: boolean): SxProps<Theme> =>
  (theme) => ({
    top: -40,
    right: -56,
    width: 140,
    height: 140,
    borderRadius: 4,
    position: 'absolute',
    transform: 'rotate(40deg)',
    pointerEvents: 'none',
    background: `linear-gradient(to right, ${
      theme.vars!.palette[isOverduePending ? 'error' : (color as HighlightedPaletteKey)]?.main ??
      theme.vars!.palette.primary.main
    }, transparent)`,
    opacity: isOverduePending ? 0.18 : 0.08,
  });

// ── Corner alert tooltip ──────────────────────────────────────────────────────

/** Sx for the Tooltip popup in `CardCornerAlertBadge`. */
export const cornerAlertTooltipSx: SxProps<Theme> = {
  maxWidth: 320,
  px: 1.75,
  py: 1.25,
  bgcolor: 'grey.900',
  '& .MuiTooltip-arrow': { color: 'grey.900' },
};

// ── Pill icon box ─────────────────────────────────────────────────────────────

/**
 * Inline icon slot inside detail-count and similar pill badges.
 *
 * Forces the SVG to the exact icon size used by the pill.
 *
 * @param iconSize - Width and height applied to the `& svg` selector (px).
 */
export const pillIconBoxSx = (iconSize: number): SxProps<Theme> => ({
  display: 'inline-flex',
  flexShrink: 0,
  '& svg': { width: iconSize, height: iconSize },
});
