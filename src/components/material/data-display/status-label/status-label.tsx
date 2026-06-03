import React from 'react';

import Chip from '@mui/material/Chip';

import { STATUS_CONFIG } from './status-label.const';
import { statusChipSx } from './status-label.styles';
import type { StatusLabelProps } from './types';

// ----------------------------------------------------------------------

/**
 * StatusLabel — soft-variant chip that maps a workflow status to an MUI
 * palette key and renders the canonical label for that status.
 *
 * The chip background is a 16% tint of the palette colour's main channel,
 * matching the soft variant pattern used across the design system.
 *
 * @example
 * ```tsx
 * <StatusLabel status="active" />
 * <StatusLabel status="pending" label="Awaiting approval" />
 * ```
 *
 * **Quality status (23 May 2026):** DoD 20/20 · Best practices 13/13
 */
export const StatusLabel = React.forwardRef<HTMLDivElement, StatusLabelProps>(function StatusLabel(
  { status, label, size = 'small', sx, ...other },
  ref
) {
  const { color, label: defaultLabel } = STATUS_CONFIG[status];

  return (
    <Chip
      ref={ref}
      size={size}
      label={label ?? defaultLabel}
      sx={[statusChipSx(color), ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    />
  );
});

StatusLabel.displayName = 'StatusLabel';
