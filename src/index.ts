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

export { Accordion } from './components/accordion';
export type { AccordionProps } from './components/accordion';
export { ACCORDION_DONE_MIN_TOUCH_TARGET } from './components/accordion';

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

export { StatCard, STAT_CARD_SPARKLINE_OPTIONS } from './components/card/stat';
export type { StatCardProps, StatCardColor, StatCardItem } from './components/card/stat';

export { PhaseCard, TimelineDot, TimelineTwoColumn } from './components/timeline/two-column';
export type {
  PhaseCardProps,
  TimelineDotComponentProps,
  TimelineTwoColumnProps,
  Task,
  TimelinePhase,
  TimelineMilestone,
  TimelinePlatformItem,
  HighlightedPaletteKey,
  TimelineSidebar,
  TimelineColumnLabels,
  TimelineSectionData,
} from './components/timeline/two-column';

export { TimelineCompact, resolveCompactColor } from './components/timeline/compact';
export type { TimelineCompactProps } from './components/timeline/compact';
export { TaskList } from './components/timeline/task-list';
export type { TaskListProps } from './components/timeline/task-list';
export {
  COMPACT_PHASE_DOT_SIZE,
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_PHASE_ICON_SIZE,
  COMPACT_MIN_PHASE_DOT_SIZE,
  COMPACT_MIN_MILESTONE_DOT_SIZE,
} from './components/timeline/compact';

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

export { FloatingSubNav } from './components/nav/floating-sub-nav';
export type { FloatingSubNavProps, FloatingSubNavItem } from './components/nav/floating-sub-nav';

export { SectionContainer } from './components/layout/section-container';
export type { SectionContainerProps } from './components/layout/section-container';

export { resolveMaturityColor, resolveMaturityLabel } from './utils/maturity-utils';
export { assignMilestoneSidesByDone } from './utils/timeline-utils';

export { RadialProgressCard } from './components/chart/radial-progress';
export type {
  RadialProgressCardProps,
  RadialProgressItem,
} from './components/chart/radial-progress';

// ─── Parents Across Borders — data model types ────────────────────────────────
export type {
  PersonProfile,
  PersonRole,
  BehavioralPattern,
  LegalRecord,
  CommunicationNote,
} from './types/person-profile';
