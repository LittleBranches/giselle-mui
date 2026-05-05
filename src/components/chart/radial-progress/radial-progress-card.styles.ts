import type { ApexOptions } from 'apexcharts';
import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Builds ApexCharts radialBar options for `RadialProgressCard`.
 *
 * All theme-dependent values (track colour, label colours) are resolved at
 * call time — call this inside `useMemo` with `[theme, labels, colors, total,
 * totalLabel]` as dependencies.
 *
 * @param theme     MUI v7 theme from `useTheme()`
 * @param labels    Segment labels in the same order as `series`
 * @param colors    Resolved CSS colour strings in the same order as `series`
 * @param total     Aggregate value shown in the chart centre
 * @param totalLabel  Short label shown below `total`
 */
export function buildRadialProgressOptions(
  theme: Theme,
  labels: string[],
  colors: string[],
  total: number,
  totalLabel: string
): ApexOptions {
  const textSecondary = theme.vars?.palette.text.secondary ?? theme.palette.text.secondary;
  const textPrimary = theme.vars?.palette.text.primary ?? theme.palette.text.primary;
  const trackBg = (theme.vars?.palette.grey[200] ?? theme.palette.grey[200]) as string;

  return {
    chart: {
      type: 'radialBar' as const,
      sparkline: { enabled: true },
    },
    colors,
    labels,
    stroke: { lineCap: 'round' as const },
    fill: { type: 'solid' },
    grid: { padding: { top: -20, bottom: -20 } },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 10,
          size: '40%',
        },
        track: {
          margin: 10,
          background: trackBg,
          strokeWidth: '100%',
        },
        dataLabels: {
          total: {
            show: true,
            label: totalLabel,
            color: textSecondary,
            fontSize: '13px',
            fontWeight: 400,
            formatter: () => `${total}`,
          },
          value: {
            offsetY: 2,
            color: textPrimary,
            fontSize: '15px',
            fontWeight: 700,
            formatter: (val: number) => `${Math.round(val)}%`,
          },
          name: {
            offsetY: -10,
            fontSize: '11px',
            color: textSecondary,
          },
        },
      },
    },
  };
}

// ----------------------------------------------------------------------
// Static sx constants

export const chartWrapSx: SxProps<Theme> = {
  mx: 'auto',
  overflow: 'hidden',
};

export const legendRowSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 2,
  mt: 1,
};

export const legendItemSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
};

export const legendValueSx: SxProps<Theme> = {
  color: 'text.secondary',
  ml: 0.5,
};

// ----------------------------------------------------------------------
// Dynamic sx factories

/**
 * Minimum dot size — matches repo minimum readable size rule for status indicators.
 * Regression-tested in `radial-progress-card.styles.test.ts`.
 */
export const LEGEND_DOT_SIZE = 12;

/**
 * Sx for the coloured dot next to each legend label.
 * Applies a solid circle in the segment's resolved palette colour.
 */
export const legendDotSx = (color: string): SxProps<Theme> => ({
  width: LEGEND_DOT_SIZE,
  height: LEGEND_DOT_SIZE,
  borderRadius: '50%',
  bgcolor: color,
  flexShrink: 0,
});
