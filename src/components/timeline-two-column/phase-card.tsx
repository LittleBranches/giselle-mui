import type { Theme } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import type { TimelinePhase, HighlightedPaletteKey, TimelinePlatformItem } from './types';

import {
  useState,
  type ReactNode,
  type KeyboardEventHandler,
  type Dispatch,
  type SetStateAction,
} from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { pulseDot } from './animations';
import { GiselleIcon } from '../giselle-icon/giselle-icon';
import { DEFAULT_EXPANDABLE_ICON } from './icons';

// ----------------------------------------------------------------------

/** Font size for all status badge labels (Overdue, Now, Date overlap, Scenario). */
export const STATUS_BADGE_FONT_SIZE = '0.75rem';

/** Size (px) of the corner alert badge circle. */
export const CORNER_ALERT_BADGE_SIZE = 26;

/** Icon size (px) inside the corner alert badge circle. */
export const CORNER_ALERT_ICON_SIZE = 16;

/** Icon size (px) inside the corner alert Tooltip list. */
export const CORNER_ALERT_LIST_ICON_SIZE = 16;

/** Icon size (px) for the viewed eye button. */
export const PHASE_EYE_ICON_SIZE = 20;

/**
 * Minimum touch-target size (px) for the eye viewed button.
 * Meets WCAG 2.2 AA 2.5.8 — minimum 24 × 24 CSS pixels for pointer targets.
 */
export const EYE_BUTTON_MIN_SIZE = 28;

/** Width and height (px) of the "Now" active pulsing dot. */
export const ACTIVE_DOT_SIZE = 12;

/** Width (px) of the subtask icon in the phase card's expandable details pill. */
export const PHASE_PILL_ICON_SIZE = 16;

/** Font size for the count label in the phase card's expandable details pill. */
export const PHASE_PILL_TEXT_FONT_SIZE = '0.75rem';

// ----------------------------------------------------------------------

/**
 * Resolves the horizontal position of the corner alert badge depending on which
 * column the card sits in.
 *
 * - Right column (default): badge floats on the **right** top corner so it sits
 *   between the card and the centre spine.
 * - Left column: badge floats on the **left** top corner so it sits between the
 *   card and the centre spine (mirrored).
 *
 * Exported so tests can assert the positioning rule independently.
 */
export function resolveCornerBadgeAlign(columnSide: 'left' | 'right'): {
  left?: number;
  right?: number;
  transform: string;
  tooltipPlacement: 'top-start' | 'top-end';
} {
  if (columnSide === 'left') {
    return { left: 0, transform: 'translate(-50%, -50%)', tooltipPlacement: 'top-start' };
  }
  return { right: 0, transform: 'translate(50%, -50%)', tooltipPlacement: 'top-end' };
}

// ----------------------------------------------------------------------

/**
 * A labelled group: an optional overline label above any icon/logo strip.
 * Handles the repeated pattern across platforms, clients, and projects.
 */
type LabeledIconStripProps = {
  /** Optional overline label rendered above the strip. Omitted when undefined. */
  label?: string;
  children: ReactNode;
};

