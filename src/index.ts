/**
 * @alexrebula/giselle-mui — public API
 */

export { createIconRegistrar } from './utils/create-icon-registrar';
export type { GiselleIconData, GiselleIconMap } from './utils/create-icon-registrar';

export { channelAlpha, hexToChannel, pxToRem, remToPx } from './utils/theme-utils';
export { isDeepEqual } from './utils/is-deep-equal';
export { getCookieValue, setCookieValue } from './utils/cookie';
export type { SetCookieOptions } from './utils/cookie';
export { useLocalStorage } from './utils/use-local-storage';
export type { UseLocalStorageReturn } from './utils/use-local-storage';

export {
  giselleTheme,
  giselleThemeOptions,
  GISELLE_PRIMARY_MAIN,
  GISELLE_PRIMARY_DARK_MAIN,
  GISELLE_SECONDARY_MAIN,
} from './utils/theme-preset';

export { GiselleThemeProvider } from './theming/theme-provider/giselle';
export type { GiselleThemeProviderProps } from './theming/theme-provider/giselle';

export {
  GiselleSettingsProvider,
  GiselleThemeAndSettingsProvider,
  useGiselleSettings,
} from './theming/settings-provider';
export type {
  BaseSettingsState,
  GiselleSettingsContextValue,
  GiselleSettingsProviderProps,
  GiselleThemeAndSettingsProviderProps,
  StorageAdapter,
} from './theming/settings-provider';

export { GiselleIcon } from './icons/giselle';
export type { GiselleIconProps } from './icons/giselle';

export { Accordion } from './accordion';
export type { AccordionProps } from './accordion';
export { ACCORDION_DONE_MIN_TOUCH_TARGET } from './accordion';

export { ToggleIconButton } from './inputs/toggle-icon-button';
export type { ToggleIconButtonProps } from './inputs/toggle-icon-button';
export { TOGGLE_ICON_SIZE, TOGGLE_MIN_TOUCH_TARGET } from './inputs/toggle-icon-button';
// @deprecated — CheckIconButton was renamed to ToggleIconButton in 0.1.x.
// These aliases re-export the replacement constants so existing consumers don't break.
// Remove in the next minor version.
/** @deprecated Use {@link TOGGLE_ICON_SIZE} instead. */
export { TOGGLE_ICON_SIZE as ACCORDION_CHECK_ICON_SIZE } from './inputs/toggle-icon-button';
/** @deprecated Use {@link TOGGLE_MIN_TOUCH_TARGET} instead. */
export { TOGGLE_MIN_TOUCH_TARGET as ACCORDION_ICON_BUTTON_MIN_SIZE } from './inputs/toggle-icon-button';

export { MetricCard, MetricCardDecoration } from './cards/metric';
export type { MetricCardProps, MetricCardDecorationProps, MetricCardColor } from './cards/metric';

export { SelectableCard } from './cards/selectable';
export type { SelectableCardProps } from './cards/selectable';

export { QuoteCard } from './cards/quote';
export type { QuoteCardProps } from './cards/quote';

export { StatCard, STAT_CARD_SPARKLINE_OPTIONS } from './cards/stat';
export type { StatCardProps, StatCardColor, StatCardItem } from './cards/stat';

export { StatCardRow } from './cards/stat-row';
export type { StatCardRowProps } from './cards/stat-row';

export {
  MilestoneBadge,
  PhaseCard,
  TimelineDot,
  TimelineTwoColumn,
} from './sections/timeline/two-column';
export type {
  MilestoneBadgeProps,
  PhaseCardProps,
  TaskDetails,
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
} from './sections/timeline/two-column';

export {
  TimelineCompact,
  TaskDetailsRenderer,
  resolveCompactColor,
} from './sections/timeline/compact';
export type { TimelineCompactProps } from './sections/timeline/compact';
export { TaskList } from './sections/timeline/task-list';
export type { TaskListProps } from './sections/timeline/task-list';
export {
  COMPACT_PHASE_DOT_SIZE,
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_PHASE_ICON_SIZE,
  COMPACT_MIN_PHASE_DOT_SIZE,
  COMPACT_MIN_MILESTONE_DOT_SIZE,
} from './sections/timeline/compact';

export { useNestedChecklist } from './utils/use-nested-checklist';
export type { NestedChecklistState } from './utils/use-nested-checklist';

export { IconActionBar, DEFAULT_ICON_ACTIONS } from './icons/action-bar';
export type { IconActionBarProps, IconActionItem } from './icons/action-bar';

export { TwoColumnShowcaseRow } from './layout/showcase-row';
export type {
  TwoColumnShowcaseRowProps,
  TwoColumnShowcaseRowText,
  ShowcaseRowOrientation,
} from './layout/showcase-row';

export { SectionTitle, SectionCaption } from './layout/section-title';
export type { SectionTitleProps } from './layout/section-title';

export { FloatingSubNav } from './navigation/floating-sub-nav';
export type { FloatingSubNavProps, FloatingSubNavItem } from './navigation/floating-sub-nav';

export { SectionContainer } from './layout/section-container';
export type { SectionContainerProps } from './layout/section-container';

export { HeroSection } from './sections/hero/section';
export type { HeroColorKey, HeroSectionProps, HeroSlotProps } from './sections/hero/section';

export { resolveMaturityColor, resolveMaturityLabel } from './utils/maturity-utils';
export { assignMilestoneSidesByDone } from './utils/timeline-utils';

// --- Phase I: Main bundle additions ---
export { AnimatedGradientText } from './text/animated-gradient';
export type { AnimatedGradientTextProps, PaletteColorKey } from './text/animated-gradient';

export { TechIconStrip } from './icons/tech-strip';
export type { TechIconStripProps, TechIconItem } from './icons/tech-strip';
