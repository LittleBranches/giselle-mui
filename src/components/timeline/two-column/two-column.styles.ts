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
 * - Left column: right-aligned text, right padding, always hidden on xs (cards shift to right slot on mobile).
 * - Right column: left-aligned text, left padding, always visible on xs.
 * - Both columns always `display:block` on md — an empty column must stay in the
 *   flex row so the centre spine remains equidistant from both edges. Hiding it via
 *   `display:none` removes the column from flow and shifts the spine off-centre.
 *
 * @param columnSide - `'left'` or `'right'`.
 * @param hasContent - Passed through from the parent; content rendering is guarded
 *   by the caller, but the column box itself is always in the flex row on md.
 * @param bottomPadding - Phase-card gap (px) added via `paddingBottom`.
 */
export const timelineColumnSx = (
  columnSide: 'left' | 'right',
  _hasContent: boolean,
  bottomPadding: number
): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  textAlign: columnSide === 'left' ? 'right' : 'left',
  pr: columnSide === 'left' ? 2 : 0,
  pl: columnSide === 'right' ? 2 : 0,
  pt: 0.75,
  paddingBottom: `${bottomPadding}px`,
  // xs: left column hidden (all cards move to right slot on mobile).
  // md: BOTH columns always in layout — keeps the centre spine centred.
  display: {
    xs: columnSide === 'left' ? 'none' : 'block',
    md: 'block',
  },
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
 * - Left column: always hidden on xs (milestone cards shift to the right slot on mobile).
 * - Right column: always visible on xs (receives all cards on mobile).
 * - Both columns always `display:block` on md — same reasoning as `timelineColumnSx`:
 *   removing a column from flow shifts the centre spine off-centre.
 *
 * @param columnSide - `'left'` or `'right'`.
 * @param visible - Content rendering is guarded by the caller; the column box itself
 *   is always in the flex row on md so the spine stays centred.
 */
export const msColumnBoxSx = (columnSide: 'left' | 'right', _visible: boolean): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  position: 'relative',
  overflow: 'visible',
  display: {
    xs: columnSide === 'right' ? 'block' : 'none',
    md: 'block',
  },
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
  fontSize: '0.875rem',
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

/**
 * Flex slot (layout container) that positions the left or right floating label
 * in a marker row.
 *
 * **Named `*SlotSx`, not `*LabelSx`:** this is a structural container, not the label
 * itself. The label (`MarkerLabel`, styled via `markerCaptionSx`) is the child content —
 * the slot only positions it against the spine. Naming by structural role (slot) rather
 * than by current child content (label) prevents the name from becoming misleading if the
 * slot ever holds a different child.
 *
 * **Unified into a factory:** the left and right variants differ only in alignment and
 * padding — identical in structure. Two static constants would duplicate that structure
 * and diverge silently during refactors. This follows the same pattern as `timelineColumnSx`
 * and `msColumnBoxSx` already in this file: every left/right pair is a single factory
 * taking a `side` argument.
 *
 * @param side - `'left'` or `'right'`.
 */
export const markerLabelSlotSx = (side: 'left' | 'right'): SxProps<Theme> => ({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  // xs: left slot hidden — label shifts to the right slot on mobile.
  // Right slot is always visible.
  display: side === 'left' ? { xs: 'none', md: 'flex' } : 'flex',
  justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
  alignItems: 'center',
  pr: side === 'left' ? 1.5 : 0,
  pl: side === 'right' ? 1.5 : 0,
});

/** Centre Box in a marker row — contains the dot and spine connector. */
export const markerCenterSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  position: 'relative',
};

/** Inner flex row for a `variant='marker'` phase — horizontal, centred. */
export const markerRowInnerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

/** Caption `Typography` for the left/right floating label in a marker row. */
export const markerCaptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

/** Inline date `Box` span appended to a marker label. */
export const markerDateSpanSx: SxProps<Theme> = {
  ml: 0.75,
  fontWeight: 400,
  opacity: 0.7,
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
  minWidth: 0,
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

// ── Milestone card wrapper ────────────────────────────────────────────────────

/**
 * Absolutely-positioned Box that wraps a `MilestoneBadge`.
 *
 * - Floats the card to the left or right of the spine, centred vertically on its dot.
 * - `translateY(-50%)` aligns the card midpoint to the dot centre (dot height = 30px).
 * - When `suppressElevation` is true (another card is open), blurs and dims.
 * - `side='left'` offsets from the right edge (inward from spine); `'right'` from the left.
 *
 * @param isExpanded - True when this specific card is the currently open one.
 * @param suppressElevation - True when any other card is open.
 * @param side - Which column this card lives in — controls left/right inset.
 */
export const msCardWrapperSx =
  (isExpanded: boolean, suppressElevation: boolean, side: 'left' | 'right'): SxProps<Theme> =>
  (theme) => ({
    position: 'absolute',
    zIndex: isExpanded ? 1000 : 1,
    transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
    // Raise hovered card above adjacent phase cards so it is never overlapped.
    '&:hover': { zIndex: 999 },
    // translateY(-50%) centres the card vertically on its dot.
    transform: 'translateY(-50%)',
    ...(suppressElevation && {
      filter: 'blur(1.5px)',
      opacity: 0.38,
      transform: 'scale(0.97) translateY(-50%)',
      pointerEvents: 'none',
    }),
    top: '15px',
    left: side === 'right' ? theme.spacing(2) : 0,
    right: side === 'left' ? theme.spacing(2) : 0,
  });

// ── Centre column ─────────────────────────────────────────────────────────────

/**
 * Centre column Box — used for both the phase dot column and the milestone dot column.
 * Flex column with centred items; `flexShrink: 0` prevents the spine from being squeezed
 * at narrow viewport widths.
 */
export const centerColumnSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
};

// ── Timeline MUI root ─────────────────────────────────────────────────────────

/**
 * MUI `<Timeline>` root sx — resets default padding/margin and removes the
 * pseudo-element that MUI adds before every `TimelineItem`.
 */
export const timelineRootSx: SxProps<Theme> = {
  p: 0,
  m: 0,
  overflowX: 'hidden',
  '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 },
};

// ── Phase dot ─────────────────────────────────────────────────────────────────

/**
 * Wrapper around the phase dot and its floating date pill.
 *
 * `position: relative` is required so the absolutely-positioned pill floats
 * above the dot without affecting the row's layout flow.
 * `display: inline-flex` keeps the wrapper tight to the dot's own size.
 */
export const phaseDotWrapperSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};
