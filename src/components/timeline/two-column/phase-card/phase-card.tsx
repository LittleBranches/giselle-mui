import type { BoxProps } from '@mui/material/Box';
import type { HighlightedPaletteKey, TimelinePlatformItem } from '../types';
import type {
  LabeledIconStripProps,
  CardDetailBulletsProps,
  CardCornerAlertBadgeProps,
  ScenarioBadgeProps,
  CardStatusBadgeProps,
  CardDecorationProps,
  CardCornerAlert,
} from './types';

import { useState, useRef, useCallback, type ReactNode } from 'react';
import { PhaseWarningPopover } from '../phase-warning-popover';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../icon/giselle/giselle-icon';
import { DEFAULT_EXPANDABLE_ICON } from '../icons';
import {
  resolveCornerBadgeAlign,
  resolvePhotoSources,
  isHighlightedVariant,
  resolveTaskChildren,
  buildCardClickHandler,
  buildCardKeyDownHandler,
  resolveCardExpansion,
  derivePlatformEntry,
} from './utils';
import {
  photoImgSx,
  labeledIconStripLabelSx,
  detailBulletsContainerSx,
  tooltipAlertListSx,
  cornerBadgeCircleSx,
  scenarioBadgeSx,
  detailCountPillSx,
  logoStripSx,
  clientLogoSx,
  platformStripSx,
  projectLogoSx,
  eyeButtonSx,
  phaseCardIconBoxSx,
  taskRowSx,
  taskToggleButtonSx,
  taskIconStaticSx,
  taskToggleColorSx,
  taskIconColorSx,
  taskTitleSx,
  buildPaperSx,
  buildDateTypographySx,
} from './phase-card.styles';

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

/** Icon size (px) for task done-toggle icons in the expanded detail list. Meets minimum inline icon rule (16px). */
export const PHASE_TASK_ICON_SIZE = 16;

// Re-exports — keeps `import { PhaseCardProps } from './phase-card'` working.
export type { PhaseCardProps } from './types';
// Re-exports — keeps test imports from './phase-card' working.
export { resolveCornerBadgeAlign, resolvePhotoSources, derivePlatformEntry } from './utils';

// ----------------------------------------------------------------------

/**
 * A labelled group: an optional overline label above any icon/logo strip.
 * Handles the repeated pattern across platforms, clients, and projects.
 */
