import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Opening decorative quotation mark glyph.
 *
 * Dynamic — tints to the card's palette `color`.
 *
 * ⚠️ Performance note: returns a new object on every call.
 * Wrap in `useMemo` if the component re-renders frequently with a stable `color`.
 */
export const quoteMarkSx = (color: string): SxProps<Theme> => ({
  lineHeight: 1,
  fontSize: '4rem',
  color: `${color}.main`,
  opacity: 0.4,
  fontFamily: 'Georgia, serif',
  userSelect: 'none',
  flexShrink: 0,
  mt: -0.5,
});

/**
 * Body text of the quote — italicised, light-weight, readable line height.
 */
export const quoteTextSx: SxProps<Theme> = {
  fontStyle: 'italic',
  fontWeight: 'fontWeightLight',
  color: 'text.secondary',
  lineHeight: 1.85,
};
