import type { PaperProps } from '@mui/material/Paper';
import type { Task, TimelineMilestone, HighlightedPaletteKey } from '../types';

import { useCallback, useState, type ReactNode, type KeyboardEvent } from 'react';
import type React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { DEFAULT_EXPANDABLE_ICON } from '../icons';
import { GiselleIcon } from '../../../icon/giselle/giselle-icon';
import {
  milestoneNewBadgeRowSx,
  milestoneNewDotSx,
  milestoneNewLabelSx,
  milestoneDateSx,
  milestoneTitleRowSx,
  milestoneEyeButtonSx,
  milestoneDetailPillSx,
  milestoneDetailListSx,
  milestoneDetailRowSx,
} from './milestone-badge.styles';

// ----------------------------------------------------------------------

/** Minimum readable font size for the milestone date label. Matches `body2`. */
export const MILESTONE_DATE_FONT_SIZE = '0.875rem';

/** Width/height (px) of the subtask icon in the expandable details pill. */
export const MILESTONE_PILL_ICON_SIZE = 16;

/** Font size for the count label in the expandable details pill. */
export const MILESTONE_PILL_TEXT_FONT_SIZE = '0.75rem';

/**
 * Size (px) of the viewed eye icon in the milestone title row.
 * Must meet WCAG 1.4.11 — interactive controls must have visible contrast >= 3:1.
 * Never set below 20px.
 */
export const MILESTONE_EYE_ICON_SIZE = 20;

/**
 * Minimum touch-target size (px) for the milestone eye viewed button.
 * Meets WCAG 2.2 AA 2.5.8 — minimum 24 × 24 CSS pixels for pointer targets.
 */
export const MILESTONE_EYE_BUTTON_MIN_SIZE = 28;

// ----------------------------------------------------------------------

export type MilestoneBadgeProps = Omit<PaperProps, 'children'> & {
  /** The milestone data object from the parent phase's `milestones` array. */
  milestone: TimelineMilestone;
  /** Dims and desaturates the card. Mirrors the checklist done state from the parent timeline. */
  done?: boolean;
  /** Whether this card's details section is currently expanded. Controlled by the parent accordion. */
  isExpanded: boolean;
  /** Called when the user clicks or keys Enter/Space to toggle this card open or closed. */
  onRequestExpand: () => void;
  /** When true, suppresses box-shadow so the card appears flat (used when another card is expanded). */
  suppressElevation?: boolean;
  /**
   * Icon rendered in the expandable-details count badge. Defaults to the bundled inline SVG subtask icon.
   * Pass `null` to suppress the icon and show only the count number.
   */
  expandableIcon?: ReactNode;
  /**
   * Stable unique id prefix used to construct the `aria-controls` / `id` pair for the
   * expandable details region. Should be unique across all milestones on the page
   * (e.g. `"${phaseKey}-${milestoneIndex}"`). Falls back to a sanitised title slug
   * when omitted, which can collide if two milestones share the same title.
   */
  stableId?: string;
  /**
   * When true, the viewed eye indicator shows as filled (success colour).
   * Only renders when `onMarkViewed` is also provided.
   */
  isViewed?: boolean;
  /** Called when the user clicks the viewed eye button. Parent handles persistence. */
  onMarkViewed?: () => void;
  /**
   * Which column this milestone sits in. Left-column milestones right-align their
   * collapsed title and inline elements so text sits flush against the centre spine.
   * Alignment resets to left when the card is expanded.
   * @default 'right'
   */
  columnSide?: 'left' | 'right';
};

/**
 * Milestone card — spine-adjacent badge that expands/collapses on click.
 * Expansion is controlled externally (accordion: at most one open per phase).
 * The parent wrapper in TimelineTwoColumn owns z-index and blur animations.
 */
