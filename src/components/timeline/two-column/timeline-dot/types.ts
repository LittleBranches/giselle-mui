import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';
import type { HighlightedPaletteKey } from '../types';

// ----------------------------------------------------------------------

export type TimelineDotComponentProps = Omit<BoxProps, 'color' | 'onClick'> & {
  /** Icon to render inside the dot. Accepts a `width` prop for sizing. */
  icon?: ReactNode;
  /** MUI palette key — controls background colour and shadow tint. @default 'primary' */
  color?: HighlightedPaletteKey;
  /**
   * Size variant.
   * - `'phase'`: 42px (all states). Active state adds a pulsing ring halo — no size change.
   * - `'milestone'`: 34px fixed.
   * @default 'phase'
   */
  size?: 'phase' | 'milestone';
  /** Shows pulsing ring halo around the dot (phase size only). Does not change dot size. */
  active?: boolean;
  /**
   * Done state — replaces icon with animated checkmark and dims milestone badges.
   * In checklist mode this is driven by the toggle state; in read-only mode it
   * reflects `phase.milestones[].done` from the data model.
   */
  done?: boolean;
  /**
   * Increment on each done/undone toggle to remount the icon wrapper
   * and restart the spring-pop animation cleanly.
   */
  animationKey?: number;
  /**
   * Overrides the dot circle background colour. Accepts any CSS colour string (e.g. `'#111'`).
   * Useful when a brand icon has a specific colour that clashes with the palette-derived background.
   * Ignored when `done=true` — done dots always render success-green.
   */
  dotBg?: string;
  /** Makes the dot clickable. Omit for decorative (read-only) dots. */
  onClick?: () => void;
};

export type DotInnerProps = {
  done: boolean;
  icon: ReactNode;
  animationKey: number;
  iconSize: number;
};

// Internal utility type — for normaliseSx usage inside the component.
export type NormalisedSx = SxProps<Theme>[];
