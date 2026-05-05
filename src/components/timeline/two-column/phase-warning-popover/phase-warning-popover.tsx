import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import type { TimelinePhase } from '../types';
import { dateToMonthIndex, monthIndexToDate, resolveOverlaps } from '../utils';
import {
  ganttTrackSx,
  popoverPaperSx,
  sliderRowHeaderSx,
  actionsRowSx,
  ganttBarSx,
} from './phase-warning-popover.styles';

// ----------------------------------------------------------------------

/** Internal representation of a single phase's date range as month indices. */
export type PhaseRange = { startIdx: number; endIdx: number };

/**
 * Resolve a phase's date string to a [startIdx, endIdx] pair.
 *
 * Returns `null` for year-only strings like `~1994` or `2022 – Now` — those
 * are excluded from the slider UI to avoid silently rewriting non-month dates
 * (e.g. converting `~1994` to `Jan 1994` on Apply).
 */
export function parsePhaseRange(phase: TimelinePhase): PhaseRange | null {
  const parts = phase.date.split(/\s*[–-]\s*/u);
  const startIdx = dateToMonthIndex(parts[0] ?? '');
  const endIdx = dateToMonthIndex(parts[parts.length - 1] ?? '');
  if (startIdx === null) return null;
  return { startIdx, endIdx: endIdx ?? startIdx };
}

/**
 * Returns the connected overlap group for `startKey`.
 *
 * Builds a pairwise overlap adjacency graph from phase ranges, then does BFS
 * from `startKey` to collect only the phases that overlap directly or
 * transitively with the triggering phase. Unrelated overlap groups elsewhere
 * on the timeline are excluded.
 */
export function getConnectedOverlapGroup(
  phases: TimelinePhase[],
  startKey: number
): TimelinePhase[] {
  const ranges = phases
    .map((p) => {
      const r = parsePhaseRange(p);
      return r ? { key: p.key, ...r } : null;
    })
    .filter((r): r is { key: number; startIdx: number; endIdx: number } => r !== null);

  const adjacency = new Map<number, Set<number>>();
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const a = ranges[i]!;
      const b = ranges[j]!;
      if (a.startIdx <= b.endIdx && b.startIdx <= a.endIdx) {
        if (!adjacency.has(a.key)) adjacency.set(a.key, new Set());
        if (!adjacency.has(b.key)) adjacency.set(b.key, new Set());
        adjacency.get(a.key)!.add(b.key);
        adjacency.get(b.key)!.add(a.key);
      }
    }
  }

  // BFS from startKey to find the connected component.
  const visited = new Set<number>();
  const queue = [startKey];
  while (queue.length > 0) {
    const key = queue.shift()!;
    if (visited.has(key)) continue;
    visited.add(key);
    adjacency.get(key)?.forEach((neighbor) => {
      if (!visited.has(neighbor)) queue.push(neighbor);
    });
  }

  return phases.filter((p) => visited.has(p.key));
}

/** Compute the shared slider axis bounds from current override values. */
export function computeAxis(overrides: Map<number, PhaseRange>): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  overrides.forEach(({ startIdx, endIdx }) => {
    if (startIdx < min) min = startIdx;
    if (endIdx > max) max = endIdx;
  });
  return {
    min: Number.isFinite(min) ? min - 2 : 0,
    max: Number.isFinite(max) ? max + 2 : 24,
  };
}

/** Returns true when any two ranges in the overrides still overlap. */
export function hasRemainingOverlaps(overrides: Map<number, PhaseRange>): boolean {
  const ranges = Array.from(overrides.values());
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const a = ranges[i]!;
      const b = ranges[j]!;
      if (a.startIdx <= b.endIdx && b.startIdx <= a.endIdx) return true;
    }
  }
  return false;
}

/**
 * Apply current overrides to the conflicting phases, rebuilding their date strings.
 * Returns a new array — does not mutate the input.
 */
export function applyOverrides(
  conflictingPhases: TimelinePhase[],
  overrides: Map<number, PhaseRange>
): TimelinePhase[] {
  return conflictingPhases.map((p) => {
    const override = overrides.get(p.key);
    if (!override) return p;
    const { startIdx, endIdx } = override;
    const newDate =
      startIdx === endIdx
        ? monthIndexToDate(startIdx)
        : `${monthIndexToDate(startIdx)} \u2013 ${monthIndexToDate(endIdx)}`;
    return { ...p, date: newDate };
  });
}

