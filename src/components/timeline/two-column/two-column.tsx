import type {
  TimelineTwoColumnProps,
  Milestone,
  MilestoneRowCtx,
  TimelineColumnProps,
} from './types';

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  type ReactNode,
} from 'react';

// SSR-safe layout effect — runs as useLayoutEffect on the client (synchronous, before
// first paint) and falls back to useEffect on the server (no-op in SSR environments).
// This prevents the React "useLayoutEffect does nothing on the server" warning for
// consumers using Next.js or any other server-side renderer.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { PhaseCard } from './phase-card';
import { TimelineDot } from './timeline-dot';
import { MilestoneBadge } from './milestone-badge';
import { SpineConnector } from './spine-connector';
import {
  detectPhaseOverlaps,
  sortMilestonesAsc,
  sortMilestonesDesc,
  sortPhasesByDate,
  resolvePhaseState,
  resolvePhaseDotHandlers,
  buildPhaseCardTsxProps,
  resolvePhaseTooltip,
  resolveMilestoneTooltip,
  buildPhaseDotTsxProps,
  resolveMilestoneState,
  resolveMilestoneDotHandlers,
  computeSlotHeights,
} from './utils';
import {
  timelineColumnSx,
  msRowSx,
  msColumnBoxSx,
  msDotWrapperSx,
  floatingDatePillSx,
  markerPhaseLiSx,
  markerLeftLabelSx,
  markerCenterSx,
  markerRightLabelSx,
  phaseRowSx,
  phaseLiSx,
  msCardWrapperSx,
  centerColumnSx,
  timelineRootSx,
  markerRowInnerSx,
  markerCaptionSx,
  markerDateSpanSx,
} from './styles';

// ----------------------------------------------------------------------

/**
 * One flex column in the two-column phase row.
 *
 * @remarks
 * The Box is a flex layout child of the phase row — NOT part of PhaseCard.
 * It controls column width (`flex: 1`), text alignment, padding, and
 * responsive visibility. Keep it in the parent, not inside PhaseCard.
 *
 * On mobile (`xs`) the column is hidden when it carries no content for this
 * phase (empty padding would still consume space). On desktop (`md+`) both
 * columns always render.
 *
 * REGRESSION NOTE: This helper was extracted deliberately to prevent the
 * two near-identical column Boxes from drifting out of sync during refactors.
 * Do NOT inline these Boxes back into the render. If you need to change column
 * behaviour, change it here once.
 */
function TimelineColumn({ columnSide, hasContent, children, bottomPadding }: TimelineColumnProps) {
  return (
    <Box data-col={columnSide} sx={timelineColumnSx(columnSide, hasContent, bottomPadding)}>
      {children}
    </Box>
  );
}

// Stable empty Set — returned when `viewedKeys` prop is undefined so callers
// always get the same reference and avoid creating a new Set on every render.
const EMPTY_VIEWED_KEYS = new Set<string>();

