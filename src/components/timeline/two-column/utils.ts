// Pure helpers co-located with the component.
// No JSX. No MUI imports. Fully unit-testable in isolation.

import type * as React from 'react';
import type {
  TimelinePhase,
  HighlightedPaletteKey,
  Milestone,
  PhaseStateProps,
  PhaseDotHandlers,
  MilestoneDotHandlers,
  Task,
} from './types';

// ----------------------------------------------------------------------

/** Extracts the last 4-digit year from a date string. Returns null if none found. */
export function getLastYear(date: string): number | null {
  const re = /\b(20\d{2}|19\d{2})\b/g;
  let last: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(date)) !== null) last = m;
  return last ? Number.parseInt(last[1]!, 10) : null;
}

export const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

/** Reverse of MONTH_INDEX — 0-based index to 3-letter abbreviated month name. */
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Parses the last date expression found in a date range string.
 *
 * Range strings like "Apr 2026 – 29 Jun 2026" return the END date so that
 * overdue detection only triggers once the entire range has passed.
 *
 * For month-only partial dates (e.g. "Apr 2026") returns the last day of that
 * month so the phase is only overdue once the whole month has elapsed.
 */
export function parseLastDate(dateStr: string): Date | null {
  // Broad pattern — month validity and year range are checked in JS below.
  // Avoids a 12-way month alternation + 2-way year alternation in the regex.
  const re = /\b(\d\d?)?\s*([a-z]+)\s*(\d{4})\b/gi;
  let lastMatch: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(dateStr)) !== null) {
    const year = Number.parseInt(m[3]!, 10);
    if (!(m[2]!.slice(0, 3).toLowerCase() in MONTH_INDEX) || year < 1900 || year > 2099) continue;
    lastMatch = m;
  }
  if (!lastMatch) return null;
  const hasDay = Boolean(lastMatch[1]);
  const month = MONTH_INDEX[lastMatch[2]!.slice(0, 3).toLowerCase()];
  const year = Number.parseInt(lastMatch[3]!, 10);
  if (!hasDay) {
    // last day of that month
    return new Date(year, month! + 1, 0);
  }
  return new Date(year, month!, Number.parseInt(lastMatch[1]!, 10));
}

// ----------------------------------------------------------------------

/**
 * Returns a millisecond timestamp suitable for chronological sorting.
 *
 * Strategy (most-precise to least):
 * 1. `parseLastDate` — extracts a specific day/month/year (or end of a range).
 * 2. `getLastYear` — year-only strings like `'~1994'` or `'2015 – present'`.
 *    These map to Jan 1 of that year so they sort before finer-grained dates in the same year.
 * 3. null — no date found; caller decides how to handle (sort to end).
 */
export function parseSortableDate(dateStr: string): number | null {
  const precise = parseLastDate(dateStr);
  if (precise !== null) return precise.getTime();
  const year = getLastYear(dateStr);
  if (year !== null) return new Date(year, 0, 1).getTime();
  return null;
}

// ----------------------------------------------------------------------

/** Minimal subset of TimelinePhase needed for chronological sorting. */
type SortablePhase = {
  date: string;
  key: number;
  active?: boolean;
  done?: boolean;
  title?: string;
};

/**
 * Returns a new array sorted by date.
 *
 * Rules (desc — career/past timelines):
 * - `active` phases are pinned first (current job always at top).
 * - All other phases sorted newest end-date first (`done` phases sort by date, not pinned).
 *
 * Rules (asc — roadmap/future timelines):
 * - No pinning — `active` and `done` only control visual treatment (badge, pulsing dot, dimming).
 * - All phases sorted strictly by end-date ascending (earliest first).
 *
 * Rules (key — sort by phase.key ascending):
 * - Sorts strictly by `key` field, ignoring dates entirely.
 * - Use when the key encodes the intended sequence (e.g. a roadmap where
 *   phase numbers overlap in date but the phase number is the ordering criterion).
 * - Deterministic regardless of array insertion order.
 *
 * Ties (same millisecond) fall back to ascending key order in asc mode, descending in desc.
 */
