import type { IconButtonProps } from '@mui/material/IconButton';
import type { IconActionItem, IconActionBarProps } from './types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { GiselleIcon } from '../../icon/giselle';

import { iconActionBarRootSx } from './icon-action-bar.styles';

// Re-exports — keeps `import { IconActionItem, IconActionBarProps } from './icon-action-bar'` working.
export type { IconActionItem, IconActionBarProps } from './types';

// ----------------------------------------------------------------------

/**
 * Default actions rendered when no `actions` prop is supplied.
 *
 * Uses the same Solar icon set as the source reference (invoice toolbar):
 * Edit, View, Print, Send, Share.
 */
export const DEFAULT_ICON_ACTIONS: IconActionItem[] = [
  { tooltip: 'Edit', icon: <GiselleIcon icon="solar:pen-bold" /> },
  { tooltip: 'View', icon: <GiselleIcon icon="solar:eye-bold" /> },
  { tooltip: 'Print', icon: <GiselleIcon icon="solar:printer-minimalistic-bold" /> },
  { tooltip: 'Send', icon: <GiselleIcon icon="mdi:email" /> },
  { tooltip: 'Share', icon: <GiselleIcon icon="solar:share-bold" /> },
];

// ----------------------------------------------------------------------

/**
 * IconActionBar — a horizontal row of icon buttons, each paired with a tooltip.
 *
 * Renders a `Box` containing `Tooltip` + `IconButton` pairs. Each item is
 * fully configurable: icon slot, tooltip label, click handler, link target,
 * disabled state, and tooltip placement.
 *
 * When `actions` is omitted the bar defaults to the standard document toolbar
 * set: **Edit, View, Print, Send, Share**.
 *
 * ```tsx
 * import { GiselleIcon, IconActionBar } from '@alexrebula/giselle-mui';
 *
 * // Minimal — default actions
 * <IconActionBar />
 *
 * // Custom actions
 * <IconActionBar
 *   actions={[
 *     { tooltip: 'Edit', icon: <GiselleIcon icon="solar:pen-bold" />, onClick: handleEdit },
 *     { tooltip: 'Delete', icon: <GiselleIcon icon="solar:trash-bin-trash-bold" />, onClick: handleDelete },
 *   ]}
 * />
 * ```
 */
export function IconActionBar({
  actions = DEFAULT_ICON_ACTIONS,
  sx,
  ...other
}: IconActionBarProps) {
  return (
    <Box sx={[iconActionBarRootSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {actions.map((item, index) => {
        const label = item['aria-label'] ?? item.tooltip;
        const buttonProps: IconButtonProps & { component?: React.ElementType; href?: string } = {
          onClick: item.onClick,
          disabled: item.disabled,
          'aria-label': label,
          ...(item.component !== undefined && { component: item.component }),
          ...(item.href !== undefined && { href: item.href }),
        };

        return (
          <Tooltip
            key={`${item.tooltip}-${index}`}
            title={item.tooltip}
            placement={item.tooltipPlacement ?? 'bottom'}
          >
            {/* span wrapper required by Tooltip when the child may be disabled */}
            <span>
              <IconButton {...buttonProps}>{item.icon}</IconButton>
            </span>
          </Tooltip>
        );
      })}
    </Box>
  );
}
