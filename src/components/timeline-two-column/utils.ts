// Pure helpers co-located with the component.
// No JSX. No MUI imports. Fully unit-testable in isolation.

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
