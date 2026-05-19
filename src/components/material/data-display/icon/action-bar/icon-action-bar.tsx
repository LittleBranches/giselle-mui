import type { IconButtonProps } from '@mui/material/IconButton';
import type { IconActionBarProps } from './types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { iconActionBarRootSx } from './icon-action-bar.styles';
import { DEFAULT_ICON_ACTIONS } from './icon-action-bar.defaults';

// Re-exports — keeps `import { IconActionItem, IconActionBarProps } from './icon-action-bar'` working.
export type { IconActionItem, IconActionBarProps } from './types';
// Re-export constant — keeps `import { DEFAULT_ICON_ACTIONS } from './icon-action-bar'` working.
export { DEFAULT_ICON_ACTIONS } from './icon-action-bar.defaults';

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
 *
 * **Quality status (8 May 2026):** DoD 20/20 · Best practices 13/13
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
