import type { SxProps, Theme } from '@mui/material/styles';

export const taskDetailsSummarySx: SxProps<Theme> = {
  color: 'text.secondary',
  mb: 2,
};

export const taskDetailsContentSx: SxProps<Theme> = {
  display: 'grid',
  gap: 2,
};

export const taskDetailsEmptyStateSx: SxProps<Theme> = {
  color: 'text.disabled',
};
