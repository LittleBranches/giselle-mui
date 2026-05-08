import type { SxProps, Theme } from '@mui/material/styles';

/** Layout for the DialogTitle row: title+date on the left, close button on the right. */
export const dialogTitleSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 1,
  pr: 1,
};

export const dialogDateSx: SxProps<Theme> = {
  color: 'text.secondary',
  mt: 0.25,
};

export const dialogSummarySx = (hasTasks: boolean): SxProps<Theme> => ({
  color: 'text.secondary',
  mb: hasTasks ? 2 : 0,
});

export const dialogEmptyStateSx: SxProps<Theme> = {
  color: 'text.disabled',
};
