import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Mini Gantt ruler track — the background bar behind phase sliders. */
export const ganttTrackSx: SxProps<Theme> = {
  position: 'relative',
  height: 20,
  borderRadius: 1,
  bgcolor: 'action.hover',
};

/** Popover Paper container — fixed width column layout. */
export const popoverPaperSx: SxProps<Theme> = {
  width: 340,
  p: 2,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

/** Slider row header — phase title left, date range right. */
export const sliderRowHeaderSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 0.25,
};

/** Actions row — sequential-fix button left, apply/cancel right. */
export const actionsRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1,
};
