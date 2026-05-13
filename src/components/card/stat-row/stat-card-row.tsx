// In MUI v7, `@mui/material/Grid` exports Grid v2 (Grid v1 was removed).
// The `size={}` prop is the correct v2 API — this import is intentional.
import Grid from '@mui/material/Grid';

import { GiselleIcon } from '../../icon/giselle';
import { StatCard } from '../stat/stat-card';
import type { StatCardRowProps } from './types';

// Re-export so consumers can do `import { StatCardRowProps } from './stat-card-row'`.
export type { StatCardRowProps } from './types';

// ----------------------------------------------------------------------

/**
 * `StatCardRow` — responsive grid of `StatCard` tiles.
 *
 * Accepts a `StatCardItem[]` and maps each entry to a `StatCard`, laid out in a
 * responsive grid row: full-width on xs, two columns on sm, four columns on md+.
 *
 * The `renderChart` prop is intentionally optional so the component stays in the
 * **main bundle** without pulling in ApexCharts. Pass a factory function when you
 * want sparklines — wire `ReactApexChart` inside the factory, imported from the
 * `/charts` subpath.
 *
 * @example
 * ```tsx
 * // Minimal — no sparklines
 * <StatCardRow items={stats} />
 *
 * // With sparklines (consuming app imports from /charts subpath)
 * <StatCardRow
 *   items={stats}
 *   renderChart={(item) =>
 *     item.sparkline ? (
 *       <ReactApexChart
 *         type="line"
 *         series={[{ data: item.sparkline }]}
 *         options={{ ...STAT_CARD_SPARKLINE_OPTIONS, colors: [theme.palette[item.color].dark] }}
 *         width={84}
 *         height={56}
 *       />
 *     ) : null
 *   }
 * />
 * ```
 *
 * **Quality status (13 May 2026):** DoD — in progress
 */
export function StatCardRow({ items, renderChart, sx, ...other }: StatCardRowProps) {
  return (
    <Grid container spacing={3} sx={[{}, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {items.map((item) => (
        <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label={item.label}
            value={item.value}
            trend={item.trend}
            trendLabel={item.trendLabel}
            color={item.color}
            icon={<GiselleIcon icon={item.iconId} width={28} />}
            chart={renderChart?.(item)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
