import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Root `ButtonBase` sx for `SelectableCard`.
 *
 * Handles: layout reset, Paper-like surface, hover, keyboard focus ring,
 * selected ring (via box-shadow), and disabled state.
 *
 * @param selected - Whether the card is currently selected.
 */
export const selectableCardSx =
  (selected: boolean): SxProps<Theme> =>
  (theme) => ({
    // --- Layout reset (ButtonBase is inline-flex by default) ---
    display: 'block',
    width: '100%',
    textAlign: 'left',
    // --- Paper-like surface ---
    p: 2.5,
    borderRadius: 1.5,
    position: 'relative',
    overflow: 'hidden', // Contains the MUI ripple within the border-radius
    border: `1px solid ${theme.vars!.palette.divider}`,
    bgcolor: theme.vars!.palette.background.paper,
    // --- Hover: subtle fill, cursor affordance ---
    cursor: 'pointer',
    transition: theme.transitions.create(['background-color', 'box-shadow'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      bgcolor: theme.vars!.palette.action.hover,
    },
    // --- Keyboard focus ring ---
    // .Mui-focusVisible is applied by ButtonBase on keyboard navigation only,
    // so mouse users never see this ring (good UX + meets WCAG 2.4.11).
    '&.Mui-focusVisible': {
      outline: `3px solid ${theme.vars!.palette.primary.main}`,
      outlineOffset: 2,
    },
    // --- Selected ring (2px outline using box-shadow, doesn't affect layout) ---
    ...(selected && {
      boxShadow: `0 0 0 2px ${theme.vars!.palette.text.primary}`,
    }),
    // --- Disabled: muted + no pointer (ButtonBase also sets aria-disabled) ---
    '&.Mui-disabled': {
      opacity: 0.48,
      cursor: 'default',
      pointerEvents: 'none',
    },
  });
