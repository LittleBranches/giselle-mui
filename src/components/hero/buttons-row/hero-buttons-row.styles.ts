import type { SxProps, Theme } from '@mui/material/styles';

/** Outer flex container for the button row. */
export const rowSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: { xs: 1.25, sm: 1.5 },
};

/** Applied to each MUI `Button` to maintain consistent minimum dimensions. */
export const buttonSx: SxProps<Theme> = {
  minWidth: 156,
  height: 48,
  borderColor: 'currentColor',
};