function LabeledIconStrip({ label, children }: LabeledIconStripProps) {
  return (
    <Box sx={{ mt: 2.5 }}>
      {label && (
        <Typography
          variant="overline"
          sx={{ display: 'block', mb: 1, fontSize: '0.65rem', color: 'text.disabled' }}
        >
          {label}
        </Typography>
      )}
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Expandable bullet list for phase detail items.
 * Collapses by default; expands when the parent card is toggled.
 */
type CardDetailBulletsProps = {
  /** Matches `aria-controls` on the parent Paper so screen readers wire the relationship. */
  id: string;
  details: string[];
  in: boolean;
};

function CardDetailBullets({ id, details, in: expanded }: CardDetailBulletsProps) {
  return (
    <Collapse in={expanded} timeout={50}>
      <Box
        id={id}
        sx={{
          mt: 1.5,
          pt: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        }}
      >
        {details.map((detail, i) => (
          <Box
            key={i}
            sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}
          >
            <Typography
              aria-hidden="true"
              component="span"
              variant="body2"
              sx={{ color: 'text.disabled', flexShrink: 0, lineHeight: 1.6 }}
            >
              ›
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {detail}
            </Typography>
          </Box>
        ))}
      </Box>
    </Collapse>
  );
}

// ----------------------------------------------------------------------

/**
 * Floating corner badge that groups all warning/error alerts behind a single icon.
 * Positioned on the outer wrapper (outside the Paper) so it is never clipped.
 * On hover, a Tooltip lists every active alert.
 */
type CardCornerAlert = { message: string; severity: 'error' | 'warning' };

function CardCornerAlertBadge({
  alerts,
  columnSide = 'right',
}: {
  alerts: CardCornerAlert[];
  columnSide?: 'left' | 'right';
}) {
  if (alerts.length === 0) return null;
  const hasError = alerts.some((a) => a.severity === 'error');
  const { left, right, transform, tooltipPlacement } = resolveCornerBadgeAlign(columnSide);
  const tooltipContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, py: 0.5, px: 0.25 }}>
      {alerts.map((a, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <GiselleIcon
            icon="solar:danger-triangle-bold"
            width={CORNER_ALERT_LIST_ICON_SIZE}
            aria-hidden
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.55, fontSize: '0.8rem', fontWeight: 500 }}
          >
            {a.message}
          </Typography>
        </Box>
      ))}
    </Box>
  );
  return (
    <Tooltip
      title={tooltipContent}
      placement={tooltipPlacement}
      arrow
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: 320,
            px: 1.75,
            py: 1.25,
            bgcolor: 'grey.900',
            '& .MuiTooltip-arrow': { color: 'grey.900' },
          },
        },
      }}
    >
      <Box
        aria-label={`${alerts.length} issue${alerts.length !== 1 ? 's' : ''}`}
        tabIndex={0}
        sx={{
          position: 'absolute',
          top: 0,
          ...(left !== undefined ? { left } : { right }),
          zIndex: 10,
          transform,
          width: CORNER_ALERT_BADGE_SIZE,
          height: CORNER_ALERT_BADGE_SIZE,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: hasError ? 'error.main' : 'warning.dark',
          color: 'common.white',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          cursor: 'help',
          pointerEvents: 'auto',
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: hasError ? 'error.main' : 'warning.dark',
            outlineOffset: 2,
          },
        }}
      >
        <GiselleIcon icon="solar:danger-triangle-bold" width={CORNER_ALERT_ICON_SIZE} aria-hidden />
      </Box>
    </Tooltip>
  );
}

type ActiveBadgeProps = { color: string; activeLabel?: string };

function NewBadge() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
      <Box
        sx={{
          width: ACTIVE_DOT_SIZE,
          height: ACTIVE_DOT_SIZE,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: 'success.main',
          animation: `${pulseDot} 1.4s ease-in-out infinite`,
        }}
      />
      <Typography
        variant="overline"
        sx={{
          fontSize: STATUS_BADGE_FONT_SIZE,
          fontWeight: 700,
          letterSpacing: 0.8,
          lineHeight: 1.6,
          color: 'success.main',
        }}
      >
        New
      </Typography>
    </Box>
  );
}

function ActiveBadge({ color, activeLabel }: ActiveBadgeProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
      <Box
        sx={{
          width: ACTIVE_DOT_SIZE,
          height: ACTIVE_DOT_SIZE,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: `${color}.main`,
          animation: `${pulseDot} 1.4s ease-in-out infinite`,
        }}
      />
      <Typography
        variant="overline"
        sx={{
          fontSize: STATUS_BADGE_FONT_SIZE,
          fontWeight: 700,
          letterSpacing: 0.8,
          lineHeight: 1.6,
          color: `${color}.main`,
        }}
      >
        {activeLabel ?? 'Now'}
      </Typography>
    </Box>
  );
}

type ScenarioBadgeProps = { color: string; scenarioLabel: string };

