/**
 * @littlebranches/giselle-mui — public API
 */

export { createIconRegistrar } from './utils/icon/create-icon-registrar/create-icon-registrar';
export type {
  GiselleIconData,
  GiselleIconMap,
} from './utils/icon/create-icon-registrar/create-icon-registrar';

export {
  channelAlpha,
  hexToChannel,
  pxToRem,
  remToPx,
} from './utils/theme/theme-utils/theme-utils';
export { isDeepEqual } from './utils/is-deep-equal/is-deep-equal';
export { getCookieValue, setCookieValue } from './utils/cookie/cookie';
export type { SetCookieOptions } from './utils/cookie/cookie';
export { useLocalStorage } from './utils/hooks/use-local-storage/use-local-storage';
export type { UseLocalStorageReturn } from './utils/hooks/use-local-storage/use-local-storage';

export {
  giselleTheme,
  giselleThemeOptions,
  GISELLE_PRIMARY_MAIN,
  GISELLE_PRIMARY_DARK_MAIN,
  GISELLE_SECONDARY_MAIN,
} from './utils/theme/preset/theme-preset';

export { GiselleThemeProvider } from './components/theming/theme-provider/giselle';
export type { GiselleThemeProviderProps } from './components/theming/theme-provider/giselle';

export {
  GiselleSettingsProvider,
  GiselleThemeAndSettingsProvider,
  useGiselleSettings,
} from './components/theming/settings-provider';
export type {
  BaseSettingsState,
  GiselleSettingsContextValue,
  GiselleSettingsProviderProps,
  GiselleThemeAndSettingsProviderProps,
  StorageAdapter,
} from './components/theming/settings-provider';

export { GiselleIcon } from './components/material/data-display/icon/giselle';
export type { GiselleIconProps } from './components/material/data-display/icon/giselle';

export { StatusLabel } from './components/material/data-display/status-label';
export type {
  StatusLabelProps,
  StatusLabelStatus,
  StatusColorKey,
} from './components/material/data-display/status-label';

export { Accordion } from './components/material/surfaces/card/accordion';
export type { AccordionProps } from './components/material/surfaces/card/accordion';
export { ACCORDION_DONE_MIN_TOUCH_TARGET } from './components/material/surfaces/card/accordion';

export { ToggleIconButton } from './components/material/input/toggle-icon-button';
export type { ToggleIconButtonProps } from './components/material/input/toggle-icon-button';
export {
  TOGGLE_ICON_SIZE,
  TOGGLE_MIN_TOUCH_TARGET,
} from './components/material/input/toggle-icon-button';
// @deprecated — CheckIconButton was renamed to ToggleIconButton in 0.1.x.
// These aliases re-export the replacement constants so existing consumers don't break.
// Remove in the next minor version.
/** @deprecated Use {@link TOGGLE_ICON_SIZE} instead. */
export { TOGGLE_ICON_SIZE as ACCORDION_CHECK_ICON_SIZE } from './components/material/input/toggle-icon-button';
/** @deprecated Use {@link TOGGLE_MIN_TOUCH_TARGET} instead. */
export { TOGGLE_MIN_TOUCH_TARGET as ACCORDION_ICON_BUTTON_MIN_SIZE } from './components/material/input/toggle-icon-button';

export { MetricCard, MetricCardDecoration } from './components/material/surfaces/card/metric';
export type {
  MetricCardProps,
  MetricCardDecorationProps,
  MetricCardColor,
} from './components/material/surfaces/card/metric';

export { SelectableCard } from './components/material/surfaces/card/selectable';
export type { SelectableCardProps } from './components/material/surfaces/card/selectable';

export { QuoteCard } from './components/material/surfaces/card/quote';
export type { QuoteCardProps } from './components/material/surfaces/card/quote';

export { StatCard, STAT_CARD_SPARKLINE_OPTIONS } from './components/material/surfaces/card/stat';
export type {
  StatCardProps,
  StatCardColor,
  StatCardItem,
} from './components/material/surfaces/card/stat';

export { StatCardRow } from './components/material/surfaces/card/stat-row';
export type { StatCardRowProps } from './components/material/surfaces/card/stat-row';

export { useNestedChecklist } from './utils/hooks/use-nested-checklist/use-nested-checklist';
export type { NestedChecklistState } from './utils/hooks/use-nested-checklist/use-nested-checklist';

export {
  IconActionBar,
  DEFAULT_ICON_ACTIONS,
} from './components/material/data-display/icon/action-bar';
export type {
  IconActionBarProps,
  IconActionItem,
} from './components/material/data-display/icon/action-bar';

export { TwoColumnShowcaseRow } from './components/material/layout/showcase-row';
export type {
  TwoColumnShowcaseRowProps,
  TwoColumnShowcaseRowText,
  ShowcaseRowOrientation,
} from './components/material/layout/showcase-row';

export { SectionTitle, SectionCaption } from './components/material/layout/section-title';
export type { SectionTitleProps } from './components/material/layout/section-title';

export { SectionContainer } from './components/material/layout/section-container';
export type { SectionContainerProps } from './components/material/layout/section-container';

export { HeroSection } from './components/section/hero/section';
export type {
  HeroColorKey,
  HeroSectionProps,
  HeroSlotProps,
} from './components/section/hero/section';

export { resolveMaturityColor, resolveMaturityLabel } from './utils/maturity/maturity-utils';
// --- Phase I: Main bundle additions ---
export { AnimatedGradientText } from './components/material/data-display/animated-gradient';
export type {
  AnimatedGradientTextProps,
  PaletteColorKey,
} from './components/material/data-display/animated-gradient';

export { TechIconStrip } from './components/material/data-display/icon/tech-strip';
export type {
  TechIconStripProps,
  TechIconItem,
} from './components/material/data-display/icon/tech-strip';