/** Merge updated phases back into the full phases array by phase key. */
export function mergeIntoAll(
  allPhases: TimelinePhase[],
  updated: TimelinePhase[]
): TimelinePhase[] {
  const byKey = new Map(updated.map((p) => [p.key, p]));
  return allPhases.map((p) => byKey.get(p.key) ?? p);
}

/** Resolve phase color to a valid MUI Slider color prop value. */
function resolveSliderColor(
  color: TimelinePhase['color']
): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  if (!color || color === 'inherit' || color === 'grey') return 'primary';
  return color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

// ----------------------------------------------------------------------

/** Mini read-only Gantt ruler showing all conflicting phases on a shared time axis. */
function MiniGanttRuler({
  axis,
  conflictingPhases,
  overrides,
}: {
  axis: { min: number; max: number };
  conflictingPhases: TimelinePhase[];
  overrides: Map<number, PhaseRange>;
}) {
  const span = axis.max - axis.min;
  if (span <= 0) return null;

  const rangeList = Array.from(overrides.entries());

  return (
    <Box aria-hidden sx={ganttTrackSx}>
      {conflictingPhases.map((phase) => {
        const override = overrides.get(phase.key);
        if (!override) return null;
        const leftPct = ((override.startIdx - axis.min) / span) * 100;
        const widthPct = Math.max(1, ((override.endIdx - override.startIdx) / span) * 100);
        const sliderColor = resolveSliderColor(phase.color);

        const isOverlapping = rangeList.some(
          ([otherKey, other]) =>
            otherKey !== phase.key &&
            override.startIdx <= other.endIdx &&
            other.startIdx <= override.endIdx
        );

        return (
          <Box key={phase.key} sx={ganttBarSx(leftPct, widthPct, isOverlapping, sliderColor)} />
        );
      })}
    </Box>
  );
}

// ----------------------------------------------------------------------

export type PhaseWarningPopoverProps = {
  /** Whether the popover is currently open. */
  open: boolean;
  /**
   * DOM element the Popper is anchored to — typically the corner alert badge button.
   * Pass `null` when closed; the popover will not render.
   */
  anchorEl: Element | null;
  /** Called to close the popover without applying changes. */
  onClose: () => void;
  /**
   * The full phases array passed to `TimelineTwoColumn`.
   * Used to compute the conflict group and to merge updated dates on Apply.
   */
  allPhases: TimelinePhase[];
  /**
   * The phase whose corner badge triggered this popover.
   * Used to identify which phases are in the same conflict group.
   */
  currentPhase: TimelinePhase;
  /**
   * Forwarded from `TimelineTwoColumn.onPhasesChange`.
   * Called on Apply with the full updated phases array (dates corrected).
   */
  onPhasesChange: (updated: TimelinePhase[]) => void;
};

/**
 * Rich interactive popover for resolving phase date overlaps.
 *
 * **Design decision — `Popper` + `ClickAwayListener`, not `Tooltip`:**
 * MUI `Tooltip` is display-only — it does not support focus management inside
 * interactive children (sliders, buttons). We use `Popper` + `Paper` so the
 * popover can host the full repair UI (sliders, Gantt ruler, Apply/Cancel).
 *
 * **Opened by:** the `⚠ Date overlap` corner badge on `PhaseCard` — only when
 * `TimelineTwoColumn.onPhasesChange` is provided (controlled mode).
 * In read-only mode (no `onPhasesChange`), the badge stays a plain tooltip.
 *
 * **Conflict group:** all phases detected as overlapping by `detectPhaseOverlaps`.
 * Each gets one range slider. Sliders share a common month-index axis.
 *
 * **State lifecycle:**
 * - `overrides` re-initialises from parsed phase dates every time the popover opens.
 * - "Make sequential" runs `resolveOverlaps` on the current overrides → updates sliders → shows Apply/Cancel.
 * - "Apply" merges overrides into `allPhases` and calls `onPhasesChange`.
 * - "Cancel" resets overrides to the original parsed dates.
 *
 * This component lives in `timeline-two-column/` as an internal sub-component and is
 * not exported from the package barrel.
 */
