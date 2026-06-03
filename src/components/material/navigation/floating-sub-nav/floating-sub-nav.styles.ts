import type { SxProps, Theme } from '@mui/material/styles';

import { channelAlpha } from '../../../../utils/theme/theme-utils/theme-utils';
import { SUB_NAV_BUTTON_SIZE } from './floating-sub-nav.const';

// Typed channel accessor helpers for palette entries not typed as Record<string, string>
const grey500Ch = (theme: Theme): string =>
  (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']!;
const blackCh = (theme: Theme): string =>
  (theme.vars!.palette.common as unknown as Record<string, string>)['blackChannel']!;

// ----------------------------------------------------------------------

/** Pill container — border, shadow, background. Shared by both variants. */
export const pillSx: SxProps<Theme> = (theme) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  p: 0.5,
  borderRadius: 2,
  bgcolor: 'background.paper',
  border: `1px solid ${channelAlpha(grey500Ch(theme), 0.14)}`,
  boxShadow: [
    `0 2px 8px 0 ${channelAlpha(grey500Ch(theme), 0.1)}`,
    `0 8px 32px -4px ${channelAlpha(grey500Ch(theme), 0.18)}`,
  ].join(', '),
  ...theme.applyStyles('dark', {
    border: `1px solid ${channelAlpha(grey500Ch(theme), 0.08)}`,
    boxShadow: `0 1px 4px 0 ${channelAlpha(blackCh(theme), 0.12)}`,
  }),
});

/** Sticky outer wrapper — zero-height overflow-visible anchor. */
export const stickyWrapperSx: SxProps<Theme> = (theme) => ({
  position: 'sticky',
  bottom: { xs: 32, sm: 32, md: 40 },
  height: 0,
  overflow: 'visible',
  display: 'flex',
  justifyContent: 'center',
  zIndex: theme.zIndex.speedDial,
  pointerEvents: 'none',
});

/**
 * Inner box for the sticky variant — floats the pill above the zero-height anchor
 * via `translateY(-100%)` while restoring pointer events on this element only.
 */
export const stickyInnerSx: SxProps<Theme> = {
  transform: 'translateY(-100%)',
  pointerEvents: 'auto',
  pb: { xs: '23px', md: '31px' },
};

/** Fixed outer wrapper — viewport-anchored, centred. */
export const fixedWrapperSx: SxProps<Theme> = (theme) => ({
  position: 'fixed',
  bottom: { xs: 16, md: 24 },
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: theme.zIndex.speedDial,
});

/**
 * Button sx factory — encodes the active/idle/hover/active states.
 * Returns a new object per call; wrap in `useMemo` at the call site if needed.
 */
export const subNavButtonSx =
  (isActive: boolean): SxProps<Theme> =>
  (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: SUB_NAV_BUTTON_SIZE,
    height: SUB_NAV_BUTTON_SIZE,
    p: 0,
    borderRadius: 1.5,
    border: `solid 1px transparent`,
    color: 'text.disabled',
    outline: 'none',
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border-color', 'color', 'opacity'],
      { duration: theme.transitions.duration.shorter }
    ),
    '&:focus-visible': {
      outline: `2px dashed ${theme.vars!.palette.primary.main}`,
      outlineOffset: 2,
    },
    '&:hover': {
      opacity: 0.72,
      color: 'text.primary',
      bgcolor: channelAlpha(grey500Ch(theme), 0.08),
    },
    '&:active': {
      opacity: 0.56,
      bgcolor: channelAlpha(grey500Ch(theme), 0.12),
    },
    ...(isActive && {
      color: 'primary.main',
      bgcolor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.08),
      borderColor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.24),
      '&:hover': {
        opacity: 1,
        bgcolor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.12),
      },
      '&:active': {
        opacity: 1,
        bgcolor: channelAlpha(theme.vars!.palette.primary.mainChannel, 0.16),
      },
    }),
  });
