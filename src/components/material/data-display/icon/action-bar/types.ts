import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { TooltipProps } from '@mui/material/Tooltip';
import type React from 'react';

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