export function sortPhasesByDate<T extends SortablePhase>(
  phases: T[],
  sortOrder: 'asc' | 'desc' | 'key' = 'desc'
): T[] {
  if (sortOrder === 'key') return [...phases].sort((a, b) => a.key - b.key);
  const dir = sortOrder === 'asc' ? 1 : -1;
  return [...phases].sort((a, b) => {
    // desc only: pin active phases first (career timeline — current job at top).
    if (sortOrder === 'desc') {
      if (a.active && b.active) return b.key - a.key;
      if (a.active) return -1;
      if (b.active) return 1;
    }
    // Sort by date in requested direction (done phases sort by date, not pinned).
    const da = parseSortableDate(a.date);
    const db = parseSortableDate(b.date);
    if (da === null && db === null) return dir * (a.key - b.key);
    if (da === null) return 1; // undated → last
    if (db === null) return -1; // undated → last
    if (db !== da) return dir * (da - db); // asc: earlier first; desc: newer first
    return dir * (a.key - b.key); // tie-break
  });
}

// ----------------------------------------------------------------------

/** Minimal subset of a milestone needed for chronological sorting. */
type SortableMilestone = { date?: string };

/**
 * Returns a new array of milestones sorted by date ascending (earliest first).
 * Milestones without a parseable date sort to the end.
 */
export function sortMilestonesAsc<T extends SortableMilestone>(milestones: T[]): T[] {
  return [...milestones].sort((a, b) => {
    const da = a.date ? parseSortableDate(a.date) : null;
    const db = b.date ? parseSortableDate(b.date) : null;
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });
}

/**
 * Returns a new array of milestones sorted by date descending (latest first).
 * Milestones without a parseable date sort to the end.
 */
export function sortMilestonesDesc<T extends SortableMilestone>(milestones: T[]): T[] {
  return [...milestones].sort((a, b) => {
    const da = a.date ? parseSortableDate(a.date) : null;
    const db = b.date ? parseSortableDate(b.date) : null;
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return db - da;
  });
}

// ----------------------------------------------------------------------

/**
 * Parses the FIRST "Month YYYY" token in a date string.
 * For ranges like "Jul 2025 – Mar 2026" this returns the start (Jul 1 2025).
 * Returns the first day of the month, or Jan 1 for year-only strings, or null.
 */
export function parseFirstDate(dateStr: string): number | null {
  const normalized = dateStr.trim().toLowerCase();
  const re = /\b(\d\d?)?\s*([a-z]+)\s*(\d{4})\b/i;
  const m = re.exec(normalized);
  if (m) {
    const year = Number.parseInt(m[3]!, 10);
    const monthKey = m[2]!.slice(0, 3).toLowerCase();
    const month = MONTH_INDEX[monthKey];
    if (month !== undefined && year >= 1900 && year <= 2099) {
      const day = m[1] ? Number.parseInt(m[1], 10) : 1;
      return new Date(year, month, day).getTime();
    }
  }
  // Fall back: first 4-digit year → Jan 1 of that year.
  const yearRe = /\b(20\d{2}|19\d{2})\b/;
  const ym = yearRe.exec(normalized);
  if (ym) return new Date(Number.parseInt(ym[1]!, 10), 0, 1).getTime();
  return null;
}

/**
 * Detects phases whose date ranges overlap with any other phase in the array.
 * Returns a Map where each key is a phase `key` and the value is a human-readable
 * explanation naming the phases it overlaps with and their date ranges.
 *
 * Two ranges [s1, e1] and [s2, e2] overlap when: s1 ≤ e2 AND s2 ≤ e1.
 * Phases with unparseable dates are ignored (can't detect overlap without a range).
 */