function ScenarioBadge({ color, scenarioLabel }: ScenarioBadgeProps) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'inline-block',
        mb: 1,
        px: 1,
        py: 0.25,
        borderRadius: 0.75,
        fontSize: STATUS_BADGE_FONT_SIZE,
        fontWeight: 700,
        letterSpacing: 0.8,
        color: `${color}.dark`,
        bgcolor: `rgba(var(--mui-palette-${color}-mainChannel) / 0.12)`,
      }}
    >
      {scenarioLabel}
    </Typography>
  );
}

/**
 * Status badges rendered at the top of a PhaseCard.
 *
 * Badges stack when multiple conditions apply simultaneously:
 * - A phase that is both active and overdue shows the "Now" dot **and** the "Overdue" chip.
 * - A date-conflict badge stacks on top of any active/overdue badges.
 * - The scenario badge is a fallback — only shown when no other badge applies.
 */
type CardStatusBadgeProps = {
  /** Whether this is the current "active" / "Now" phase. */
  isActive: boolean;
  /** Whether the phase is already done — suppresses the active badge. */
  isDone: boolean;
  /** Optional override for the "Now" label text. @default 'Now' */
  activeLabel?: string;
  /** MUI palette key for the active badge colour. */
  color: string;
  /** Whether this phase uses the scenario variant. */
  isScenario: boolean;
  /** Scenario label text to render. Only shown when `isScenario` is true. */
  scenarioLabel?: string;
  /** When true, renders a pulsing green "New" badge — sourced from `phase.new`. */
  isNew?: boolean;
};

function CardStatusBadge({
  isActive,
  isDone,
  activeLabel,
  color,
  isScenario,
  scenarioLabel,
  isNew,
}: CardStatusBadgeProps) {
  const showActive = isActive && !isDone;
  const showScenario = !showActive && isScenario && Boolean(scenarioLabel);
  const showNew = Boolean(isNew);

  if (!showActive && !showScenario && !showNew) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {showNew && <NewBadge />}
      {showActive && <ActiveBadge color={color} activeLabel={activeLabel} />}
      {showScenario && <ScenarioBadge color={color} scenarioLabel={scenarioLabel!} />}
    </Box>
  );
}

// ----------------------------------------------------------------------

/** True when the phase uses a variant that gets the highlighted card treatment. */
function isHighlightedVariant(variant?: string): boolean {
  return variant === 'scenario' || variant === 'life-event';
}

/**
 * Decorative MetricCardDecoration + corner icon for a phase card.
 * Extracted to keep PhaseCard's own complexity below the Sonar limit.
 * Receives pre-computed `isOverduePending` to avoid repeating the `&&` in the parent.
 */
type CardDecorationProps = {
  /** Effective palette key for the decoration colour (already resolved from phase.color). */
  color: HighlightedPaletteKey;
  /**
   * `true` when the phase is both overdue AND not yet done.
   * Switches the decoration and corner icon to the error (red) palette.
   */
  isOverduePending: boolean;
  /** Phase icon rendered in the corner. Accepts any ReactNode icon slot. */
  icon: ReactNode;
};

function CardDecoration({ color, isOverduePending, icon }: CardDecorationProps) {
  return (
    <>
      {/* Gradient decoration rectangle — replicates MetricCardDecoration from giselle-mui */}
      <Box
        aria-hidden
        sx={[
          (theme) => ({
            top: -40,
            right: -56,
            width: 140,
            height: 140,
            borderRadius: 4,
            position: 'absolute',
            transform: 'rotate(40deg)',
            pointerEvents: 'none',
            background: `linear-gradient(to right, ${
              theme.vars!.palette[isOverduePending ? 'error' : color]?.main ??
              theme.vars!.palette.primary.main
            }, transparent)`,
            opacity: isOverduePending ? 0.18 : 0.08,
          }),
        ]}
      />
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          position: 'absolute',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Force the icon SVG to 32 × 32 via CSS instead of cloneElement,
          // so the icon element can remain an RSC-created React element.
          '& svg': { width: 32, height: 32 },
          color: isOverduePending
            ? theme.vars!.palette.error.main
            : (theme.vars!.palette[color]?.main ?? theme.vars!.palette.primary.main),
          opacity: isOverduePending ? 0.55 : 0.35,
        })}
      >
        {icon}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

