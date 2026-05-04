import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Floating year-boundary chip overlaid at the bottom of the spine connector.
 *
 * Dynamic — `marginBottom` controls vertical positioning.
 *
 * ⚠️ Performance note: returns a new object on every call.
 * The parent `SpineConnector` passes `yearLabelMarginBottom` which rarely changes,
 * so the cost is negligible in practice.
 */
export const yearLabelSx = (marginBottom: number): SxProps<Theme> => ({
  position: 'absolute',
  bottom: `${marginBottom}px`,
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  px: 1,
  py: 0.25,
  lineHeight: 1.6,
  borderRadius: 1,
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: 0.5,
  bgcolor: 'background.paper',
  color: 'text.primary',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: 1,
  zIndex: 1,
});
