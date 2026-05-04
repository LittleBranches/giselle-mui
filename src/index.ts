/**
 * @alexrebula/giselle-mui — public API
 */

export { createIconRegistrar } from './utils/create-icon-registrar';
export type { GiselleIconData, GiselleIconMap } from './utils/create-icon-registrar';

export { channelAlpha, hexToChannel, pxToRem, remToPx } from './utils/theme-utils';

export { GiselleIcon } from './components/giselle-icon';
export type { GiselleIconProps } from './components/giselle-icon';

export { MetricCard, MetricCardDecoration } from './components/card/metric';
export type {
  MetricCardProps,
  MetricCardDecorationProps,
  MetricCardColor,
} from './components/card/metric';

export { SelectableCard } from './components/selectable-card';
export type { SelectableCardProps } from './components/selectable-card';

export { QuoteCard } from './components/card/quote';
export type { QuoteCardProps } from './components/card/quote';

export { PhaseCard, TimelineDot, TimelineTwoColumn } from './components/timeline/two-column';
export type {
  PhaseCardProps,
  TimelineDotComponentProps,
  TimelineTwoColumnProps,
  TimelinePhase,
  TimelinePlatformItem,
  HighlightedPaletteKey,
} from './components/timeline/two-column';

export { IconActionBar, DEFAULT_ICON_ACTIONS } from './components/icon-action-bar';
export type { IconActionBarProps, IconActionItem } from './components/icon-action-bar';