/** Builds the full JSX node for a single milestone row. */
function buildMilestoneRow(
  ms: Milestone,
  mi: number,
  totalMilestones: number,
  ctx: MilestoneRowCtx
): React.ReactNode {
  const { msDone, msColor } = resolveMilestoneState(
    ms,
    mi,
    ctx.phaseKey,
    ctx.dotColor,
    ctx.checklist,
    ctx.localMilestoneDone
  );
  const { msDotClickAction, msDotKeyDown, msDotAriaLabel } = resolveMilestoneDotHandlers(
    ms,
    mi,
    ctx.phaseKey,
    msDone,
    ctx.checklist,
    ctx.handleToggleMilestone
  );

  // Milestone inherits the parent phase side when no explicit side is set.
  // Explicit ms.side overrides — used for context milestones that factually belong
  // in the opposite column from their parent phase (e.g. tech/world-event entries
  // on a professional phase that belong in the Education & Open Source column).
  const effectiveMsSide = ms.side ?? ctx.phaseSide;
  const isThisMsExpanded = ctx.expandedMiIdx === mi;
  const topPercent = ((mi + 1) / (totalMilestones + 1)) * 100;
  const stopProp = isThisMsExpanded ? (e: React.MouseEvent) => e.stopPropagation() : undefined;
  const suppressElevation = ctx.anyExpanded && !isThisMsExpanded;
  const msDoneForBadge = msDone;
  const dotChecklistProps = ctx.checklist
    ? {
        role: 'checkbox' as const,
        'aria-checked': msDone,
        'aria-label': msDotAriaLabel,
        tabIndex: 0,
      }
    : {};

  return (
    <Box key={`ms-row-${mi}`} sx={msRowSx(topPercent)}>
      {/* Left column — milestone card for milestones with effective side='left' */}
      <Box data-col="left" sx={msColumnBoxSx(effectiveMsSide === 'left')}>
        {effectiveMsSide === 'left' && (
          <Box
            data-ms-card="true"
            ref={(el: HTMLDivElement | null) => ctx.onMeasure(mi, el)}
            onClick={stopProp}
            sx={msCardWrapperSx(isThisMsExpanded, suppressElevation, 'left')}
          >
            <MilestoneBadge
              milestone={ms}
              done={msDoneForBadge}
              isExpanded={isThisMsExpanded}
              suppressElevation={suppressElevation}
              stableId={`${ctx.phaseKey}-${mi}`}
              expandableIcon={ctx.expandableIcon}
              columnSide="left"
              isViewed={ctx.viewedKeys.has(`ms-${ctx.phaseKey}-${mi}`)}
              onMarkViewed={
                ctx.onMarkViewed ? () => ctx.onMarkViewed!(`ms-${ctx.phaseKey}-${mi}`) : undefined
              }
              onRequestExpand={() => ctx.handleExpandMilestone(ctx.phaseKey, mi)}
            />
          </Box>
        )}
      </Box>

      {/* Centre: milestone dot — blurs with siblings when another card is open */}
      <Box data-col="center" sx={centerColumnSx}>
        {/* Dot + floating date pill: relative wrapper so pill doesn't affect row height/centering */}
        <Box sx={msDotWrapperSx(suppressElevation)}>
          {ms.date && (
            <Typography variant="caption" aria-hidden sx={floatingDatePillSx}>
              {ms.date}
            </Typography>
          )}
          <Tooltip
            title={resolveMilestoneTooltip(ctx.checklist, msColor, msDone, ms)}
            placement="top"
            arrow
          >
            <span>
              <TimelineDot
                icon={ms.icon}
                color={msColor}
                dotBg={ms.dotBg}
                size="milestone"
                done={msDone}
                onClick={msDotClickAction}
                onKeyDown={msDotKeyDown}
                {...dotChecklistProps}
              />
            </span>
          </Tooltip>
        </Box>
        {/* No spine here — the phase row's SpineConnector runs behind all milestone dots */}
      </Box>

      {/* Right column — milestone card for milestones with effective side='right' */}
      <Box data-col="right" sx={msColumnBoxSx(effectiveMsSide === 'right')}>
        {effectiveMsSide === 'right' && (
          <Box
            data-ms-card="true"
            ref={(el: HTMLDivElement | null) => ctx.onMeasure(mi, el)}
            onClick={stopProp}
            sx={msCardWrapperSx(isThisMsExpanded, suppressElevation, 'right')}
          >
            <MilestoneBadge
              milestone={ms}
              done={msDoneForBadge}
              isExpanded={isThisMsExpanded}
              suppressElevation={suppressElevation}
              stableId={`${ctx.phaseKey}-${mi}`}
              expandableIcon={ctx.expandableIcon}
              isViewed={ctx.viewedKeys.has(`ms-${ctx.phaseKey}-${mi}`)}
              onMarkViewed={
                ctx.onMarkViewed ? () => ctx.onMarkViewed!(`ms-${ctx.phaseKey}-${mi}`) : undefined
              }
              onRequestExpand={() => ctx.handleExpandMilestone(ctx.phaseKey, mi)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Two-column alternating timeline.
 *
 * Phases are sorted automatically (active pinned first, then newest → oldest).
 * Each phase renders a dot on the central spine and a card in the left or right
 * column depending on `phase.side`. Milestone dots appear at equal intervals
 * along the spine between consecutive phases.
 *
 * Two modes:
 * - **Default (read-only):** cards are expandable on click; no done/overdue state.
 * - **Checklist:** pass `checklist` to enable dot-click toggling, done dimming,
 *   and automatic overdue detection (past date + not done + not active → red).
 *
 * For hero navigation use, pass `selectedPhaseKey` + `onPhaseSelect` to control
 * which phase dot appears active from the outside.
 */
export function TimelineTwoColumn({
  phases,
  checklist = false,
  onTogglePhaseDone,
  onToggleMilestoneDone,
  selectedPhaseKey,
  onPhaseSelect,
  expandableIcon,
  viewedKeys,
  onMarkViewed,
  onPhasesChange,
  sortOrder = 'desc',
  milestoneSlotHeight = 60,
  phaseCardGap = 90,
  yearLabelMarginBottom = 50,
  sx,
  ...other
}: TimelineTwoColumnProps) {
  // Internal done-state overlay — initialised from data, toggled by dot clicks.
  // Re-synced whenever `phases` changes (e.g. async load, external reset).
  const [localPhaseDone, setLocalPhaseDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(phases.map((p) => [String(p.key), p.done ?? false]))
  );
  const [localMilestoneDone, setLocalMilestoneDone] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    phases.forEach((p) =>
      p.milestones?.forEach((ms, i) => {
        m[`${p.key}-${i}`] = ms.done ?? false;
      })
    );
    return m;
  });

  // Sync done state when the phases prop identity changes (new dataset, async load, reset).
  useEffect(() => {
    setLocalPhaseDone(Object.fromEntries(phases.map((p) => [String(p.key), p.done ?? false])));
    const m: Record<string, boolean> = {};
    phases.forEach((p) =>
      p.milestones?.forEach((ms, i) => {
        m[`${p.key}-${i}`] = ms.done ?? false;
      })
    );
    setLocalMilestoneDone(m);
  }, [phases]);

  // Toggle-animation counters — incremented on every click so the icon wrapper
  // gets a new `key` and remounts, which restarts the CSS animation cleanly.
  const [phaseToggleCounts, setPhaseToggleCounts] = useState<Record<string, number>>({});

  // Accordion state: tracks which milestone index (if any) is expanded per phase.
  // null = all collapsed. Toggling a value auto-collapses the previously open card.
  const [expandedMilestoneMap, setExpandedMilestoneMap] = useState<Record<string, number | null>>(
    {}
  );

  // Which phase card (by key) is currently expanded. null = all collapsed.
  const [expandedPhaseKey, setExpandedPhaseKey] = useState<number | null>(null);

  const handleExpandMilestone = useCallback((phaseKey: number, milestoneIndex: number) => {
    const k = String(phaseKey);
    // Collapse any open phase card when a milestone opens.
    setExpandedPhaseKey(null);
    // Toggle: clicking an already-expanded card collapses it.
    // The wrapper Box calls stopPropagation() on the expanded card's click, so the
    // document listener never fires on that card — toggle is the only close path for
    // milestone cards. Without toggle, the card gets stuck open and all other milestone
    // cards remain suppressed (pointerEvents: none), breaking hover on the whole timeline.
    setExpandedMilestoneMap((prev) => ({
      ...prev,
      [k]: prev[k] === milestoneIndex ? null : milestoneIndex,
    }));
  }, []);

  const handleExpandPhaseCard = useCallback((phaseKey: number) => {
    // Collapse all milestones when a phase card opens.
    setExpandedMilestoneMap({});
    // Toggle: clicking an already-expanded phase card collapses it.
    setExpandedPhaseKey((prev) => (prev === phaseKey ? null : phaseKey));
  }, []);

  const handleTogglePhase = useCallback(
    (key: number) => {
      setPhaseToggleCounts((prev) => ({ ...prev, [String(key)]: (prev[String(key)] ?? 0) + 1 }));
      const next = !localPhaseDone[String(key)];
      setLocalPhaseDone((prev) => ({ ...prev, [String(key)]: next }));
      onTogglePhaseDone?.(key, next);
    },
    [localPhaseDone, onTogglePhaseDone]
  );

  const handleToggleMilestone = useCallback(
    (phaseKey: number, milestoneIndex: number) => {
      const k = `${phaseKey}-${milestoneIndex}`;
      const next = !localMilestoneDone[k];
      const updated = { ...localMilestoneDone, [k]: next };
      setLocalMilestoneDone(updated);
      onToggleMilestoneDone?.(phaseKey, milestoneIndex, next);

      // Auto-done: if all milestones of this phase are now done, mark the phase done too.
      const phase = phases.find((p) => p.key === phaseKey);
      if (phase?.milestones?.length) {
        const allDone = phase.milestones.every((_, i) => updated[`${phaseKey}-${i}`] ?? false);
        if (allDone && !localPhaseDone[String(phaseKey)]) {
          setPhaseToggleCounts((prev) => ({
            ...prev,
            [String(phaseKey)]: (prev[String(phaseKey)] ?? 0) + 1,
          }));
          setLocalPhaseDone((prev) => ({ ...prev, [String(phaseKey)]: true }));
          onTogglePhaseDone?.(phaseKey, true);
        }
      }
    },
    [localMilestoneDone, phases, localPhaseDone, onToggleMilestoneDone, onTogglePhaseDone]
  );

  // Midnight today — used for auto-overdue detection.
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Sort phases by date, then sort milestones within each phase.
  // Career timelines use 'desc' → milestones latest-first (matches the top-to-bottom newest-first flow).
  // Roadmap timelines use 'asc' → milestones earliest-first.
  const sortMilestones = sortOrder === 'asc' ? sortMilestonesAsc : sortMilestonesDesc;
  const sorted = useMemo(
    () =>
      sortPhasesByDate(phases, sortOrder).map((phase) => ({
        ...phase,
        milestones: phase.milestones ? sortMilestones(phase.milestones) : phase.milestones,
      })),
    [phases, sortOrder, sortMilestones]
  );

  // Detect phases whose date ranges overlap — shown as ⚠ Date overlap badge.
  const overlappingKeys = useMemo(() => detectPhaseOverlaps(phases), [phases]);

  const lastKey = sorted.at(-1)?.key;

  // True whenever any card (phase or milestone) is open anywhere in the timeline.
  // Used to blur every other card and dot globally.
  const anyExpanded = useMemo(
    () => expandedPhaseKey !== null || Object.values(expandedMilestoneMap).some((v) => v !== null),
    [expandedPhaseKey, expandedMilestoneMap]
  );

  // Collapse all when the user clicks anywhere outside the currently open card.
  // Only active while a card is expanded — no listener overhead when all collapsed.
  useEffect(() => {
    if (!anyExpanded) return undefined;
    const handler = () => {
      setExpandedMilestoneMap({});
      setExpandedPhaseKey(null);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [anyExpanded]);

  // Per-milestone card height measurement.
  //
  // Milestone cards are absolutely positioned at top:X% inside the phase <li>.
  // The <li> minHeight must be tall enough for all dots to be evenly spaced.
  // We measure each card's height during the React commit phase via ref callbacks
  // (onMeasure), then compute the required slot height in a useLayoutEffect.
  //
  // DESIGN INVARIANT — measurements run only on mount and when `sorted` changes.
  // They must NEVER run in response to user interaction (hover, expand, collapse):
  //
  //   • The ref callback fires only when an element mounts or unmounts. While a
  //     card is expanding, its wrapper Box is NOT remounted — only its children
  //     change. So onMeasure is never called during expand/collapse/hover.
  //
  //   • useLayoutEffect depends only on [sorted]. Expanding a card does not change
  //     `sorted`, so the effect never re-runs during user interaction.
  //
  // This is intentionally simpler than a ResizeObserver approach. A ResizeObserver
  // that fires on every size change (including expand/hover) creates a
  // measurement → msSlotHeights update → <li> minHeight change → top:X% shift →
  // mouseleave/mouseenter feedback loop that is impossible to break cleanly.
  // The ref + layout-effect pattern avoids this class of bug entirely.
  const msHeightMapRef = useRef<Record<string, number>>({});
  const [msSlotHeights, setMsSlotHeights] = useState<Record<string, number>>({});

  useIsomorphicLayoutEffect(() => {
    const result = computeSlotHeights(sorted, msHeightMapRef.current);
    setMsSlotHeights((prev) => {
      // Check both directions: a key appearing only in prev (removed phase) is also a change.
      const prevKeys = Object.keys(prev);
      const resultKeys = Object.keys(result);
      const changed =
        prevKeys.length !== resultKeys.length || resultKeys.some((k) => result[k] !== prev[k]);
      return changed ? result : prev;
    });
  }, [sorted]);

  // Stable reference for the viewed-key lookup — avoids creating a new Set on every render
  // when the `viewedKeys` prop is undefined.
  const effectiveViewedKeys = viewedKeys ?? EMPTY_VIEWED_KEYS;

  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Timeline sx={timelineRootSx}>
        {sorted.map((phase, i) => {
          const { isDone, isOverdue, dotColor, yearLabelValue, phaseMilestones, isLastPhase } =
            resolvePhaseState(phase, i, sorted, lastKey, checklist, localPhaseDone, today);

          // ── Marker variant ──────────────────────────────────────────────────
          // variant='marker': spine-only row — dot + floating label, no card.
          // Use for single point-in-time events that don't need a full card
          // (e.g. a certification, a visa grant, a birth date outside any period).
          // The label floats to whichever side `phase.side` specifies (direct, not inverted).
          if (phase.variant === 'marker') {
            // Use resolvePhaseTooltip so the marker tooltip is consistent with all other
            // phase dots: description preview → shortTitle + date → title fallback.
            // Previously this fell back to bare `phase.title`, dropping date and shortTitle.
            const markerTooltip = resolvePhaseTooltip(checklist, dotColor, isDone, phase);
            return (
              <Box key={phase.key} component="li" data-testid="tl-item" sx={markerPhaseLiSx}>
                <Box sx={markerRowInnerSx}>
                  {/* Left label — shown when side === 'left' */}
                  <Box sx={markerLeftLabelSx}>
                    {phase.side === 'left' && (
                      <Typography variant="caption" sx={markerCaptionSx}>
                        {phase.shortTitle ?? phase.title}
                        {phase.date && (
                          <Box component="span" sx={markerDateSpanSx}>
                            · {phase.date}
                          </Box>
                        )}
                      </Typography>
                    )}
                  </Box>
                  {/* Spine dot */}
                  <Box data-col="center" sx={markerCenterSx}>
                    <Tooltip title={markerTooltip} placement="top" arrow>
                      <span>
                        <TimelineDot
                          icon={phase.icon}
                          color={dotColor}
                          size="milestone"
                          done={isDone}
                        />
                      </span>
                    </Tooltip>
                    {!isLastPhase && (
                      <SpineConnector dotColor={dotColor} yearMilestone={yearLabelValue} />
                    )}
                  </Box>
                  {/* Right label — shown when side !== 'left' */}
                  <Box sx={markerRightLabelSx}>
                    {phase.side !== 'left' && (
                      <Typography variant="caption" sx={markerCaptionSx}>
                        {phase.shortTitle ?? phase.title}
                        {phase.date && (
                          <Box component="span" sx={markerDateSpanSx}>
                            · {phase.date}
                          </Box>
                        )}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          }

          const { dotClickAction, dotKeyDownHandler, dotAriaLabel } = resolvePhaseDotHandlers(
            phase,
            isDone,
            checklist,
            handleTogglePhase,
            onPhaseSelect
          );

          // ── Layout: nested flex rows ──────────────────────────────────────
          // Each phase renders as ONE <li data-testid="tl-item"> containing:
          //   Row 0 — phase row:  [card]  | [phase dot + spine↓] | [empty]  (or mirrored)
          //   Row 1..N — ms rows: [empty] | [ms dot + spine↓]    | [ms card (absolute)]
          //
          // Milestone cards are absolutely positioned within their column so card expansion
          // never shifts the spine dot positions. Accordion: at most one open per phase.

          const expandedMiIdx = expandedMilestoneMap[String(phase.key)] ?? null;
          const isThisPhaseExpanded = expandedPhaseKey === phase.key;

          // stopPropagation: only needed while the card is expanded, so the
          // document listener does not collapse it on clicks within the card.
          const phaseCardStopProp = isThisPhaseExpanded
            ? (e: React.MouseEvent) => e.stopPropagation()
            : undefined;

          const phaseViewKey = `phase-${phase.key}`;

          // Single PhaseCard node — rendered in whichever column matches phase.side.
          const phaseCardNode = (
            <Box onClick={phaseCardStopProp}>
              <PhaseCard
                phase={phase}
                columnSide={phase.side}
                {...buildPhaseCardTsxProps(
                  checklist,
                  isDone,
                  isOverdue,
                  overlappingKeys.has(phase.key),
                  overlappingKeys.get(phase.key),
                  anyExpanded,
                  isThisPhaseExpanded,
                  expandableIcon
                )}
                isViewed={effectiveViewedKeys.has(phaseViewKey)}
                onMarkViewed={onMarkViewed ? () => onMarkViewed(phaseViewKey) : undefined}
                onPhasesChange={onPhasesChange}
                allPhases={onPhasesChange ? phases : undefined}
                isExpanded={isThisPhaseExpanded}
                onRequestExpand={() => handleExpandPhaseCard(phase.key)}
              />
            </Box>
          );

          const milestoneCtx: MilestoneRowCtx = {
            phaseKey: phase.key,
            phaseSide: phase.side,
            checklist,
            localMilestoneDone,
            expandedMiIdx,
            anyExpanded,
            dotColor,
            expandableIcon,
            viewedKeys: effectiveViewedKeys,
            onMarkViewed,
            handleToggleMilestone,
            handleExpandMilestone,
            onMeasure: (mi: number, el: HTMLDivElement | null) => {
              // Record the card's collapsed height synchronously during the React
              // commit phase. useLayoutEffect([sorted]) reads these values after all
              // ref callbacks have fired and computes the slot heights once.
              // This callback only fires on mount/unmount — never during
              // expand/collapse or hover — so msSlotHeights remains stable during
              // user interaction.
              if (el) {
                const h = el.offsetHeight;
                if (h > 0) {
                  msHeightMapRef.current[`${String(phase.key)}-${mi}`] = h;
                }
              }
            },
          };

          const rows: ReactNode[] = [];

          // Pre-compute phase <li> minHeight before JSX so phaseLiSx receives a plain value.
          // See inline comments in phaseLiSx (timeline-two-column.styles.ts) for the derivation.
          const phaseMinHeight =
            phaseMilestones.length > 0
              ? (phaseMilestones.length + 1) *
                (yearLabelValue !== null
                  ? Math.max(
                      msSlotHeights[String(phase.key)] ?? milestoneSlotHeight,
                      yearLabelMarginBottom + 80
                    )
                  : Math.max(milestoneSlotHeight, msSlotHeights[String(phase.key)] ?? 0))
              : undefined;

          // ── Phase row ──────────────────────────────────────────────────────
          rows.push(
            <Box key="phase-row" sx={phaseRowSx(anyExpanded && expandedPhaseKey !== phase.key)}>
              {/* Left column — shows cards for phases with side === 'left' */}
              <TimelineColumn
                columnSide="left"
                hasContent={phase.side === 'left'}
                bottomPadding={phaseCardGap}
              >
                {phase.side === 'left' && phaseCardNode}
              </TimelineColumn>

              {/* Centre: phase dot + spine */}
              <Box data-col="center" sx={centerColumnSx}>
                {/* Dot wrapper: relative so the date pill can float above without affecting layout */}
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  {!phase.hideDate && phase.date && (
                    <Typography variant="caption" aria-hidden sx={floatingDatePillSx}>
                      {phase.date}
                    </Typography>
                  )}
                  <Tooltip
                    title={resolvePhaseTooltip(checklist, dotColor, isDone, phase)}
                    placement="top"
                    arrow
                  >
                    <span>
                      <TimelineDot
                        icon={phase.icon}
                        color={dotColor}
                        size="phase"
                        {...buildPhaseDotTsxProps(
                          phase,
                          checklist,
                          isDone,
                          dotAriaLabel,
                          phaseToggleCounts,
                          selectedPhaseKey
                        )}
                        onClick={dotClickAction}
                        onKeyDown={dotKeyDownHandler}
                      />
                    </span>
                  </Tooltip>
                </Box>
                {/* SpineConnector spans the full li height — milestone dots overlay it at % positions */}
                {!isLastPhase && (
                  <SpineConnector
                    dotColor={dotColor}
                    yearMilestone={yearLabelValue}
                    yearLabelMarginBottom={yearLabelMarginBottom}
                  />
                )}
              </Box>

              {/* Right column — shows cards for phases with side === 'right' */}
              <TimelineColumn
                columnSide="right"
                hasContent={phase.side === 'right'}
                bottomPadding={phaseCardGap}
              >
                {phase.side === 'right' && phaseCardNode}
              </TimelineColumn>
            </Box>
          );

          // ── Milestone rows ─────────────────────────────────────────────────
          // Cards are absolutely positioned within their column so expanding one
          // never displaces the spine dots below it.
          phaseMilestones.forEach((ms, mi) => {
            rows.push(buildMilestoneRow(ms, mi, phaseMilestones.length, milestoneCtx));
          });

          return (
            <Box
              key={phase.key}
              component="li"
              data-testid="tl-item"
              sx={phaseLiSx({
                zIndex: expandedMiIdx === null ? 1 : 2,
                computedMinHeight: phaseMinHeight,
              })}
            >
              {rows}
            </Box>
          );
        })}
      </Timeline>
    </Box>
  );
}