export function MilestoneBadge({
  milestone: m,
  done = false,
  isExpanded,
  onRequestExpand,
  suppressElevation = false,
  expandableIcon,
  stableId,
  isViewed = false,
  onMarkViewed,
  columnSide = 'right',
  sx,
  ...other
}: MilestoneBadgeProps) {
  // Right-align the collapsed view when in the left column so text sits flush
  // against the centre spine instead of leaving a gap at the right edge of the card.
  // Alignment resets to left only when expanded.
  const rightAlign = columnSide === 'left' && !isExpanded;

  /**
   * Normalises milestone expandable content to `Task[]`.
   *
   * Resolution order:
   *   1. `m.children` — new structured form (Task tree, any depth).
   *   2. `m.details`  — legacy flat string array, mapped to `{ title }` shims.
   *   3. Empty array  — milestone has no expandable content.
   */
  const taskChildren: Task[] = m.children?.length
    ? m.children
    : (m.details?.map((title: string) => ({ title })) ?? []);

  const hasDetails = taskChildren.length > 0;
  const colorKey = (m.color ?? 'primary') as HighlightedPaletteKey;
  const titleSlug = String(m.title)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();
  const detailsId = stableId ? `ms-details-${stableId}` : `ms-details-${titleSlug}`;

  // Three-level title disclosure:
  //   collapsed (no hover)  → shortTitle (glanceable)
  //   collapsed (hovered)   → full title (preview before clicking)
  //   expanded              → full title
  //
  // The ResizeObserver was removed (see timeline-two-column.tsx) so hover no
  // longer triggers a slot-height update or a layout shift. It is now safe to
  // change displayTitle on hover.
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const displayTitle = isExpanded || isHovered ? m.title : (m.shortTitle ?? m.title);

  const handleClick = useCallback(() => {
    if (hasDetails) onRequestExpand();
  }, [hasDetails, onRequestExpand]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onRequestExpand();
      }
    },
    [hasDetails, onRequestExpand]
  );

  return (
    <Paper
      {...other}
      role={hasDetails ? 'button' : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      aria-expanded={hasDetails ? isExpanded : undefined}
      aria-controls={hasDetails ? detailsId : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={[
        (theme) => ({
          p: 2,
          overflow: 'hidden',
          // Default (collapsed): transparent — no background, border colour set to transparent
          // so the 3px top border slot is reserved for a smooth colour transition on hover.
          borderTop: '3px solid',
          borderTopColor: isExpanded
            ? (theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main)
            : 'transparent',
          bgcolor: isExpanded ? 'background.paper' : 'transparent',
          boxShadow: isExpanded
            ? `0 4px 16px rgba(${
                theme.vars!.palette[colorKey]?.mainChannel ??
                (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
              } / 0.1)`
            : 'none',
          transition:
            'box-shadow 0.22s, opacity 0.3s, filter 0.3s, background-color 0.22s, border-color 0.22s',
          ...(rightAlign && { textAlign: 'right' }),
          ...(done && {
            opacity: 0.45,
            filter: 'grayscale(1)',
            // Override parent msCardWrapperSx pointerEvents:none (applied when another
            // card is expanded/blurred). Done milestone cards must always be hoverable
            // so the reader can temporarily restore full colour by hovering.
            pointerEvents: 'auto',
          }),
          // Hover reveals the styled card for ALL milestones (title preview),
          // but cursor:pointer only for expandable ones.
          // Done cards also restore full opacity/filter on hover so the opaque
          // background.paper is fully visible and doesn't bleed through.
          ...(!isExpanded && {
            '&:hover': {
              bgcolor: 'background.paper',
              borderTopColor:
                theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main,
              boxShadow: `0 16px 40px rgba(${
                theme.vars!.palette[colorKey]?.mainChannel ??
                (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
              } / 0.22)`,
              ...(hasDetails && { cursor: 'pointer' }),
              ...(done && { opacity: 1, filter: 'none' }),
            },
          }),
          ...(hasDetails &&
            !isExpanded && {
              '&:focus-visible': {
                bgcolor: 'background.paper',
                borderTopColor:
                  theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main,
                outline: '2px solid',
                outlineColor:
                  theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main,
                outlineOffset: 3,
              },
            }),
          // Flatten elevation when another card is expanded
          ...(suppressElevation && { boxShadow: 'none' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {m.new && (
        <Box sx={milestoneNewBadgeRowSx(rightAlign)}>
          <Box sx={milestoneNewDotSx} />
          <Typography variant="caption" sx={milestoneNewLabelSx}>
            New
          </Typography>
        </Box>
      )}

      {m.date && (
        <Typography variant="caption" sx={milestoneDateSx(MILESTONE_DATE_FONT_SIZE)}>
          {m.date}
        </Typography>
      )}

      <Box sx={milestoneTitleRowSx(rightAlign)}>
        {/* Eye button: left side for right-aligned (left-column) cards */}
        {onMarkViewed && rightAlign && (
          <Tooltip
            title={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
            placement="right"
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
              sx={milestoneEyeButtonSx({
                isViewed: !!isViewed,
                minSize: MILESTONE_EYE_BUTTON_MIN_SIZE,
              })}
            >
              <GiselleIcon
                icon={isViewed ? 'solar:eye-bold' : 'solar:eye-outline'}
                width={MILESTONE_EYE_ICON_SIZE}
                aria-hidden
              />
            </Box>
          </Tooltip>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {displayTitle}
        </Typography>

        {/* Eye button: right side for left-aligned (right-column) cards */}
        {onMarkViewed && !rightAlign && (
          <Tooltip
            title={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
            placement="left"
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
              sx={milestoneEyeButtonSx({
                isViewed: !!isViewed,
                minSize: MILESTONE_EYE_BUTTON_MIN_SIZE,
              })}
            >
              <GiselleIcon
                icon={isViewed ? 'solar:eye-bold' : 'solar:eye-outline'}
                width={MILESTONE_EYE_ICON_SIZE}
                aria-hidden
              />
            </Box>
          </Tooltip>
        )}
      </Box>

      {(isExpanded || isHovered) && m.description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {m.description}
        </Typography>
      )}

      {hasDetails && (
        <Box
          sx={milestoneDetailPillSx}
          aria-label={`${taskChildren.length} expandable detail${taskChildren.length === 1 ? '' : 's'}`}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              flexShrink: 0,
              '& svg': { width: MILESTONE_PILL_ICON_SIZE, height: MILESTONE_PILL_ICON_SIZE },
            }}
          >
            {expandableIcon ?? DEFAULT_EXPANDABLE_ICON}
          </Box>
          <Typography
            component="span"
            variant="caption"
            sx={{ fontWeight: 600, lineHeight: 1, fontSize: MILESTONE_PILL_TEXT_FONT_SIZE }}
          >
            {taskChildren.length}
          </Typography>
        </Box>
      )}

      {hasDetails && (
        <Collapse in={isExpanded} timeout={50}>
          <Box id={detailsId} sx={milestoneDetailListSx}>
            {taskChildren.map((task, i) => (
              <Box key={i} sx={milestoneDetailRowSx}>
                <Typography
                  aria-hidden="true"
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.disabled', flexShrink: 0, lineHeight: 1.6 }}
                >
                  ›
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {task.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </Paper>
  );
}
