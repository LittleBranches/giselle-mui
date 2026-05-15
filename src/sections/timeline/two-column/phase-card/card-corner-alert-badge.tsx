import type { CardCornerAlertBadgeProps } from './types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../../icons/giselle/giselle-icon';
import { tooltipAlertListSx, cornerBadgeCircleSx, cornerAlertTooltipSx } from './phase-card.styles';
import {
  CORNER_ALERT_BADGE_SIZE,
  CORNER_ALERT_ICON_SIZE,
  CORNER_ALERT_LIST_ICON_SIZE,
} from './phase-card.const';
import { resolveCornerBadgeAlign } from './utils';

/**
 * Floating corner badge that groups all warning/error alerts behind a single icon.
 *
 * Positioned on the outer wrapper (outside the Paper) so it is never clipped by
 * `overflow: hidden` on the card. On hover, a Tooltip lists every active alert.
 *
 * In controlled (popover) mode — when `onClick` is provided — the badge renders
 * as an interactive button that opens `PhaseWarningPopover`. In read-only mode it
 * renders only a Tooltip.
 */
export function CardCornerAlertBadge({
  alerts,
  columnSide = 'right',
  onClick,
  innerRef,
}: CardCornerAlertBadgeProps) {
  if (alerts.length === 0) return null;

  const hasError = alerts.some((a) => a.severity === 'error');
  const { left, right, transform, tooltipPlacement } = resolveCornerBadgeAlign(columnSide);

  const tooltipContent = (
    <Box sx={tooltipAlertListSx}>
      {alerts.map((a, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <GiselleIcon
            icon="solar:danger-triangle-bold"
            width={CORNER_ALERT_LIST_ICON_SIZE}
            aria-hidden
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.55, fontSize: '0.8rem', fontWeight: 500 }}
          >
            {a.message}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const badgeCircle = (
    <Box
      ref={innerRef}
      role={onClick ? 'button' : undefined}
      aria-label={`${alerts.length} issue${alerts.length === 1 ? '' : 's'}`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      sx={cornerBadgeCircleSx({
        positionOverride: left === undefined ? { right } : { left },
        transform,
        hasError,
        hasClickHandler: !!onClick,
        badgeSize: CORNER_ALERT_BADGE_SIZE,
      })}
    >
      <GiselleIcon icon="solar:danger-triangle-bold" width={CORNER_ALERT_ICON_SIZE} aria-hidden />
    </Box>
  );

  if (onClick) return badgeCircle;

  return (
    <Tooltip
      title={tooltipContent}
      placement={tooltipPlacement}
      arrow
      slotProps={{ tooltip: { sx: cornerAlertTooltipSx } }}
    >
      {badgeCircle}
    </Tooltip>
  );
}
