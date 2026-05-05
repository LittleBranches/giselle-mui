import type { ReactNode } from 'react';
import type { CardProps } from '@mui/material/Card';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type StatCardColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

/**
 * Data-layer representation of a single `StatCard` entry.
 *
 * Use this type in data factory files instead of defining a local equivalent.
 * The view layer maps `iconId` to `<GiselleIcon icon={iconId} />` — no `ReactNode`
 * is stored in the data layer.
 *
 * ```ts
 * const stats: StatCardItem[] = [
 *   { label: 'Components', value: '10 of ~20', color: 'primary', iconId: 'solar:widget-bold-duotone', sparkline: [3,4,5,6,7,8,9,10] },
 * ];
 * ```
 */
export interface StatCardItem {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  color: StatCardColor;
  /** Iconify icon ID — rendered as `<GiselleIcon icon={iconId} />` in the view layer. */
  iconId: string;
  sparkline?: number[];
}

export interface StatCardProps extends Omit<CardProps, 'title' | 'color'> {
  /** Card label, e.g. `"Weekly sales"`. */
  label: string;
  /** Pre-formatted display value, e.g. `"714k"` or `"551"`. */
  value: string | number;
  /**
   * Trend percentage. Positive = upward trend (green arrow), negative = downward (red arrow).
   *
   * @example 2.6 → `+2.6%`
   */
  trend?: number;
  /** Supplementary label next to the trend, e.g. `"last week"`. */
  trendLabel?: string;
  /**
   * Icon slot — accepts any `ReactNode`. No icon-library dependency inside this component.
   *
   * ```tsx
   * icon={<GiselleIcon icon="solar:widget-bold-duotone" width={28} />}
   * ```
   */
  icon?: ReactNode;
  /**
   * Palette key controlling background tint, trend colour, and sparkline colour.
   * @default 'primary'
   */
  color?: StatCardColor;
  /**
   * Chart slot — accepts any `ReactNode`. Renders bottom-right inside the card.
   *
   * No chart-library dependency inside this component. Pass a pre-configured
   * chart element from the consumer. Use `STAT_CARD_SPARKLINE_OPTIONS` from
   * `stat-card.styles.ts` as the base options for the canonical 84×56 slot.
   *
   * ```tsx
   * chart={
   *   <ReactApexChart
   *     type="line"
   *     series={[{ data: sparkline }]}
   *     options={{ ...STAT_CARD_SPARKLINE_OPTIONS, colors: [theme.palette.primary.dark] }}
   *     width={84}
   *     height={56}
   *   />
   * }
   * ```
   */
  chart?: ReactNode;
  /** MUI `sx` override on the root `Card`. */
  sx?: SxProps<Theme>;
}

/** Internal — chart component type loaded dynamically to keep SSR safe. */
export type ApexChartComponent = React.ComponentType<{
  type: string;
  series: object[];
  options: object;
  width: number;
  height: number;
}>;