function LabeledIconStrip({ label, children }: LabeledIconStripProps) {
  return (
    <Box sx={{ mt: 2.5 }}>
      {label && (
        <Typography variant="overline" sx={labeledIconStripLabelSx}>
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
function CardDetailBullets({
  id,
  details,
  in: expanded,
  taskDoneStates,
  onToggleTask,
}: CardDetailBulletsProps) {
  return (
    <Collapse in={expanded} timeout={50}>
      <Box id={id} sx={detailBulletsContainerSx}>
        {details.map((task, i) => {
          const isDoneTask = taskDoneStates ? (taskDoneStates[i] ?? false) : (task.done ?? false);
          const toggleLabel = isDoneTask
            ? `Mark "${task.title}" as not done`
            : `Mark "${task.title}" as done`;
          return (
            <Box key={i} sx={taskRowSx}>
              <Box
                component={onToggleTask ? 'button' : 'span'}
                aria-label={onToggleTask ? toggleLabel : undefined}
                aria-pressed={onToggleTask ? isDoneTask : undefined}
                onClick={onToggleTask ? () => onToggleTask(i, !isDoneTask) : undefined}
                sx={
                  (onToggleTask
                    ? [taskToggleButtonSx, taskToggleColorSx(isDoneTask)]
                    : [taskIconStaticSx, taskIconColorSx(isDoneTask)]) as BoxProps['sx']
                }
              >
                <GiselleIcon
                  icon={
                    isDoneTask ? 'solar:check-circle-bold' : 'solar:record-minimalistic-outline'
                  }
                  width={PHASE_TASK_ICON_SIZE}
                />
              </Box>
              <Typography variant="body2" sx={taskTitleSx(isDoneTask)}>
                {task.title}
              </Typography>
            </Box>
          );
        })}
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
function CardCornerAlertBadge({
  alerts,
  columnSide = 'right',
  onClick,
  innerRef,
}: CardCornerAlertBadgeProps) {
  if (alerts.length === 0) return null;
  const hasError = alerts.some((a) => a.severity === 'error');
  const { left, right, transform, tooltipPlacement } = resolveCornerBadgeAlign(columnSide);
  const tooltipContent = (
    <Box sx={tooltipAlertListSx}>
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
  const badgeCircle = (
    <Box
      ref={innerRef}
      role={onClick ? 'button' : undefined}
      aria-label={`${alerts.length} issue${alerts.length !== 1 ? 's' : ''}`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      sx={cornerBadgeCircleSx({
        positionOverride: left !== undefined ? { left } : { right },
        transform,
        hasError,
        hasClickHandler: !!onClick,
        badgeSize: CORNER_ALERT_BADGE_SIZE,
      })}
    >
      <GiselleIcon icon="solar:danger-triangle-bold" width={CORNER_ALERT_ICON_SIZE} aria-hidden />
    </Box>
  );

  if (onClick) return badgeCircle;

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
      {badgeCircle}
    </Tooltip>
  );
}

function ScenarioBadge({ color, scenarioLabel }: ScenarioBadgeProps) {
  return (
    <Typography variant="overline" sx={scenarioBadgeSx(color)}>
      {scenarioLabel}
    </Typography>
  );
}

/**
 * Status badge rendered at the top of a PhaseCard.
 * Currently only the scenario badge variant is active; active/new badges were
 * removed to stabilise card height and may be reinstated in a future iteration.
 */
function CardStatusBadge({ color, isScenario, scenarioLabel }: CardStatusBadgeProps) {
  if (!isScenario || !scenarioLabel) return null;
  return <ScenarioBadge color={color} scenarioLabel={scenarioLabel} />;
}

// ----------------------------------------------------------------------

/**
 * Decorative MetricCardDecoration + corner icon for a phase card.
 * Extracted to keep PhaseCard's own complexity below the Sonar limit.
 * Receives pre-computed `isOverduePending` to avoid repeating the `&&` in the parent.
 */
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
      <Box aria-hidden="true" sx={phaseCardIconBoxSx(color, isOverduePending)}>
        {icon}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

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
  onPhasesChange,
  allPhases,
  taskDoneStates,
  onToggleTask,
  sx,
  ...other
}: import('./types').PhaseCardProps) {
  const badgeRef = useRef<HTMLElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const handleOpenPopover = useCallback(() => setPopoverOpen(true), []);
  const handleClosePopover = useCallback(() => setPopoverOpen(false), []);
  const popoverMode = Boolean(onPhasesChange && allPhases);
  const isDone = done ?? phase.done ?? false;
  const isOverdue = overdue ?? phase.overdue ?? false;
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Three-level title disclosure:
  //   REST  (collapsed, no hover) → shortTitle (glanceable)
  //   HOVER (collapsed, hovered)  → full title + description (preview before clicking)
  //   EXPANDED (after click)      → full title + description + platforms + clients + details
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const taskChildren = resolveTaskChildren(phase);
  const hasDetails = taskChildren.length > 0;
  const isScenario = phase.variant === 'scenario';
  const isHighlighted = isHighlightedVariant(phase.variant);
  const detailsId = `timeline-details-${String(phase.key).replace('.', '-')}`;

  const { expanded, toggle } = resolveCardExpansion(
    onRequestExpand,
    isExpanded,
    internalExpanded,
    setInternalExpanded
  );

  // Three-level title disclosure: collapsed shows shortTitle (glanceable),
  // hovered or expanded shows full title.
  const displayTitle = expanded || isHovered ? phase.title : (phase.shortTitle ?? phase.title);

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
      {/* Corner alert badge — tooltip-only in read-only mode; clickable in popover mode */}
      <CardCornerAlertBadge
        alerts={cornerAlerts}
        columnSide={columnSide}
        onClick={popoverMode ? handleOpenPopover : undefined}
        innerRef={popoverMode ? badgeRef : undefined}
      />

      {/* PhaseWarningPopover — only rendered when onPhasesChange + allPhases are provided */}
      {popoverMode && onPhasesChange && allPhases && (
        <PhaseWarningPopover
          open={popoverOpen}
          anchorEl={badgeRef.current}
          onClose={handleClosePopover}
          currentPhase={phase}
          allPhases={allPhases}
          onPhasesChange={onPhasesChange}
        />
      )}

      <Paper
        role={hasDetails ? 'button' : undefined}
        tabIndex={hasDetails ? 0 : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
        aria-controls={hasDetails ? detailsId : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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

        {/* Scenario status badge */}
        <CardStatusBadge
          color={phase.color ?? 'primary'}
          isScenario={isScenario}
          scenarioLabel={phase.scenarioLabel}
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
                sx={detailCountPillSx}
                aria-label={`${taskChildren.length} expandable detail${taskChildren.length === 1 ? '' : 's'}`}
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
                  {taskChildren.length}
                </Typography>
              </Box>
            )}

            {expanded && phase.description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {phase.description}
              </Typography>
            )}

            {expanded &&
              resolvePhotoSources(phase)?.map((p, i) => (
                <Box key={i} component="img" src={p.src} alt={p.alt} sx={photoImgSx(i === 0)} />
              ))}

            {/* Client logos — shown only in expanded state (level 3) */}
            {expanded && phase.clients && (
              <LabeledIconStrip label={phase.clientsLabel}>
                <Box sx={logoStripSx}>
                  {phase.clients.map(({ name, logo }) => (
                    <Tooltip key={name} title={name} arrow>
                      <Box component="img" src={logo} alt={name} sx={clientLogoSx} />
                    </Tooltip>
                  ))}
                </Box>
              </LabeledIconStrip>
            )}

            {/* Tech stack platforms — shown only in expanded state (level 3) */}
            {expanded && phase.platforms && phase.platforms.length > 0 && (
              <LabeledIconStrip label={phase.platformsLabel ?? 'Tech Stack'}>
                <Box sx={platformStripSx}>{buildPlatformStripItems(phase.platforms)}</Box>
              </LabeledIconStrip>
            )}

            {/* Project logos — shown only in expanded state (level 3) */}
            {expanded && phase.projects && (
              <LabeledIconStrip label={phase.projectsLabel}>
                <Box sx={logoStripSx}>
                  {phase.projects.map(({ name, logo }) => (
                    <Box key={name} component="img" src={logo} alt={name} sx={projectLogoSx} />
                  ))}
                </Box>
              </LabeledIconStrip>
            )}

            {/* Optional footer slot — shown only in expanded state (level 3) */}
            {expanded && phase.footer != null && (
              <Box sx={{ mt: 1 }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                {phase.footer}
              </Box>
            )}
          </Box>
        </Box>

        {hasDetails && (
          <CardDetailBullets
            id={detailsId}
            details={taskChildren}
            in={expanded}
            taskDoneStates={taskDoneStates}
            onToggleTask={onToggleTask}
          />
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
            sx={eyeButtonSx({ columnSide, isViewed, minSize: EYE_BUTTON_MIN_SIZE })}
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