type PaperSxParams = {
  hasDetails: boolean;
  isDone: boolean;
  color: string;
  phaseSide: 'left' | 'right';
  isHighlighted: boolean;
  isScenario: boolean;
  isOverdue: boolean;
  suppressElevation: boolean;
  textAlign: 'left' | 'right' | undefined;
};

/** Returns the sx theme callback for the root Paper element of a PhaseCard. */
function buildPaperSx(p: PaperSxParams) {
  return (theme: Theme) => ({
    p: 2.5,
    position: 'relative' as const,
    overflow: 'hidden',
    textAlign: p.textAlign ?? 'left',
    bgcolor: `rgba(${(theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']} / 0.08)`,
    // Single composed transition — covers opacity/filter (always) + box-shadow (when interactive).
    transition: p.hasDetails
      ? 'box-shadow 0.2s, opacity 0.3s, filter 0.3s'
      : 'opacity 0.3s, filter 0.3s',
    ...(p.hasDetails && {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: `0 16px 40px rgba(${
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
          (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
        } / 0.22)`,
      },
      '&:focus-visible': {
        outline: '2px solid',
        outlineColor:
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.main ??
          theme.vars!.palette.primary.main,
        outlineOffset: 3,
      },
    }),
    ...(p.isDone && {
      opacity: 0.45,
      filter: 'grayscale(1)',
      '&:hover': {
        opacity: 1,
        filter: 'none',
        ...(p.hasDetails && {
          boxShadow: `0 16px 40px rgba(${
            theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
            (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
          } / 0.22)`,
        }),
      },
    }),
    ...(p.phaseSide === 'right' &&
      !p.isHighlighted && {
        bgcolor: 'background.paper',
        borderTop: '3px solid',
        borderColor: `${p.color ?? 'primary'}.main`,
        boxShadow: `0 8px 24px rgba(${
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
          (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
        } / 0.12)`,
      }),
    ...(p.isHighlighted && {
      borderLeft: '4px solid',
      borderColor: `${p.color}.main`,
      bgcolor: `rgba(${
        theme.vars!.palette[p.color as HighlightedPaletteKey]?.mainChannel ??
        (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
      } / ${p.isScenario ? 0.1 : 0.08})`,
    }),
    // Overdue last — always overrides side/highlighted borders when active
    ...(p.isOverdue &&
      !p.isDone && {
        border: '2px solid',
        borderColor: 'error.main',
        boxShadow: `0 0 0 2px rgba(${theme.vars!.palette.error.mainChannel} / 0.2), 0 8px 32px rgba(${theme.vars!.palette.error.mainChannel} / 0.18)`,
      }),
    // Flatten elevation on all sibling cards when another is expanded
    ...(p.suppressElevation && { boxShadow: 'none' }),
  });
}

/** Returns an onClick handler that calls `toggle` only when the card has details. */
function buildCardClickHandler(hasDetails: boolean, toggle: () => void): () => void {
  return () => {
    if (hasDetails) toggle();
  };
}

/**
 * Returns an onKeyDown handler that calls `toggle` on Enter or Space
 * when the card has details.
 */
function buildCardKeyDownHandler(
  hasDetails: boolean,
  toggle: () => void
): KeyboardEventHandler<HTMLDivElement> {
  return (e) => {
    if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggle();
    }
  };
}

/** Resolves expand/toggle for controlled vs uncontrolled card mode. */
function resolveCardExpansion(
  onRequestExpand: (() => void) | undefined,
  isExpanded: boolean | undefined,
  internalExpanded: boolean,
  setInternalExpanded: Dispatch<SetStateAction<boolean>>
): { expanded: boolean; toggle: () => void } {
  if (onRequestExpand === undefined) {
    return { expanded: internalExpanded, toggle: () => setInternalExpanded((v) => !v) };
  }
  return { expanded: isExpanded ?? false, toggle: onRequestExpand };
}

// ----------------------------------------------------------------------

type DateTypographySxParams = {
  isScenario: boolean;
  isHighlighted: boolean;
  hideDecoration: boolean | undefined;
  color: string | undefined;
};

