import type { SxProps, Theme } from '@mui/material/styles';

/** Layout for the DialogTitle row: title+date on the left, close button on the right. */
export const dialogTitleSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 1,
  pr: 1,
};
