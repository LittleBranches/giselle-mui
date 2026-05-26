import type { GridProps } from '@mui/material/Grid';
import type { Theme, SxProps } from '@mui/material/styles';
import type React from 'react';

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
  controlsAlign?: React.CSSProperties['alignItems'];
  /** `sx` applied to the text column `Stack`. */
  textSx?: SxProps<Theme>;
  /** `sx` applied to the controls column `Stack`. */
  controlsSx?: SxProps<Theme>;
  /** `sx` applied to the root `Grid` container. */
  sx?: SxProps<Theme>;
};
