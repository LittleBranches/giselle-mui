import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { TooltipProps } from '@mui/material/Tooltip';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { GiselleIcon } from '../../icon/giselle';

import { iconActionBarRootSx } from './styles';

// ----------------------------------------------------------------------

/**
 * A single action item rendered as a `Tooltip` + `IconButton`.
 *
 * The `icon` slot accepts any `ReactNode` — use `<GiselleIcon ... />` to fill it.
 */
export interface IconActionItem {
  /**
   * Tooltip label shown on hover.
   */
  tooltip: string;
  /**
   * Icon rendered inside the button.
   *
   * @example
   * import { GiselleIcon } from '@alexrebula/giselle-mui';
   * { tooltip: 'Edit', icon: <GiselleIcon icon="solar:pen-bold" /> }
   */
  icon: ReactNode;
  /**
   * Click handler for the button.
   */
  onClick?: IconButtonProps['onClick'];
  /**
   * `href` for link behaviour. Requires `component` to be set to a link element
   * (e.g. `RouterLink`) that handles the `href` prop.
   */
  href?: string;
  /**
   * Overrides the root element of `IconButton` — e.g. pass `RouterLink` together
   * with `href` to make the button navigate.
   */
  component?: React.ElementType;
  /**
   * Disables the button and prevents interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * `aria-label` for the button. Defaults to the `tooltip` value.
   */
  'aria-label'?: string;
  /**
   * Extra placement for the Tooltip.
   * @default 'bottom'
   */
  tooltipPlacement?: TooltipProps['placement'];
}

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

export interface IconActionBarProps extends BoxProps {
  /**
   * Array of action items rendered as `Tooltip` + `IconButton` pairs.
   *
   * Each item configures the tooltip label, icon, click behaviour, and optional
   * link target (`href` + `component`).
   *
   * When omitted the bar renders the default Edit / View / Print / Send / Share set.
   *
   * @example
   * ```tsx
   * import { GiselleIcon, IconActionBar } from '@alexrebula/giselle-mui';
   *
   * <IconActionBar
   *   actions={[
   *     { tooltip: 'Edit', icon: <GiselleIcon icon="solar:pen-bold" />, onClick: onEdit },
   *     { tooltip: 'Delete', icon: <GiselleIcon icon="solar:trash-bin-trash-bold" />, onClick: onDelete },
   *   ]}
   * />
   * ```
   *
   * @example
   * ```tsx
   * // Link action using a router component
   * import { GiselleIcon, IconActionBar } from '@alexrebula/giselle-mui';
   *
   * <IconActionBar
   *   actions={[
   *     {
   *       tooltip: 'Edit',
   *       icon: <GiselleIcon icon="solar:pen-bold" />,
   *       component: RouterLink,
   *       href: `/invoices/${id}/edit`,
   *     },
   *   ]}
   * />
   * ```
   */
  actions?: IconActionItem[];
}

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
