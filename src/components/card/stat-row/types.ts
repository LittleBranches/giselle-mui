import type { ReactNode } from 'react';

import type { GridProps } from '@mui/material/Grid';

import type { StatCardItem } from '../stat/types';

// ----------------------------------------------------------------------

export interface StatCardRowProps extends Omit<GridProps, 'children' | 'container'> {
  /** Items to render as `StatCard` tiles in the responsive grid row. */
  items: StatCardItem[];
  /**
   * Optional factory to render the `chart` slot for each item.
   *
   * Use this to wire sparklines from `@alexrebula/giselle-mui/charts` in the consuming app.
   * When omitted, cards render without a chart — the main bundle stays chart-free.
   *
   * @example
   * ```tsx
   * renderChart={(item) =>
   *   item.sparkline ? (
   *     <ReactApexChart
   *       type="line"
   *       series={[{ data: item.sparkline }]}
   *       options={{ ...STAT_CARD_SPARKLINE_OPTIONS, colors: [theme.palette[item.color].dark] }}
   *       width={84}
   *       height={56}
   *     />
   *   ) : null
   * }
   * ```
   */
  renderChart?: (item: StatCardItem) => ReactNode;
}