export function detectPhaseOverlaps<T extends SortablePhase>(phases: T[]): Map<number, string> {
  const overlapping = new Map<number, string[]>();
  const ranges = phases
    .map((p) => ({
      key: p.key,
      label: `${p.title ?? String(p.key)} (${p.date})`,
      start: parseFirstDate(p.date),
      end: parseSortableDate(p.date),
    }))
    .filter(
      (r): r is { key: number; label: string; start: number; end: number } =>
        r.start !== null && r.end !== null
    );
  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      const a = ranges[i]!;
      const b = ranges[j]!;
      if (a.start <= b.end && b.start <= a.end) {
        if (!overlapping.has(a.key)) overlapping.set(a.key, []);
        if (!overlapping.has(b.key)) overlapping.set(b.key, []);
        overlapping.get(a.key)!.push(b.label);
        overlapping.get(b.key)!.push(a.label);
      }
    }
  }
  const result = new Map<number, string>();
  overlapping.forEach((others, key) => {
    result.set(key, `Date overlap with: ${others.join('; ')}`);
  });
  return result;
}

// ----------------------------------------------------------------------

/**
 * Converts the first "Mon YYYY" token in a date string to a linear month index.
 *
 * The index is `year × 12 + month` (0-based month):
 * - Jan 2000 → 24000
 * - Apr 2025 → 24303
 *
 * Returns null if no parseable month + year token is found.
 */
export function dateToMonthIndex(dateStr: string): number | null {
  const re = /\b([a-z]+)\s*(\d{4})\b/i;
  const m = re.exec(dateStr.trim());
  if (!m) return null;
  const monthKey = m[1]!.slice(0, 3).toLowerCase();
  const month = MONTH_INDEX[monthKey];
  const year = Number.parseInt(m[2]!, 10);
  if (month === undefined || year < 1900 || year > 2099) return null;
  return year * 12 + month;
}

/**
 * Converts a linear month index back to a "Mon YYYY" date string.
 *
 * ```ts
 * monthIndexToDate(24303) // → 'Apr 2025'
 * ```
 */
export function monthIndexToDate(index: number): string {
  const year = Math.floor(index / 12);
  const month = index % 12;
  return `${MONTH_NAMES[month]} ${year}`;
}

// ----------------------------------------------------------------------

/**
 * Returns a new array of phases with date ranges adjusted so no phases overlap.
 *
 * Algorithm:
 * 1. Sort phases by start date ascending.
 * 2. Walk through sorted phases; if a phase starts on or before the previous
 *    phase ends, shift it forward: new start = prev end + 1 month (duration
 *    preserved — the phase is never compressed).
 * 3. Phases with unparseable dates are returned unchanged at the end.
 *
 * This is a pure function — it does not mutate the input array or any phase objects.
 */
export function resolveOverlaps<T extends SortablePhase>(phases: T[]): T[] {
  type Indexed = { phase: T; startIdx: number; endIdx: number; duration: number };
  const parseable: Indexed[] = [];
  const unparseable: T[] = [];

  for (const phase of phases) {
    const startMs = parseFirstDate(phase.date);
    const endMs = parseSortableDate(phase.date);
    if (startMs === null || endMs === null) {
      unparseable.push(phase);
      continue;
    }
    const startDate = new Date(startMs);
    const endDate = new Date(endMs);
    const startIdx = startDate.getFullYear() * 12 + startDate.getMonth();
    const endIdx = endDate.getFullYear() * 12 + endDate.getMonth();
    parseable.push({ phase, startIdx, endIdx, duration: endIdx - startIdx });
  }

  // Sort by start date ascending; tie-break by key.
  parseable.sort((a, b) => a.startIdx - b.startIdx || a.phase.key - b.phase.key);

  // Shift any phase that overlaps the previous phase forward.
  for (let i = 1; i < parseable.length; i++) {
    const prev = parseable[i - 1]!;
    const curr = parseable[i]!;
    if (curr.startIdx <= prev.endIdx) {
      curr.startIdx = prev.endIdx + 1;
      curr.endIdx = curr.startIdx + curr.duration;
    }
  }

  // Rebuild phases with updated date strings.
  const resolved = parseable.map(({ phase, startIdx, endIdx, duration }) => {
    const newDate =
      duration === 0
        ? monthIndexToDate(startIdx)
        : `${monthIndexToDate(startIdx)} \u2013 ${monthIndexToDate(endIdx)}`;
    return { ...phase, date: newDate } as T;
  });

  return [...resolved, ...unparseable];
}

