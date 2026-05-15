import type { IconProps } from '@iconify/react';
import type { Theme, SxProps } from '@mui/material/styles';
import type React from 'react';

// ----------------------------------------------------------------------

/**
 * Props for {@link GiselleIcon}.
 *
 * Extends `Omit<React.HTMLAttributes<HTMLSpanElement>, 'style' | 'className' | 'children'>`
 * to support `id`, `aria-*`, `data-*`, and other standard HTML attributes forwarded
 * to the outer `Box component="span"` wrapper.
 *
 * Not extending `BoxProps` or `IconProps` directly — `@iconify/react` types `display` as
 * `string | number`, which conflicts with MUI Box's `ResponsiveStyleValue<Display>`.
 * `className` and `style` are intentionally kept as explicit props because they are
 * forwarded to the inner `Icon` SVG element, not the outer wrapper.
 */
export interface GiselleIconProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'style' | 'className' | 'children'
> {
  /**
   * Iconify icon identifier in the format `"prefix:name"`,
   * e.g. `"solar:rocket-bold-duotone"` or `"logos:react"`.
   */
  icon: string;
  /**
   * MUI `sx` prop for theming, spacing, color, and responsive styles.
   * Applied to the outer `Box component="span"` wrapper.
   */
  sx?: SxProps<Theme>;
  /**
   * Icon width in pixels (or any valid CSS length string).
   * @default 20
   */
  width?: number | string;
  /**
   * Icon height in pixels (or any valid CSS length string).
   * Defaults to `width` when omitted, keeping icons square by default.
   */
  height?: number | string;
  /** HTML `class` attribute forwarded to the inner `Icon` SVG element. */
  className?: string;
  /** Inline style forwarded to the inner `Icon` SVG element. */
  style?: React.CSSProperties;
  /**
   * Flip the icon horizontally, vertically, or both.
   * @example `"horizontal"` | `"vertical"` | `"horizontal,vertical"`
   */
  flip?: IconProps['flip'];
  /**
   * Rotate the icon.
   * Accepts 0–3 (quarter-turn increments) or a CSS angle string like `"90deg"`.
   */
  rotate?: IconProps['rotate'];
}
