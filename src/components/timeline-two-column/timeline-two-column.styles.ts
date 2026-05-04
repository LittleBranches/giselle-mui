import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Styles for the `TimelineTwoColumn` root component and its local sub-components.
 *
 * Static constants are created once at module load — zero per-render allocation.
 * Dynamic factories create a new object on every call — memoize at the call site
 * if the component re-renders frequently with stable props.
 */

// ── TimelineColumn helper ─────────────────────────────────────────────────────

/**
 * Column Box inside the `TimelineColumn` layout helper.
 *
 * - Left column: right-aligned text, right padding, hidden on mobile when empty.
 * - Right column: left-aligned text, left padding, hidden on mobile when empty.
 *
 * @param columnSide - `'left'` or `'right'`.
 * @param hasContent - When false, the column is hidden on xs screens.
 * @param bottomPadding - Phase-card gap (px) added via `paddingBottom`.
 */
export const timelineColumnSx = (
  columnSide: 'left' | 'right',
  hasContent: boolean,
  bottomPadding: number
): SxProps<Theme> => ({
  flex: 1,
  textAlign: columnSide === 'left' ? 'right' : 'left',
  pr: columnSide === 'left' ? 2 : 0,
  pl: columnSide === 'right' ? 2 : 0,
  pt: 0.75,
  paddingBottom: `${bottomPadding}px`,
  display: { xs: hasContent ? 'block' : 'none', md: 'block' },
});

// ── Milestone row ─────────────────────────────────────────────────────────────

/**
 * Outer absolutely-positioned row that places a milestone dot + cards.
 *
 * @param topPercent - Vertical position as a percentage of the parent `<li>` height.
 */
export const msRowSx = (topPercent: number): SxProps<Theme> => ({
  position: 'absolute',
  top: `${topPercent}%`,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
});

/**
 * Left or right column Box inside a milestone row.
 *
 * Hidden on mobile when its `visible` condition is false (prevents phantom padding).
 *
 * @param visible - When false, the column is hidden on xs screens.
 */
export const msColumnBoxSx = (visible: boolean): SxProps<Theme> => ({
  flex: 1,
  position: 'relative',
  overflow: 'visible',
  display: { xs: visible ? 'block' : 'none', md: 'block' },
});

/**
 * Wrapper around the milestone dot — applies the blur+dim animation when another
 * card is expanded.
 *
 * @param blurred - When true, applies the blur, dim, and scale-down transition.
 */
export const msDotWrapperSx = (blurred: boolean): SxProps<Theme> => ({
  position: 'relative',
  display: 'inline-flex',
  transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
  ...(blurred && {
    filter: 'blur(1.5px)',
    opacity: 0.38,
    transform: 'scale(0.97)',
    pointerEvents: 'none',
  }),
});

// ── Floating date pill ────────────────────────────────────────────────────────

/**
 * Date pill that floats above a phase or milestone dot.
 *
 * Always `display: 'none'` — made visible via JS/CSS at the call site when needed.
 * Used identically in the phase dot and the milestone dot.
 */
export const floatingDatePillSx: SxProps<Theme> = {
  position: 'absolute',
  bottom: 'calc(100% + 4px)',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '0.65rem',
  fontWeight: 800,
  color: 'common.white',
  bgcolor: 'grey.700',
  px: 0.75,
  py: 0.125,
  borderRadius: 0.75,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 2,
  display: 'none',
};

// ── Marker phase row ──────────────────────────────────────────────────────────

/** `<li>` element for a `variant='marker'` phase — column-layout, min-height for dot. */
export const markerPhaseLiSx: SxProps<Theme> = {
  position: 'relative',
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  minHeight: 40,
};

/** Left label Box inside a marker row — right-aligned, flush against the spine. */
export const markerLeftLabelSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  pr: 1.5,
};

/** Centre Box in a marker row — contains the dot and spine connector. */
export const markerCenterSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
};

/** Right label Box inside a marker row — left-aligned, flush against the spine. */
export const markerRightLabelSx: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  pl: 1.5,
};

// ── Phase row ─────────────────────────────────────────────────────────────────

/**
 * Flex row that holds the left column, centre spine, and right column for a phase.
 *
 * Applies the blur+dim transition when another phase card is expanded.
 *
 * @param blurred - When true, applies blur, dim, and scale-down effect.
 */
export const phaseRowSx = (blurred: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
  ...(blurred && {
    filter: 'blur(1.5px)',
    opacity: 0.38,
    transform: 'scale(0.97)',
    pointerEvents: 'none',
  }),
  flex: 1,
});

// ── Phase <li> ────────────────────────────────────────────────────────────────

/**
 * The `<li>` wrapper for a full phase — flex column, z-index management, and
 * optional computed `minHeight` when milestones are present.
 *
 * @param zIndex - 1 when no milestone is expanded, 2 when one is.
 * @param computedMinHeight - Pre-computed min-height value. Pass `undefined` when no milestones.
 */
export const phaseLiSx = (opts: { zIndex: 1 | 2; computedMinHeight?: number }): SxProps<Theme> => ({
  position: 'relative',
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  zIndex: opts.zIndex,
  // CSS :has() raises this <li> when any milestone card within it is hovered,
  // preventing the next <li>'s phase card from painting over the hovered card.
  // Supported: Chrome 121+, Firefox 121+, Safari 17+ (within browser support matrix).
  '&:has([data-ms-card]:hover)': { zIndex: 3 },
  ...(opts.computedMinHeight !== undefined && { minHeight: opts.computedMinHeight }),
});
