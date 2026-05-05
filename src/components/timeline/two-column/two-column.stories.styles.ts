import type { SxProps } from '@mui/material/styles';

// Storybook-only sx constants.
// Not part of the production build — only imported by stories.tsx.

/** Column indicator box (ColumnPlacementInvariant story). */
export const storyColumnIndicatorSx = (borderColor: string): SxProps => ({
  flex: 1,
  p: 1.5,
  border: '2px dashed',
  borderColor,
  borderRadius: 1,
});

/** Overline section label (DotTooltipAddedValue story). */
export const storyOverlineSx: SxProps = {
  display: 'block',
  mb: 1,
  px: 3,
  color: 'text.secondary',
};

/** Responsive breakpoint preview box (Responsive story). */
export const storyResponsiveBoxSx = (width: number): SxProps => ({
  width,
  overflow: 'auto',
  border: '1px dashed',
  borderColor: 'divider',
});

/** Demo "play sound" button inside the footer slot (FooterSlot story). */
export const storyFooterButtonSx: SxProps = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  px: 1.25,
  py: 0.5,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  bgcolor: 'transparent',
  cursor: 'pointer',
  color: 'text.secondary',
  fontSize: '0.75rem',
  fontWeight: 600,
  '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
};