export function PhaseWarningPopover({
  open,
  anchorEl,
  onClose,
  allPhases,
  currentPhase,
  onPhasesChange,
}: PhaseWarningPopoverProps) {
  // Compute the conflict group: only phases in the same connected overlap cluster
  // as currentPhase. This prevents the popover from showing (or allowing Apply to
  // modify) phases from unrelated overlap groups elsewhere in the timeline.
  const conflictingPhases = useMemo(
    () => getConnectedOverlapGroup(allPhases, currentPhase.key),
    [allPhases, currentPhase.key]
  );

  const [overrides, setOverrides] = useState<Map<number, PhaseRange>>(() => new Map());
  const [pendingApply, setPendingApply] = useState(false);

  // Re-initialise overrides every time the popover opens.
  useEffect(() => {
    if (!open) return;
    const initial = new Map<number, PhaseRange>();
    for (const p of conflictingPhases) {
      const range = parsePhaseRange(p);
      if (range) initial.set(p.key, range);
    }
    setOverrides(initial);
    setPendingApply(false);
  }, [open, conflictingPhases]);

  const axis = useMemo(() => computeAxis(overrides), [overrides]);
  const stillOverlapping = useMemo(() => hasRemainingOverlaps(overrides), [overrides]);

  const handleSliderChange = useCallback((phaseKey: number, value: number | number[]) => {
    if (!Array.isArray(value)) return;
    const [start, end] = value as [number, number];
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(phaseKey, { startIdx: start, endIdx: end });
      return next;
    });
    setPendingApply(false);
  }, []);

  const handleMakeSequential = useCallback(() => {
    const withOverrides = applyOverrides(conflictingPhases, overrides);
    const resolved = resolveOverlaps(withOverrides);
    const next = new Map<number, PhaseRange>();
    for (const p of resolved) {
      const range = parsePhaseRange(p);
      if (range) next.set(p.key, range);
    }
    setOverrides(next);
    setPendingApply(true);
  }, [conflictingPhases, overrides]);

  const handleApply = useCallback(() => {
    const withOverrides = applyOverrides(conflictingPhases, overrides);
    const merged = mergeIntoAll(allPhases, withOverrides);
    onPhasesChange(merged);
    onClose();
  }, [conflictingPhases, overrides, allPhases, onPhasesChange, onClose]);

  const handleCancel = useCallback(() => {
    const initial = new Map<number, PhaseRange>();
    for (const p of conflictingPhases) {
      const range = parsePhaseRange(p);
      if (range) initial.set(p.key, range);
    }
    setOverrides(initial);
    setPendingApply(false);
  }, [conflictingPhases]);

  const warningCount = conflictingPhases.length;

  if (!open || !anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
      sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper elevation={8} sx={popoverPaperSx}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              ⚠ {warningCount} date overlap{warningCount !== 1 ? 's' : ''}
            </Typography>
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Close warning panel"
              sx={{ ml: 'auto' }}
            >
              ×
            </IconButton>
          </Box>

          <Divider />

          {/* Warning list */}
          <Box>
            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
              {`Overlap: ${conflictingPhases.map((p) => p.shortTitle ?? p.title).join(' ↔ ')}`}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {currentPhase.shortTitle ?? currentPhase.title} — adjust sliders or use Make
              sequential.
            </Typography>
          </Box>

          <Divider />

          {/* Range sliders — one per conflicting phase */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {conflictingPhases.map((phase) => {
              const override = overrides.get(phase.key);
              if (!override) return null;
              const sliderColor = resolveSliderColor(phase.color);
              return (
                <Box key={phase.key}>
                  <Box sx={sliderRowHeaderSx}>
                    <Typography variant="caption" fontWeight={600}>
                      {phase.shortTitle ?? phase.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {monthIndexToDate(override.startIdx)} – {monthIndexToDate(override.endIdx)}
                    </Typography>
                  </Box>
                  <Slider
                    value={[override.startIdx, override.endIdx]}
                    min={axis.min}
                    max={axis.max}
                    step={1}
                    color={sliderColor}
                    disableSwap
                    size="small"
                    onChange={(_e, v) => handleSliderChange(phase.key, v)}
                    aria-label={`Date range for ${phase.shortTitle ?? phase.title}`}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Mini Gantt ruler */}
          <MiniGanttRuler axis={axis} conflictingPhases={conflictingPhases} overrides={overrides} />

          <Divider />

          {/* Actions */}
          <Box sx={actionsRowSx}>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              disabled={!stillOverlapping}
              onClick={handleMakeSequential}
            >
              Make sequential
            </Button>

            {pendingApply && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={handleApply}
                  aria-label="Apply date changes"
                >
                  Apply
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCancel}
                  aria-label="Cancel date changes"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