/** Returns the sx object for the phase date Typography element. */
function buildDateTypographySx({
  isScenario,
  isHighlighted,
  hideDecoration,
  color,
}: DateTypographySxParams) {
  return {
    display: 'block',
    mb: 1.5,
    pr: !isHighlighted && !hideDecoration ? 6 : 0,
    fontSize: isScenario ? '0.875rem' : '0.8rem',
    fontWeight: isScenario ? 800 : undefined,
    letterSpacing: isScenario ? 0 : undefined,
    color: isScenario ? `${color ?? 'primary'}.main` : 'text.disabled',
  };
}

/**
 * Derives the display `label`, `icon`, and `hasTextFallback` from a single
 * {@link TimelinePlatformItem}.
 *
 * A pure helper — rendering concerns (Tooltip wrapping, Box fallback) live in
 * `buildPlatformStripItems`. Exported so tests can exercise the real production
 * derivation logic without re-implementing it as a mirror.
 *
 * @internal — not part of the public component API; exported for testing only.
 *
 * - `label`           — the Tooltip title and text fallback content.
 * - `icon`            — `null` for string platforms; the ReactNode for object platforms.
 * - `hasTextFallback` — `true` when `icon` is `null` (a `<Box component="span">` is rendered).
 */
export function derivePlatformEntry(p: TimelinePlatformItem): {
  label: string;
  icon: ReactNode;
  hasTextFallback: boolean;
} {
  const isString = typeof p === 'string';
  const label = isString ? p : p.label;
  const icon = isString ? null : p.icon;
  return { label, icon, hasTextFallback: isString };
}

/**
 * Maps a phase's platform items into icon/chip nodes for inline rendering.
 *
 * @internal — not part of the public component API; exported for testing only.
 */
export function buildPlatformStripItems(platforms: TimelinePlatformItem[]): ReactNode[] {
  return platforms.map((p, i) => {
    const { label, icon } = derivePlatformEntry(p);
    return (
      <Tooltip key={`platform-${i}`} title={label} arrow placement="top">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon ?? (
            <Box component="span" sx={{ fontSize: 11, px: 0.5 }}>
              {label}
            </Box>
          )}
        </Box>
      </Tooltip>
    );
  });
}

// ----------------------------------------------------------------------

export type PhaseCardProps = Omit<BoxProps, 'children'> & {
  /** The timeline phase data to render. */
  phase: TimelinePhase;
  /** Runtime done override from the parent timeline (local toggle state). Defaults to phase.done. */
  done?: boolean;
  /** Runtime overdue override from the parent timeline. Adds a red warning border to the card. */
  overdue?: boolean;
  /** Set by the parent when this phase's date range overlaps another phase. Shows a ⚠ Date overlap badge. */
  dateConflict?: boolean;
  /** Human-readable explanation of the overlap rendered in a Tooltip on the badge. */
  dateConflictLabel?: string;
  /**
   * Controlled expansion state. When provided together with `onRequestExpand`,
   * the card operates in controlled mode and the parent owns the open/close state.
   */
  isExpanded?: boolean;
  /** Called when the user clicks or keys the card to toggle details. Controlled mode only. */
  onRequestExpand?: () => void;
  /** When true, suppresses box-shadow so the card appears flat (used when another card is expanded). */
  suppressElevation?: boolean;
  /**
   * When true, the viewed eye indicator shows as filled (success colour).
   * Only renders the indicator when `onMarkViewed` is also provided.
   */
  isViewed?: boolean;
  /**
   * Called when the user clicks the viewed eye button. Provide this to enable the indicator.
   * The parent is responsible for persisting the viewed state.
   */
  onMarkViewed?: () => void;
  /**
   * Icon rendered in the expandable-details count badge. Defaults to the bundled inline SVG subtask icon.
   * Pass `null` to suppress the icon and show only the count number.
   */
  expandableIcon?: ReactNode;
  /**
   * Which column the card sits in — controls where the corner alert badge is anchored.
   * - `'right'` (default): badge floats on the right top corner (between card and spine).
   * - `'left'`: badge floats on the left top corner (mirrored, between spine and card edge).
   */
  columnSide?: 'left' | 'right';
};

