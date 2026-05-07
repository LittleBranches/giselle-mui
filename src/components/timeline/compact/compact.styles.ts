import type { SxProps, Theme } from '@mui/material/styles';

import type { HighlightedPaletteKey } from '../two-column/types';
import {
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_PHASE_DOT_SIZE,
  COMPACT_PHASE_ICON_SIZE,
} from './compact.const';

// ----------------------------------------------------------------------
// Static sx — created once at module load

export const accordionSx: SxProps<Theme> = {
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  boxShadow: 'none',
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: 0, mt: 1 },
  '&.Mui-expanded:first-of-type': { mt: 0 },
};

export const accordionSummarySx: SxProps<Theme> = {
  minHeight: 48,
  px: 1.5,
  '&.Mui-expanded': { minHeight: 48 },
  '& .MuiAccordionSummary-content': {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    my: 1,
    overflow: 'hidden',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'text.secondary',
  },
};

export const accordionDetailsSx: SxProps<Theme> = {
  pt: 0,
  pb: 1.5,
  px: 1.5,
};

export const phaseIconWrapperSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: COMPACT_PHASE_ICON_SIZE, height: COMPACT_PHASE_ICON_SIZE },
  color: 'common.white',
};

export const phaseTitleSx: SxProps<Theme> = {
  flexGrow: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const dateSx: SxProps<Theme> = {
  color: 'text.secondary',
  flexShrink: 0,
  ml: 0.5,
};

export const descriptionSx: SxProps<Theme> = {
  color: 'text.secondary',
};

export const milestonesListSx: SxProps<Theme> = {
  mt: 1.5,
  pl: 1.5,
  borderLeft: '2px solid',
  borderColor: 'divider',
};

export const milestoneRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  py: 0.5,
};

// ----------------------------------------------------------------------
// Dynamic sx factories — accept resolved props, return SxProps

/**
 * Background color for the phase summary dot.
 * Uses `theme.vars.palette[color].main` (CSS variables mode) with a fallback
 * to `theme.palette[color].main` for environments without CSS variables.
 */
export const phaseDotSx =
  (color: HighlightedPaletteKey): SxProps<Theme> =>
  (theme) => ({
    width: COMPACT_PHASE_DOT_SIZE,
    height: COMPACT_PHASE_DOT_SIZE,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: theme.vars?.palette[color].main ?? theme.palette[color].main,
  });

/**
 * Background color for each milestone dot row.
 */
export const milestoneDotSx =
  (color: HighlightedPaletteKey): SxProps<Theme> =>
  (theme) => ({
    width: COMPACT_MILESTONE_DOT_SIZE,
    height: COMPACT_MILESTONE_DOT_SIZE,
    borderRadius: '50%',
    flexShrink: 0,
    bgcolor: theme.vars?.palette[color].main ?? theme.palette[color].main,
  });

/**
 * Reduced opacity on the accordion root when the phase is `done`.
 * Communicates completed state while preserving readability.
 */
export const doneFadeSx = (done: boolean): SxProps<Theme> => ({
  opacity: done ? 0.65 : 1,
  transition: 'opacity 200ms',
});

/**
 * Combined accordion root sx factory — merges static base styles with done-fade.
 * Returns a single `SxProps` object (not an array) so the value is compatible
 * with both `@mui/material` and `@mui/lab` component `sx` prop types.
 */
export const accordionRootSx = (done: boolean): SxProps<Theme> => ({
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  boxShadow: 'none',
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: 0, mt: 1 },
  '&.Mui-expanded:first-of-type': { mt: 0 },
  opacity: done ? 0.65 : 1,
  transition: 'opacity 200ms',
});
