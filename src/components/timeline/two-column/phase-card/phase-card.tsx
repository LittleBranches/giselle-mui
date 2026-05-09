import type { CardCornerAlert, PhaseCardProps } from './types';
import type { HighlightedPaletteKey } from '../types';

import { useState, useRef, useCallback, type MouseEvent } from 'react';
import { PhaseWarningPopover } from '../phase-warning-popover';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../icon/giselle/giselle-icon';
import { DEFAULT_EXPANDABLE_ICON } from '../icons';
import {
  resolvePhotoSources,
  isHighlightedVariant,
  resolveTaskChildren,
  buildCardClickHandler,
  buildCardKeyDownHandler,
  resolveCardExpansion,
} from './utils';
import { buildPlatformStripItems } from './platform-strip';
import {
  photoImgSx,
  detailCountPillSx,
  logoStripSx,
  clientLogoSx,
  platformStripSx,
  projectLogoSx,
  eyeButtonSx,
  buildPaperSx,
  buildDateTypographySx,
  pillIconBoxSx,
} from './phase-card.styles';
import {
  PHASE_EYE_ICON_SIZE,
  EYE_BUTTON_MIN_SIZE,
  PHASE_PILL_ICON_SIZE,
  PHASE_PILL_TEXT_FONT_SIZE,
} from './phase-card.const';
import { LabeledIconStrip } from './labeled-icon-strip';
import { CardDetailBullets } from './card-detail-bullets';
import { CardCornerAlertBadge } from './card-corner-alert-badge';
import { CardStatusBadge } from './card-status-badge';
import { CardDecoration } from './card-decoration';

// Re-exports — keeps `import { PhaseCardProps } from './phase-card'` working.
export type { PhaseCardProps } from './types';
// Re-exports — keeps test imports from './phase-card' working.
export { resolveCornerBadgeAlign, resolvePhotoSources, derivePlatformEntry } from './utils';
export { buildPlatformStripItems } from './platform-strip';

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
}: PhaseCardProps) {
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
                <Box component="span" sx={pillIconBoxSx(PHASE_PILL_ICON_SIZE)}>
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
              <Box sx={{ mt: 1 }} onClick={(e: MouseEvent) => e.stopPropagation()}>
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
            onClick={(e: MouseEvent) => {
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