// ── Phase / milestone state-resolution helpers ────────────────────────────
// Extracted from timeline-two-column.tsx so they can be unit-tested in
// isolation and reused by future timeline variants (roadmap, etc.)

/** @internal Returns true when a phase is past-due in checklist mode. */
function resolvePhaseOverdue(
  phase: TimelinePhase,
  checklist: boolean,
  isDone: boolean,
  today: Date
): boolean {
  if (!checklist || isDone) return false;
  const parsedDate = parseLastDate(phase.date);
  // Active phases can still be overdue (e.g. roadmap phase still in progress but past its end date).
  const isAutoOverdue = parsedDate !== null && parsedDate < today;
  return (phase.overdue ?? false) || isAutoOverdue;
}

/** Resolves display-state derived values for a single phase row. */
export function resolvePhaseState(
  phase: TimelinePhase,
  index: number,
  sorted: TimelinePhase[],
  lastKey: number | undefined,
  checklist: boolean,
  localPhaseDone: Record<string, boolean>,
  today: Date
): PhaseStateProps {
  const isDone = checklist ? (localPhaseDone[String(phase.key)] ?? false) : (phase.done ?? false);
  const isOverdue = resolvePhaseOverdue(phase, checklist, isDone, today);
  const colorFromData =
    phase.color && phase.color !== 'inherit' && phase.color !== 'grey'
      ? (phase.color as HighlightedPaletteKey)
      : null;
  const baseDotColor: HighlightedPaletteKey =
    colorFromData ?? (phase.side === 'left' ? 'secondary' : 'primary');
  const dotColor: HighlightedPaletteKey = isOverdue ? 'error' : baseDotColor;
  const nextPhase = sorted[index + 1];
  const thisYear = getLastYear(phase.date);
  const nextYear = nextPhase ? getLastYear(nextPhase.date) : null;
  const yearLabelValue =
    nextYear !== null && thisYear !== null && nextYear < thisYear ? String(nextYear) : null;
  return {
    isDone,
    isOverdue,
    dotColor,
    yearLabelValue,
    phaseMilestones: phase.milestones ?? [],
    isLastPhase: phase.key === lastKey,
  };
}

/** Resolves click/keyboard handlers and ARIA label for a phase dot. */
export function resolvePhaseDotHandlers(
  phase: TimelinePhase,
  isDone: boolean,
  checklist: boolean,
  handleTogglePhase: (key: number) => void,
  onPhaseSelect: ((key: number) => void) | undefined
): PhaseDotHandlers {
  const dotActionLabel = isDone ? 'Unmark' : 'Mark';
  let dotAriaLabel: string | undefined;
  if (checklist) {
    dotAriaLabel = `${dotActionLabel} "${phase.title}" as done`;
  } else if (onPhaseSelect) {
    dotAriaLabel = `Select "${phase.title}"`;
  }
  let dotClickAction: (() => void) | undefined;
  if (checklist) {
    dotClickAction = () => handleTogglePhase(phase.key);
  } else if (onPhaseSelect) {
    dotClickAction = () => onPhaseSelect(phase.key);
  }
  const dotKeyDownHandler = dotClickAction
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dotClickAction();
        }
      }
    : undefined;
  return { dotClickAction, dotKeyDownHandler, dotAriaLabel };
}

