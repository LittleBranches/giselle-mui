import type { TimelinePhase } from '../types';
import type { PhaseRange } from './types';
import { dateToMonthIndex, monthIndexToDate } from '../utils';

// ----------------------------------------------------------------------

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
export function resolveSliderColor(
  color: TimelinePhase['color']
): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  if (!color || color === 'inherit' || color === 'grey') return 'primary';
  return color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}
