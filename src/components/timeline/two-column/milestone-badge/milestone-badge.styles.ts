import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Styles for the `MilestoneBadge` component.
 *
 * Static constants are created once at module load — zero per-render allocation.
 * Dynamic factories (`(arg) => SxProps<Theme>`) create a new object on every call.
 *
 * Size values that are referenced by exported constants in `milestone-badge.tsx`
 * (e.g. `MILESTONE_EYE_BUTTON_MIN_SIZE`, `MILESTONE_DATE_FONT_SIZE`) are passed as
 * parameters to the relevant factory so the component and styles file stay in sync.
 */

// ── "New" badge row ───────────────────────────────────────────────────────────

/**
 * Row container for the "New" indicator (dot + label).
 *
 * @param rightAlign - When true, justifies content to the right (left-column cards).
 */
export const milestoneNewBadgeRowSx = (rightAlign: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  mb: 0.5,
  justifyContent: rightAlign ? 'flex-end' : undefined,
});

/** Status dot in the "New" indicator — 12px minimum (readability rule), success-green. */
export const milestoneNewDotSx: SxProps<Theme> = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  bgcolor: 'success.main',
  flexShrink: 0,
};

/** Typography for the "New" label beside the dot — always success-green. */
export const milestoneNewLabelSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'success.main',
  lineHeight: 1,
};

// ── Date label ────────────────────────────────────────────────────────────────

/**
 * Date label Typography above the milestone title.
 *
 * @param fontSize - Font size token. Defaults to `'0.875rem'` (`MILESTONE_DATE_FONT_SIZE`).
 */
export const milestoneDateSx = (fontSize: string = '0.875rem'): SxProps<Theme> => ({
  color: 'text.secondary',
  fontSize,
  display: 'block',
  mb: 0.5,
});

// ── Title row ─────────────────────────────────────────────────────────────────

/**
 * Row that holds the eye button(s) and the milestone title.
 *
 * @param rightAlign - When true, justifies content to the right (left-column cards).
 */
export const milestoneTitleRowSx = (rightAlign: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  justifyContent: rightAlign ? 'flex-end' : 'flex-start',
});

// ── Eye button ────────────────────────────────────────────────────────────────

/**
 * Viewed eye button inline in the milestone title row.
 *
 * @param isViewed - Controls colour and hover state.
 * @param minSize - Minimum tap target size in px. Defaults to 28 (`MILESTONE_EYE_BUTTON_MIN_SIZE`).
 */
export const milestoneEyeButtonSx = (opts: {
  isViewed: boolean;
  minSize?: number;
}): SxProps<Theme> => ({
  flexShrink: 0,
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

// ── Expandable details pill ───────────────────────────────────────────────────

/** Collapsed detail-count pill — shows item count before expansion. */
export const milestoneDetailPillSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  mt: 0.5,
  mb: 0.25,
  px: 0.625,
  py: 0.2,
  borderRadius: 0.75,
  bgcolor: 'action.hover',
  color: 'text.secondary',
};

// ── Detail bullet list ────────────────────────────────────────────────────────
// These constants match the shape used in `phase-card.styles.ts` for consistency
// across the timeline family. They are defined independently here to avoid a
// cross-dependency between styles files.

/** Expanded detail list container — separator border above, column flex layout. */
export const milestoneDetailListSx: SxProps<Theme> = {
  mt: 1.5,
  pt: 1.5,
  borderTop: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
};

/** Individual detail bullet row — bullet glyph + detail text side by side. */
export const milestoneDetailRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  alignItems: 'flex-start',
  textAlign: 'left',
};

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