/** Resolves the JSX prop bag for the phase-row PhaseCard. */
export function buildPhaseCardTsxProps(
  checklist: boolean,
  isDone: boolean,
  isOverdue: boolean,
  dateConflict: boolean,
  dateConflictLabel: string | undefined,
  anyExpanded: boolean,
  isThisPhaseExpanded: boolean,
  expandableIcon: React.ReactNode
) {
  return {
    done: isDone,
    overdue: checklist ? isOverdue : undefined,
    dateConflict: dateConflict || undefined,
    dateConflictLabel,
    suppressElevation: anyExpanded && !isThisPhaseExpanded,
    expandableIcon,
  };
}

/** @internal Returns the tooltip status label based on dot colour and done state. */
function dotStatusLabel(
  color: HighlightedPaletteKey,
  done: boolean,
  date: string | undefined
): string {
  let status: string;
  if (done) {
    status = 'Done';
  } else if (color === 'error') {
    status = 'Blocking';
  } else if (color === 'warning') {
    status = 'In progress';
  } else if (color === 'success') {
    status = 'Planned';
  } else {
    status = 'Upcoming';
  }
  return date ? `${status} · ${date}` : status;
}

/**
 * Returns the first sentence of a description, capped at `maxLen` characters.
 *
 * Used to populate dot tooltips in read-only mode with contextual information
 * that is NOT already visible in any card state (title + date are on the card).
 *
 * @internal — exported for unit tests only. Not part of the public API.
 */
export function truncateDescription(s: string, maxLen = 72): string {
  const parts = s.split(/[.!?](?=\s|$)/);
  const firstSentence = (parts[0] ?? '').trim();
  const text = firstSentence.length > 0 ? firstSentence : s;
  return text.length <= maxLen ? text : `${text.slice(0, maxLen).trimEnd()}…`;
}

/**
 * Resolves the tooltip label for a phase dot.
 *
 * - Checklist mode: shows status label + date.
 * - Read-only mode: shows the **description preview** — not visible in any collapsed card.
 * - `phase.dotTooltip` always wins if provided.
 *
 * @internal — exported for unit tests only. Not part of the public API.
 */
export function resolvePhaseTooltip(
  checklist: boolean,
  color: HighlightedPaletteKey,
  done: boolean,
  phase: TimelinePhase
): string {
  if (phase.dotTooltip != null) return phase.dotTooltip;
  if (checklist) return dotStatusLabel(color, done, phase.date);
  if (phase.description) return truncateDescription(phase.description);
  const label = phase.shortTitle ?? phase.title;
  return phase.date ? `${label} · ${phase.date}` : label;
}

/**
 * Resolves the tooltip label for a milestone dot.
 *
 * - Checklist mode: shows status label + date.
 * - Read-only mode: shows the **description preview** — not visible without expanding the card.
 * - `ms.dotTooltip` always wins if provided.
 *
 * @internal — exported for unit tests only. Not part of the public API.
 */
export function resolveMilestoneTooltip(
  checklist: boolean,
  color: HighlightedPaletteKey,
  done: boolean,
  ms: Milestone
): string {
  if (ms.dotTooltip != null) return ms.dotTooltip;
  if (checklist) return dotStatusLabel(color, done, ms.date);
  if (ms.description) return truncateDescription(ms.description);
  const label = ms.shortTitle ?? ms.title;
  return ms.date ? `${label} · ${ms.date}` : label;
}

/** Resolves the JSX prop bag for the phase-row TimelineDot. */
export function buildPhaseDotTsxProps(
  phase: TimelinePhase,
  checklist: boolean,
  isDone: boolean,
  dotAriaLabel: string | undefined,
  phaseToggleCounts: Record<string, number>,
  selectedPhaseKey: number | undefined
) {
  let role: 'checkbox' | 'button' | undefined;
  if (checklist) {
    role = 'checkbox';
  } else if (dotAriaLabel) {
    role = 'button';
  }
  return {
    active: (phase.active ?? false) || (!checklist && phase.key === selectedPhaseKey),
    animationKey: phaseToggleCounts[String(phase.key)] ?? 0,
    done: isDone,
    role,
    'aria-checked': checklist ? isDone : undefined,
    'aria-label': dotAriaLabel,
    tabIndex: checklist || dotAriaLabel ? 0 : undefined,
  };
}

