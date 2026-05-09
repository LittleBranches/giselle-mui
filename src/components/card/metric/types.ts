import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export type MetricCardColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export interface MetricCardProps extends PaperProps {
  /** Pre-formatted display value, e.g. `"20+"` or `"<600ms"`. */
  value: string | number;
  /** Primary label rendered below the value. */
  label: string;
  /** Optional second-line detail rendered below the label. */
  sublabel?: string;
  /**
   * Icon slot rendered at the top-right of the card.
   * Accepts any `ReactNode` — the component has no icon-library dependency.
   *
   * @example
   * import { GiselleIcon, MetricCard } from '@alexrebula/giselle-mui';
   * <MetricCard icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />} ... />
   */
  icon?: ReactNode;
  /**
   * Palette color key used for the icon tint.
   * @default 'primary'
   */
  color?: MetricCardColor;
  /**
   * Optional decoration rendered in a zero-interaction layer behind the card content.
   * The decoration positions itself; the card clips it via `overflow: hidden`.
   *
   * @example
   * import { MetricCard, MetricCardDecoration } from '@alexrebula/giselle-mui';
   * <MetricCard decoration={<MetricCardDecoration color="primary" />} ... />
   */
  decoration?: ReactNode;
}

export interface MetricCardDecorationProps extends BoxProps {
  /**
   * Palette color used for the gradient fill.
   * @default 'primary'
   */
  color?: MetricCardColor;
}
