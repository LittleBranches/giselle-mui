/**
 * @alexrebula/giselle-mui — public API
 */

export { createIconRegistrar } from './utils/create-icon-registrar';
export type { GiselleIconData, GiselleIconMap } from './utils/create-icon-registrar';

export { channelAlpha, hexToChannel, pxToRem, remToPx } from './utils/theme-utils';

export {
  giselleTheme,
  GISELLE_PRIMARY_MAIN,
  GISELLE_PRIMARY_DARK_MAIN,
  GISELLE_SECONDARY_MAIN,
} from './utils/theme-preset';

export { GiselleIcon } from './components/icon/giselle';
export type { GiselleIconProps } from './components/icon/giselle';

export { MetricCard, MetricCardDecoration } from './components/card/metric';
export type {
  MetricCardProps,
  MetricCardDecorationProps,
  MetricCardColor,
} from './components/card/metric';

export { SelectableCard } from './components/card/selectable';
export type { SelectableCardProps } from './components/card/selectable';

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

export { IconActionBar, DEFAULT_ICON_ACTIONS } from './components/action-bar/icon';
export type { IconActionBarProps, IconActionItem } from './components/action-bar/icon';

export { TwoColumnShowcaseRow } from './components/layout/two-column-showcase-row';
export type {
  TwoColumnShowcaseRowProps,
  TwoColumnShowcaseRowText,
  ShowcaseRowOrientation,
} from './components/layout/two-column-showcase-row';

export { SectionTitle, SectionCaption } from './components/layout/section-title';
export type { SectionTitleProps } from './components/layout/section-title';
