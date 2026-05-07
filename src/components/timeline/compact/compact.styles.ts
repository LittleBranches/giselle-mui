import type { SxProps, Theme } from '@mui/material/styles';

import type { HighlightedPaletteKey } from '../two-column/types';
import { channelAlpha } from '../../../utils/theme-utils';
import {
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_MILESTONE_ICON_SIZE,
  COMPACT_PHASE_DOT_SIZE,
  COMPACT_PHASE_ICON_SIZE,
} from './compact.const';

// ----------------------------------------------------------------------
// Static sx — created once at module load

export const accordionSummarySx: SxProps<Theme> = {
  minHeight: 56,
  py: 1,
  px: 2,
  display: 'flex',
  alignItems: 'center',
  '&.Mui-expanded': { minHeight: 56 },
  '& .MuiAccordionSummary-content': {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    my: 0,
    overflow: 'hidden',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
  },
};

export const accordionDetailsSx: SxProps<Theme> = {
  pt: 0,
  pb: 2,
  px: 2,
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
  mb: 1.5,
};

export const milestonesListSx: SxProps<Theme> = {
  m: 0,
  p: 0,
  mt: 1,
  listStyle: 'none',
};

export const milestoneItemSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  cursor: 'pointer',
  '&:hover': {
    bgcolor: channelAlpha('var(--mui-palette-grey-500Channel)', 0.06),
    borderRadius: 1,
  },
  transition: 'background-color 150ms',
  py: 1,
  px: 0.5,
};

export const milestoneDotColumnSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  width: COMPACT_MILESTONE_DOT_SIZE,
};

export const milestoneContentSx: SxProps<Theme> = {
  flexGrow: 1,
  overflow: 'hidden',
  pb: 0.5,
};

export const milestoneTitleSx: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const milestoneDescriptionPreviewSx: SxProps<Theme> = {
  color: 'text.secondary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  mt: 0.25,
};

export const milestoneDateSx: SxProps<Theme> = {
  color: 'text.secondary',
  flexShrink: 0,
  mt: 0.25,
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
    overflow: 'hidden',
    bgcolor: theme.vars?.palette[color].main ?? theme.palette[color].main,
    color: 'common.white',
    '& span': { display: 'flex', lineHeight: 0 },
    '& svg': { width: COMPACT_PHASE_ICON_SIZE, height: COMPACT_PHASE_ICON_SIZE },
  });

/**
 * Milestone dot — coloured circle with icon centered inside.
 */
export const milestoneDotSx =
  (color: HighlightedPaletteKey): SxProps<Theme> =>
  (theme) => ({
    width: COMPACT_MILESTONE_DOT_SIZE,
    height: COMPACT_MILESTONE_DOT_SIZE,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    bgcolor: theme.vars?.palette[color].main ?? theme.palette[color].main,
    color: 'common.white',
    '& span': { display: 'flex', lineHeight: 0 },
    '& svg': { width: COMPACT_MILESTONE_ICON_SIZE, height: COMPACT_MILESTONE_ICON_SIZE },
  });

/**
 * Accordion root sx factory — no border, hover background, done-fade opacity.
 * SSR-safe: uses CSS custom property string directly (no theme callback).
 */
/** Vertical connector line between milestone dots. */
export const milestoneConnectorLineSx: SxProps<Theme> = {
  width: 2,
  flexGrow: 1,
  minHeight: 16,
  bgcolor: 'divider',
  mt: 0.5,
};

export const accordionRootSx = (done: boolean): SxProps<Theme> => ({
  border: 'none',
  borderRadius: 2,
  boxShadow: 'none',
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: 0 },
  '&:hover': {
    bgcolor: channelAlpha('var(--mui-palette-grey-500Channel)', 0.08),
  },
  opacity: done ? 0.65 : 1,
  transition: 'opacity 300ms, background-color 300ms',
});
