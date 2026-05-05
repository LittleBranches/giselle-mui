import type { GridProps } from '@mui/material/Grid';
import type { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
// In MUI v7, `@mui/material/Grid` exports Grid v2 (Grid v1 was removed).
// The `size={}` prop is the correct v2 API — this import is intentional.
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

/** Controls the visual order and flow direction of the two columns. */
export type ShowcaseRowOrientation = 'row' | 'row-reverse' | 'column' | 'column-reverse';

/** Optional text block rendered in the left/top column. */
export type TwoColumnShowcaseRowText = {
  /** Short uppercase label rendered above the heading. */
  overline?: string;
  /** Main heading text. */
  heading?: string;
  /** Supporting description paragraph. */
  description?: string;
};

export type TwoColumnShowcaseRowProps = Omit<
  GridProps,
  'direction' | 'container' | 'columnSpacing' | 'rowSpacing' | 'sx' | 'children'
> & {
  /**
   * Optional text block rendered in the first column.
   * When omitted the layout is single-column (controls only).
   */
  text?: TwoColumnShowcaseRowText;
  /**
   * Content rendered in the controls column.
   * Accepts any `ReactNode` — form controls, cards, previews, etc.
   */
  controls: React.ReactNode;
  /**
   * Controls the visual order and flow direction of the two columns.
   * - `'row'`            → text left,    controls right  (default)
   * - `'row-reverse'`    → controls left, text right
   * - `'column'`         → text top,     controls bottom
   * - `'column-reverse'` → controls top, text bottom
   *
   * At `xs` the orientation is always `'column'` regardless of this value.
   *
   * @default 'row'
   */
  orientation?: ShowcaseRowOrientation;
  /**
   * `alignItems` applied to the controls `Stack`.
   *
   * @default 'flex-start'
   */
  controlsAlign?: StackProps['alignItems'];
  /** `sx` applied to the text column `Stack`. */
  textSx?: SxProps<Theme>;
  /** `sx` applied to the controls column `Stack`. */
  controlsSx?: SxProps<Theme>;
  /** `sx` applied to the root `Grid` container. */
  sx?: SxProps<Theme>;
};

/**
 * `TwoColumnShowcaseRow` lays out a text description alongside an interactive
 * controls area in a responsive two-column grid.
 *
 * ## Layout behaviour
 * - At `md+` the columns sit side by side, each taking half the container width.
 * - At `xs` the layout always stacks vertically regardless of `orientation`.
 * - When `text` is omitted the entire width is given to the `controls` slot.
 *
 * ## Orientation
 * Use `orientation` to swap which column comes first, or to force a stacked
 * layout at all breakpoints:
 *
 * ```tsx
 * // Text left, controls right (default)
 * <TwoColumnShowcaseRow text={{ heading: 'Theme' }} controls={<PresetPicker />} />
 *
 * // Controls only — full width column layout
 * <TwoColumnShowcaseRow controls={<DashboardPreview />} orientation="column" />
 * ```
 */
export function TwoColumnShowcaseRow({
  text,
  controls,
  orientation = 'row',
  controlsAlign = 'flex-start',
  textSx,
  controlsSx,
  sx,
  ...other
}: TwoColumnShowcaseRowProps) {
  const isVertical = orientation === 'column' || orientation === 'column-reverse';

  const itemSize = isVertical ? { xs: 12 } : { xs: 12, md: 6 };

  return (
    <Grid
      container
      columnSpacing={isVertical ? 0 : { xs: 0, md: 6 }}
      rowSpacing={{ xs: 4, md: isVertical ? 4 : 0 }}
      direction={{ xs: 'column', md: orientation }}
      sx={[{}, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {text && (
        <Grid size={itemSize}>
          <Stack
            spacing={2}
            sx={[{ maxWidth: 520 }, ...(Array.isArray(textSx) ? textSx : [textSx])]}
          >
            {text.overline && (
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {text.overline}
              </Typography>
            )}
            {text.heading && <Typography variant="h4">{text.heading}</Typography>}
            {text.description && (
              <Typography variant="body1" color="text.secondary">
                {text.description}
              </Typography>
            )}
          </Stack>
        </Grid>
      )}

      <Grid size={itemSize} sx={{ minWidth: 0 }}>
        <Stack
          spacing={2}
          sx={[
            { alignItems: controlsAlign, width: 1, minWidth: 0 },
            ...(Array.isArray(controlsSx) ? controlsSx : [controlsSx]),
          ]}
        >
          <Box sx={{ width: 1, minWidth: 0 }}>{controls}</Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