/** Resolves done state and effective colour for a milestone in checklist mode. */
export function resolveMilestoneState(
  ms: Milestone,
  mi: number,
  phaseKey: number,
  dotColor: HighlightedPaletteKey,
  checklist: boolean,
  localMilestoneDone: Record<string, boolean>
): { msDone: boolean; msColor: HighlightedPaletteKey } {
  const msDoneKey = `${phaseKey}-${mi}`;
  const msDone = checklist
    ? (localMilestoneDone[msDoneKey] ?? ms.done ?? false)
    : (ms.done ?? false);
  const msIsOverdue = checklist && (ms.overdue ?? false) && !msDone;
  const msColorFromData =
    ms.color && ms.color !== 'inherit' && ms.color !== 'grey'
      ? (ms.color as HighlightedPaletteKey)
      : dotColor;
  let msColor: HighlightedPaletteKey;
  if (msDone) {
    msColor = 'success';
  } else if (msIsOverdue) {
    msColor = 'error';
  } else {
    msColor = msColorFromData;
  }
  return { msDone, msColor };
}

/** Resolves click/keyboard handlers and ARIA label for a milestone dot. */
export function resolveMilestoneDotHandlers(
  ms: Milestone,
  mi: number,
  phaseKey: number,
  msDone: boolean,
  checklist: boolean,
  handleToggleMilestone: (phaseKey: number, mi: number) => void
): MilestoneDotHandlers {
  const msDotActionLabel = msDone ? 'Unmark' : 'Mark';
  const msDotAriaLabel = checklist ? `${msDotActionLabel} "${ms.title}" as done` : undefined;
  const msDotClickAction = checklist ? () => handleToggleMilestone(phaseKey, mi) : undefined;
  const msDotKeyDown = msDotClickAction
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          msDotClickAction();
        }
      }
    : undefined;
  return { msDotClickAction, msDotKeyDown, msDotAriaLabel };
}

/**
 * Computes the `msSlotHeights` record from the measured card-height map.
 *
 * For each phase that has milestones, finds the tallest measured card and returns
 * `maxCardHeight + 16` as the slot height. The 16px gap provides breathing room
 * between vertically stacked milestone badges.
 *
 * DESIGN INVARIANT — pure function of its two inputs. No expand/collapse/hover state.
 * See the architectural comment on `msHeightMapRef` in `TimelineTwoColumn`.
 *
 * @internal — exported for unit tests only. Not part of the public API.
 */
export function computeSlotHeights(
  phases: TimelinePhase[],
  heightMap: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {};
  phases.forEach((phase) => {
    const n = phase.milestones?.length ?? 0;
    if (n === 0) return;
    let maxH = 0;
    for (let i = 0; i < n; i++) {
      const h = heightMap[`${String(phase.key)}-${i}`] ?? 0;
      if (h > maxH) maxH = h;
    }
    if (maxH > 0) {
      result[String(phase.key)] = maxH + 16;
    }
  });
  return result;
}

/**
 * Resolves task children for a phase or milestone.
 *
 * Resolution order:
 * 1. `item.children` — new structured form (preferred)
 * 2. `item.details` — legacy flat string array, mapped to `{ title }` shims
 * 3. Empty array
 *
 * Generic overload works for both `TimelinePhase` and `Milestone`.
 *
 * @internal — exported for unit tests only. Not part of the public API.
 */
export function resolveTaskChildren(item: { children?: Task[]; details?: string[] }): Task[] {
  if (item.children && item.children.length > 0) return item.children;
  if (item.details && item.details.length > 0) return item.details.map((title) => ({ title }));
  return [];
}
