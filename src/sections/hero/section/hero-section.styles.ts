import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../utils/theme-utils';
import type { HeroColorKey } from './types';

// ----------------------------------------------------------------------

/**
 * Root Box — full-width, background tinted with the palette colour at 8% alpha.
 * Works in light and dark mode because `mainChannel` is a CSS-variable channel string.
 */
export const heroRootSx =
  (color: HeroColorKey): SxProps<Theme> =>
  (theme) => ({
    width: '100%',
    backgroundColor: channelAlpha(theme.vars!.palette[color].mainChannel, 0.08),
  });

/**
 * Inner Container — centred flex column with consistent section padding.
 * Mirrors the SectionContainer default spacing so a hero feels at home on any page.
 */
export const heroInnerSx: SxProps<Theme> = {
  py: { xs: 10, md: 14 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 3,
};

/**
 * Actions row — wrapping centred flex row for CTA buttons.
 */
export const heroActionsRowSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 2,
  mt: 1,
};

/**
 * Icons slot wrapper — full-width container for the `icons` slot (e.g. `TechIconStrip`).
 * Width 100% lets centred-wrap strips span the full container.
 */
export const heroIconsSlotSx: SxProps<Theme> = {
  width: '100%',
};
