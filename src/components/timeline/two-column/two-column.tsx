import type { TimelineTwoColumnProps, MilestoneRowCtx } from './types';

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

import { PhaseCard } from './phase-card';
import { MilestoneRow } from './milestone-row';
import { MarkerRow } from './marker-row';
import { PhaseRow } from './phase-row';
import {
  detectPhaseOverlaps,
  sortMilestonesAsc,
  sortMilestonesDesc,
  sortPhasesByDate,
  resolvePhaseState,
  resolvePhaseDotHandlers,
  buildPhaseCardTsxProps,
  computeSlotHeights,
} from './utils';
import { phaseLiSx, timelineRootSx } from './two-column.styles';

// ----------------------------------------------------------------------

// Stable empty Set — returned when `viewedKeys` prop is undefined so callers
// always get the same reference and avoid creating a new Set on every render.
const EMPTY_VIEWED_KEYS = new Set<string>();

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
  onToggleTaskDone,
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
    const sortFn = sortOrder === 'asc' ? sortMilestonesAsc : sortMilestonesDesc;
    const m: Record<string, boolean> = {};
    phases.forEach((p) => {
      const sortedMs = p.milestones ? sortFn([...p.milestones]) : [];
      sortedMs.forEach((ms, i) => {
        m[`${p.key}-${i}`] = ms.done ?? false;
      });
    });
    return m;
  });

  // Task-level done state — always active (not gated on checklist mode).
  // Key format: `${phaseKey}-m${milestoneIdx}-t${taskIdx}` for milestone tasks,
  //             `${phaseKey}-t${taskIdx}` for phase-level tasks.
  const [localTaskDoneMap, setLocalTaskDoneMap] = useState<Record<string, boolean>>(() => {
    const sortFn = sortOrder === 'asc' ? sortMilestonesAsc : sortMilestonesDesc;
    const t: Record<string, boolean> = {};
    phases.forEach((p) => {
      p.children?.forEach((task, ti) => {
        t[`${p.key}-t${ti}`] = task.done ?? false;
      });
      const sortedMs = p.milestones ? sortFn([...p.milestones]) : [];
      sortedMs.forEach((ms, mi) => {
        ms.children?.forEach((task, ti) => {
          t[`${p.key}-m${mi}-t${ti}`] = task.done ?? false;
        });
      });
    });
    return t;
  });

  // Sync done state when the phases prop identity or sort order changes.
  // IMPORTANT: milestone indices must match the render order (sorted), not the original
  // data order. `localMilestoneDone` and `localTaskDoneMap` are keyed by
  // `${phaseKey}-${sortedMilestoneIndex}` — the same index `mi` used in buildMilestoneRow.
  // Using original (unsorted) indices causes done-state inversion whenever the sort
  // moves done milestones (earlier dates) below not-done milestones (later dates).
  useEffect(() => {
    const sortFn = sortOrder === 'asc' ? sortMilestonesAsc : sortMilestonesDesc;
    setLocalPhaseDone(Object.fromEntries(phases.map((p) => [String(p.key), p.done ?? false])));
    const m: Record<string, boolean> = {};
    phases.forEach((p) => {
      const sortedMs = p.milestones ? sortFn([...p.milestones]) : [];
      sortedMs.forEach((ms, i) => {
        m[`${p.key}-${i}`] = ms.done ?? false;
      });
    });
    setLocalMilestoneDone(m);
    const t: Record<string, boolean> = {};
    phases.forEach((p) => {
      p.children?.forEach((task, ti) => {
        t[`${p.key}-t${ti}`] = task.done ?? false;
      });
      const sortedMs = p.milestones ? sortFn([...p.milestones]) : [];
      sortedMs.forEach((ms, mi) => {
        ms.children?.forEach((task, ti) => {
          t[`${p.key}-m${mi}-t${ti}`] = task.done ?? false;
        });
      });
    });
    setLocalTaskDoneMap(t);
  }, [phases, sortOrder]);

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

  // Stable stop-propagation handler — used by ALL card wrappers (phase and milestone).
  // This prevents the document "close all" listener from firing on card clicks,
  // which would otherwise race with and cancel the card's own expand/collapse state update.
  // Cards that are NOT clicked still close because handleExpandPhaseCard / handleExpandMilestone
  // sets the new open key, implicitly closing all others via controlled state.
  // Clicking genuinely outside a card (no card wrapper intercepts) still reaches the document
  // handler and closes everything, which is the correct "click away to close" behaviour.
  const stopCardPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

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

      // Bidirectional parent-child sync:
      //   All milestones done  → parent phase automatically becomes done.
      //   Any milestone undone → parent phase automatically becomes not-done.
      // Both directions fire regardless of whether the phase was manually toggled.
      const phase = phases.find((p) => p.key === phaseKey);
      if (phase?.milestones?.length) {
        const allDone = phase.milestones.every((_, i) => updated[`${phaseKey}-${i}`] ?? false);
        const currentPhaseDone = localPhaseDone[String(phaseKey)] ?? false;
        if (allDone !== currentPhaseDone) {
          setPhaseToggleCounts((prev) => ({
            ...prev,
            [String(phaseKey)]: (prev[String(phaseKey)] ?? 0) + 1,
          }));
          setLocalPhaseDone((prev) => ({ ...prev, [String(phaseKey)]: allDone }));
          onTogglePhaseDone?.(phaseKey, allDone);
        }
      }
    },
    [localMilestoneDone, phases, localPhaseDone, onToggleMilestoneDone, onTogglePhaseDone]
  );

  const handleToggleTask = useCallback(
    (phaseKey: number, milestoneIdx: number | null, taskIdx: number) => {
      const k =
        milestoneIdx !== null
          ? `${phaseKey}-m${milestoneIdx}-t${taskIdx}`
          : `${phaseKey}-t${taskIdx}`;
      const next = !(localTaskDoneMap[k] ?? false);
      const updated = { ...localTaskDoneMap, [k]: next };
      setLocalTaskDoneMap(updated);
      onToggleTaskDone?.(phaseKey, milestoneIdx, taskIdx, next);

      // Bidirectional sync: when all tasks for a milestone are done → auto-mark milestone done.
      // Only fires in checklist mode (milestone dots need to be checkable for this to make sense).
      if (milestoneIdx !== null && checklist) {
        const phase = phases.find((p) => p.key === phaseKey);
        const ms = phase?.milestones?.[milestoneIdx];
        if (ms?.children?.length) {
          const allTasksDone = ms.children.every(
            (_, ti) => updated[`${phaseKey}-m${milestoneIdx}-t${ti}`] ?? false
          );
          const currentMsDone = localMilestoneDone[`${phaseKey}-${milestoneIdx}`] ?? false;
          if (allTasksDone !== currentMsDone) {
            const msUpdated = {
              ...localMilestoneDone,
              [`${phaseKey}-${milestoneIdx}`]: allTasksDone,
            };
            setLocalMilestoneDone(msUpdated);
            onToggleMilestoneDone?.(phaseKey, milestoneIdx, allTasksDone);
            // Cascade to phase if all milestones are now done.
            if (phase?.milestones?.length) {
              const allMsDone = phase.milestones.every(
                (_, i) => msUpdated[`${phaseKey}-${i}`] ?? false
              );
              const currentPhaseDone = localPhaseDone[String(phaseKey)] ?? false;
              if (allMsDone !== currentPhaseDone) {
                setPhaseToggleCounts((prev) => ({
                  ...prev,
                  [String(phaseKey)]: (prev[String(phaseKey)] ?? 0) + 1,
                }));
                setLocalPhaseDone((prev) => ({ ...prev, [String(phaseKey)]: allMsDone }));
                onTogglePhaseDone?.(phaseKey, allMsDone);
              }
            }
          }
        }
      }
    },
    [
      localTaskDoneMap,
      localMilestoneDone,
      localPhaseDone,
      phases,
      checklist,
      onToggleTaskDone,
      onToggleMilestoneDone,
      onTogglePhaseDone,
    ]
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
            return (
              <MarkerRow
                key={phase.key}
                phase={phase}
                isLastPhase={isLastPhase}
                dotColor={dotColor}
                isDone={isDone}
                checklist={checklist}
                yearLabelValue={yearLabelValue}
              />
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

          const phaseViewKey = `phase-${phase.key}`;

          // Single PhaseCard node — rendered in whichever column matches phase.side.
          // stopCardPropagation is always active — prevents the document "close all" handler
          // from racing with this card's own expand/collapse state update on every click.
          const phaseCardNode = (
            <Box onClick={stopCardPropagation}>
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
                taskDoneStates={phase.children?.map(
                  (task, ti) => localTaskDoneMap[`${phase.key}-t${ti}`] ?? task.done ?? false
                )}
                onToggleTask={(taskIdx, _done) => handleToggleTask(phase.key, null, taskIdx)}
              />
            </Box>
          );

          const milestoneCtx: MilestoneRowCtx = {
            phaseKey: phase.key,
            phaseSide: phase.side,
            checklist,
            localMilestoneDone,
            localTaskDoneMap,
            expandedMiIdx,
            anyExpanded,
            dotColor,
            expandableIcon,
            viewedKeys: effectiveViewedKeys,
            onMarkViewed,
            handleToggleMilestone,
            handleToggleTask,
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
            <PhaseRow
              key="phase-row"
              phase={phase}
              isSuppressed={anyExpanded && expandedPhaseKey !== phase.key}
              phaseCardGap={phaseCardGap}
              phaseCardNode={phaseCardNode}
              dotColor={dotColor}
              isDone={isDone}
              isLastPhase={isLastPhase}
              yearLabelValue={yearLabelValue}
              yearLabelMarginBottom={yearLabelMarginBottom}
              checklist={checklist}
              dotClickAction={dotClickAction}
              dotKeyDownHandler={dotKeyDownHandler}
              dotAriaLabel={dotAriaLabel}
              phaseToggleCounts={phaseToggleCounts}
              selectedPhaseKey={selectedPhaseKey}
            />
          );

          // ── Milestone rows ─────────────────────────────────────────────────
          // Cards are absolutely positioned within their column so expanding one
          // never displaces the spine dots below it.
          phaseMilestones.forEach((ms, mi) => {
            rows.push(
              <MilestoneRow
                key={`ms-row-${mi}`}
                ms={ms}
                mi={mi}
                totalMilestones={phaseMilestones.length}
                ctx={milestoneCtx}
              />
            );
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