/**
 * Expandable card for a single timeline phase.
 *
 * Renders the phase title, description, date, optional icon strips (platforms,
 * clients, projects), and a collapsible bullet-point detail section.
 * Operates in controlled mode when `onRequestExpand` is provided; falls back to
 * internal toggle state otherwise.
 *
 * Status badge (overdue / active / scenario) is resolved automatically from props.
 */
export function PhaseCard({
  phase,
  done,
  overdue,
  dateConflict = false,
  dateConflictLabel,
  isExpanded,
  onRequestExpand,
  suppressElevation = false,
  expandableIcon,
  isViewed = false,
  onMarkViewed,
  columnSide = 'right',
  sx,
  ...other
}: PhaseCardProps) {
  const isDone = done ?? phase.done ?? false;
  const isOverdue = overdue ?? phase.overdue ?? false;
  const [internalExpanded, setInternalExpanded] = useState(false);

  const hasDetails = Boolean(phase.details?.length);
  const isScenario = phase.variant === 'scenario';
  const isHighlighted = isHighlightedVariant(phase.variant);
  const detailsId = `timeline-details-${String(phase.key).replace('.', '-')}`;

  const { expanded, toggle } = resolveCardExpansion(
    onRequestExpand,
    isExpanded,
    internalExpanded,
    setInternalExpanded
  );

  // Two-level title disclosure: collapsed shows shortTitle (glanceable), expanded shows full title.
  const displayTitle = expanded ? phase.title : (phase.shortTitle ?? phase.title);

  const handleClick = buildCardClickHandler(hasDetails, toggle);
  const handleKeyDown = buildCardKeyDownHandler(hasDetails, toggle);

  // Build the corner alert list from active warning/error conditions.
  const cornerAlerts: CardCornerAlert[] = [];
  if (isOverdue && !isDone) {
    cornerAlerts.push({ message: 'Overdue — past due date', severity: 'error' });
  }
  if (dateConflict) {
    cornerAlerts.push({
      message: dateConflictLabel ?? 'Date overlap with another phase',
      severity: 'warning',
    });
  }

  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {/* Corner alert badge — groups overdue/date-conflict behind a single icon */}
      <CardCornerAlertBadge alerts={cornerAlerts} columnSide={columnSide} />

      <Paper
        role={hasDetails ? 'button' : undefined}
        tabIndex={hasDetails ? 0 : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
        aria-controls={hasDetails ? detailsId : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        sx={[
          buildPaperSx({
            hasDetails,
            isDone,
            color: phase.color ?? 'primary',
            phaseSide: phase.side,
            isHighlighted,
            isScenario,
            isOverdue,
            suppressElevation,
            textAlign: phase.textAlign,
          }),
        ]}
      >
        {/* Decorative background shape + corner icon */}
        {!isHighlighted && !phase.hideDecoration && (
          <CardDecoration
            color={(phase.color ?? 'primary') as HighlightedPaletteKey}
            isOverduePending={isOverdue && !isDone}
            icon={phase.icon}
          />
        )}

        {/* Active / New / Scenario status badges */}
        <CardStatusBadge
          isActive={Boolean(phase.active)}
          isDone={isDone}
          activeLabel={phase.activeLabel}
          color={phase.color ?? 'primary'}
          isScenario={isScenario}
          scenarioLabel={phase.scenarioLabel}
          isNew={Boolean(phase.new)}
        />

        {!phase.hideDate && phase.date && (
          <Typography
            variant="subtitle2"
            sx={buildDateTypographySx({
              isScenario,
              isHighlighted,
              hideDecoration: phase.hideDecoration,
              color: phase.color,
            })}
          >
            {phase.date}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isScenario ? 'h6' : 'subtitle1'}
              sx={{ mb: hasDetails ? 0.5 : 1, pr: !isHighlighted && !phase.hideDecoration ? 6 : 0 }}
            >
              {displayTitle}
            </Typography>

            {hasDetails && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  color: 'text.secondary',
                }}
                aria-label={`${phase.details?.length ?? 0} expandable detail${(phase.details?.length ?? 0) === 1 ? '' : 's'}`}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    flexShrink: 0,
                    '& svg': { width: PHASE_PILL_ICON_SIZE, height: PHASE_PILL_ICON_SIZE },
                  }}
                >
                  {expandableIcon ?? DEFAULT_EXPANDABLE_ICON}
                </Box>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ fontWeight: 600, lineHeight: 1, fontSize: PHASE_PILL_TEXT_FONT_SIZE }}
                >
                  {phase.details?.length ?? 0}
                </Typography>
              </Box>
            )}

            {expanded && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {phase.description}
              </Typography>
            )}

            {phase.photo && (
              <Box
                component="img"
                src={phase.photo.src}
                alt={phase.photo.alt}
                sx={{
                  mt: 2,
                  width: '100%',
                  maxWidth: 200,
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  borderRadius: 1.5,
                  border: '2px solid',
                  borderColor: 'divider',
                  display: 'block',
                }}
              />
            )}

            {/* Client logos */}
            {phase.clients && (
              <LabeledIconStrip label={phase.clientsLabel}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5 }}>
                  {phase.clients.map(({ name, logo }) => (
                    <Tooltip key={name} title={name} arrow>
                      <Box
                        component="img"
                        src={logo}
                        alt={name}
                        sx={{
                          height: 40,
                          width: 'auto',
                          maxWidth: 140,
                          objectFit: 'contain',
                          opacity: 0.7,
                          filter: 'grayscale(1)',
                          transition: 'opacity 0.2s, filter 0.2s',
                          '&:hover': { opacity: 1, filter: 'none' },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </LabeledIconStrip>
            )}

            {/* Tech stack platforms */}
            {phase.platforms && phase.platforms.length > 0 && (
              <LabeledIconStrip label={phase.platformsLabel ?? 'Tech Stack'}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                  {buildPlatformStripItems(phase.platforms)}
                </Box>
              </LabeledIconStrip>
            )}

            {/* Project logos */}
            {phase.projects && (
              <LabeledIconStrip label={phase.projectsLabel}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5 }}>
                  {phase.projects.map(({ name, logo }) => (
                    <Box
                      key={name}
                      component="img"
                      src={logo}
                      alt={name}
                      sx={{
                        height: 28,
                        width: 'auto',
                        maxWidth: 100,
                        objectFit: 'contain',
                        opacity: 0.85,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 1 },
                      }}
                    />
                  ))}
                </Box>
              </LabeledIconStrip>
            )}

            {/* Optional footer slot — interactive elements below icon strips */}
            {phase.footer != null && (
              <Box sx={{ mt: 1 }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                {phase.footer}
              </Box>
            )}
          </Box>
        </Box>

        {hasDetails && (
          <CardDetailBullets id={detailsId} details={phase.details ?? []} in={expanded} />
        )}
      </Paper>

      {/* Viewed eye badge — floats outside the card at the bottom on the outer edge. */}
      {/* Uses columnSide so it mirrors the corner alert badge: outer edge away from spine. */}
      {onMarkViewed && (
        <Tooltip
          title={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
          placement={columnSide === 'left' ? 'right' : 'left'}
          arrow
        >
          <Box
            component="button"
            type="button"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onMarkViewed();
            }}
            aria-label={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
            aria-pressed={isViewed}
            sx={{
              position: 'absolute',
              bottom: 0,
              ...(columnSide === 'left' ? { left: 0 } : { right: 0 }),
              transform: 'translate(0, calc(100% + 8px))',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: EYE_BUTTON_MIN_SIZE,
              minHeight: EYE_BUTTON_MIN_SIZE,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              p: 0,
              color: isViewed ? 'success.main' : 'text.secondary',
              transition: 'color 0.15s',
              '&:hover': { color: isViewed ? 'success.dark' : 'text.primary' },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: isViewed ? 'success.main' : 'primary.main',
                outlineOffset: 2,
                borderRadius: 0.5,
              },
            }}
          >
            <GiselleIcon
              icon={isViewed ? 'solar:eye-bold' : 'solar:eye-outline'}
              width={PHASE_EYE_ICON_SIZE}
              aria-hidden
            />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
