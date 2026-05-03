// @vitest-environment jsdom
import { it, expect, describe } from 'vitest';

import {
  MONTH_INDEX,
  getLastYear,
  parseLastDate,
  sortPhasesByDate,
  parseSortableDate,
  parseFirstDate,
  detectPhaseOverlaps,
  sortMilestonesAsc,
  sortMilestonesDesc,
} from './utils';

// ----------------------------------------------------------------------

describe('getLastYear', () => {
  it('returns null for an empty string', () => {
    expect(getLastYear('')).toBeNull();
  });

  it('returns null when no year is present', () => {
    expect(getLastYear('present')).toBeNull();
    expect(getLastYear('Unknown')).toBeNull();
  });

  it('extracts a year even when prefixed with a tilde (~1992 → 1992)', () => {
    // ~1992 contains the 4-digit year 1992 — `\b` matches after `~`
    expect(getLastYear('~1992')).toBe(1992);
  });

  it('returns the single year when only one is present', () => {
    expect(getLastYear('2005')).toBe(2005);
    expect(getLastYear('2015 – present')).toBe(2015);
    expect(getLastYear('Started in 1999')).toBe(1999);
  });

  it('returns the LAST year when a range is given', () => {
    expect(getLastYear('2005 – 2006')).toBe(2006);
    expect(getLastYear('Jan 2020 – Dec 2023')).toBe(2023);
    expect(getLastYear('1990 – 2000 – 2010')).toBe(2010);
  });

  it('ignores 3-digit and 5-digit numbers', () => {
    expect(getLastYear('year 123 and 20000')).toBeNull();
  });

  it('handles years in full sentences', () => {
    expect(getLastYear('Moved to Melbourne in 2015 and stayed')).toBe(2015);
  });
});

// ----------------------------------------------------------------------

describe('MONTH_INDEX', () => {
  it('maps all 12 abbreviated month keys to correct 0-based indices', () => {
    expect(MONTH_INDEX['jan']).toBe(0);
    expect(MONTH_INDEX['feb']).toBe(1);
    expect(MONTH_INDEX['mar']).toBe(2);
    expect(MONTH_INDEX['apr']).toBe(3);
    expect(MONTH_INDEX['may']).toBe(4);
    expect(MONTH_INDEX['jun']).toBe(5);
    expect(MONTH_INDEX['jul']).toBe(6);
    expect(MONTH_INDEX['aug']).toBe(7);
    expect(MONTH_INDEX['sep']).toBe(8);
    expect(MONTH_INDEX['oct']).toBe(9);
    expect(MONTH_INDEX['nov']).toBe(10);
    expect(MONTH_INDEX['dec']).toBe(11);
  });
});

// ----------------------------------------------------------------------

describe('parseLastDate', () => {
  it('returns null for strings with no recognisable date', () => {
    expect(parseLastDate('')).toBeNull();
    expect(parseLastDate('~1992')).toBeNull();
    expect(parseLastDate('2005 – 2006')).toBeNull();
    expect(parseLastDate('present')).toBeNull();
  });

  it('parses a full day-month-year date', () => {
    const result = parseLastDate('29 Jun 2026');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(5); // June = 5
    expect(result!.getDate()).toBe(29);
  });

  it('parses a month-only date and returns the last day of that month', () => {
    const result = parseLastDate('Apr 2026');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(3); // April = 3
    expect(result!.getDate()).toBe(30); // last day of April
  });

  it('returns last day of February for month-only Feb in a non-leap year', () => {
    const result = parseLastDate('Feb 2025');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2025);
    expect(result!.getMonth()).toBe(1); // Feb = 1
    expect(result!.getDate()).toBe(28);
  });

  it('returns last day of February for month-only Feb in a leap year', () => {
    const result = parseLastDate('Feb 2024');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(1);
    expect(result!.getDate()).toBe(29);
  });

  it('parses the END date of a range string', () => {
    const result = parseLastDate('Apr 2026 – 29 Jun 2026');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2026);
    expect(result!.getMonth()).toBe(5); // June
    expect(result!.getDate()).toBe(29);
  });

  it('is case-insensitive for month names', () => {
    const lower = parseLastDate('jan 2023');
    const upper = parseLastDate('JAN 2023');
    const mixed = parseLastDate('Jan 2023');
    expect(lower).not.toBeNull();
    expect(upper).not.toBeNull();
    expect(mixed).not.toBeNull();
    expect(lower!.getMonth()).toBe(0);
    expect(upper!.getMonth()).toBe(0);
    expect(mixed!.getMonth()).toBe(0);
  });

  it('handles full month name prefixes (e.g. "January")', () => {
    const result = parseLastDate('January 2022');
    expect(result).not.toBeNull();
    expect(result!.getMonth()).toBe(0);
    expect(result!.getFullYear()).toBe(2022);
  });
});

// ----------------------------------------------------------------------

describe('parseSortableDate', () => {
  it('returns null for strings with no recognisable date', () => {
    expect(parseSortableDate('')).toBeNull();
    expect(parseSortableDate('present')).toBeNull();
    expect(parseSortableDate('Unknown')).toBeNull();
  });

  it('returns a timestamp for a full day-month-year string', () => {
    const ts = parseSortableDate('27 Apr 2026');
    expect(ts).not.toBeNull();
    const d = new Date(ts!);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(3); // April
    expect(d.getDate()).toBe(27);
  });

  it('ignores trailing noise — "27 Apr 2026 — URGENT" → Apr 27', () => {
    const ts = parseSortableDate('27 Apr 2026 — URGENT');
    expect(ts).toBe(parseSortableDate('27 Apr 2026'));
  });

  it('ignores parenthetical day names — "13 Jun 2026 (Sat)" → Jun 13', () => {
    const ts = parseSortableDate('13 Jun 2026 (Sat)');
    expect(ts).toBe(parseSortableDate('13 Jun 2026'));
  });

  it('falls back to year-only for "~1994" → Jan 1 1994', () => {
    const ts = parseSortableDate('~1994');
    expect(ts).not.toBeNull();
    const d = new Date(ts!);
    expect(d.getFullYear()).toBe(1994);
    expect(d.getMonth()).toBe(0); // January
    expect(d.getDate()).toBe(1);
  });

  it('falls back to year-only for "2015 – present" → Jan 1 2015', () => {
    const ts = parseSortableDate('2015 – present');
    expect(ts).not.toBeNull();
    const d = new Date(ts!);
    expect(d.getFullYear()).toBe(2015);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(1);
  });

  it('a full date is always more recent than the same year via fallback', () => {
    // Dec 31 2015 > Jan 1 2015 (fallback for year-only)
    const specific = parseSortableDate('31 Dec 2015');
    const yearOnly = parseSortableDate('2015');
    expect(specific).not.toBeNull();
    expect(yearOnly).not.toBeNull();
    expect(specific!).toBeGreaterThan(yearOnly!);
  });
});

// ----------------------------------------------------------------------

describe('sortPhasesByDate', () => {
  it('pins active phase first regardless of its date', () => {
    const phases = [
      { key: 1, date: '27 Apr 2026', active: true },
      { key: 2, date: '13 Jun 2026' },
      { key: 3, date: '24 Apr 2026' },
    ];
    const result = sortPhasesByDate(phases);
    expect(result[0]!.key).toBe(1);
  });

  it('sorts remaining phases newest-first (descending by date)', () => {
    const phases = [
      { key: 1, date: '24 Apr 2026' },
      { key: 2, date: '13 Jun 2026' },
      { key: 3, date: '27 Apr 2026' },
    ];
    const result = sortPhasesByDate(phases);
    expect(result.map((p) => p.key)).toEqual([2, 3, 1]);
  });

  it('regression: key 9 (Apr 27) sorts after key 8 (Jun 13) in descending order', () => {
    // Before fix: sort was b.key - a.key → key 9 appeared first.
    // After fix: sort by date → Jun 13 (key 8) is newer → appears first.
    const phases = [
      { key: 9, date: '27 Apr 2026' }, // eVisitor granted
      { key: 8, date: '13 Jun 2026 (Sat)' }, // Final school trip
    ];
    const result = sortPhasesByDate(phases);
    expect(result[0]!.key).toBe(8); // Jun 13 is more recent → first
    expect(result[1]!.key).toBe(9);
  });

  it('regression: eVisitor (key 9, Apr 27) appears directly after IMR (key 1, Apr 24)', () => {
    const phases = [
      { key: 1, date: '24 Apr 2026' }, // IMR application
      { key: 9, date: '27 Apr 2026' }, // eVisitor — Applied & Granted
      { key: 8, date: '13 Jun 2026 (Sat)' }, // Final school trip
    ];
    const result = sortPhasesByDate(phases);
    // Descending: Jun 13 > Apr 27 > Apr 24
    expect(result.map((p) => p.key)).toEqual([8, 9, 1]);
  });

  it('breaks ties by descending key when dates are identical', () => {
    const phases = [
      { key: 1, date: '27 Apr 2026' },
      { key: 3, date: '27 Apr 2026' },
      { key: 2, date: '27 Apr 2026' },
    ];
    const result = sortPhasesByDate(phases);
    expect(result.map((p) => p.key)).toEqual([3, 2, 1]);
  });

  it('sorts undated phases to the end', () => {
    const phases = [
      { key: 1, date: '' },
      { key: 2, date: '27 Apr 2026' },
      { key: 3, date: 'present' },
    ];
    const result = sortPhasesByDate(phases);
    expect(result[0]!.key).toBe(2); // has a date → first
    // keys 1 and 3 have no date → last, tie-broken by descending key
    expect(result[1]!.key).toBe(3);
    expect(result[2]!.key).toBe(1);
  });

  it('sorts year-only dates after same-year specific dates', () => {
    const phases = [
      { key: 1, date: '~2015' },
      { key: 2, date: 'Dec 2015' },
      { key: 3, date: '~2014' },
    ];
    const result = sortPhasesByDate(phases);
    // Dec 2015 (end of month) > Jan 1 2015 (year fallback) > Jan 1 2014
    expect(result.map((p) => p.key)).toEqual([2, 1, 3]);
  });

  it('does not mutate the original array', () => {
    const phases = [
      { key: 2, date: '27 Apr 2026' },
      { key: 1, date: '13 Jun 2026' },
    ];
    const original = [...phases];
    sortPhasesByDate(phases);
    expect(phases).toEqual(original);
  });

  it('asc: pure chronological order — active and done both sort by date', () => {
    // Roadmap use-case: strict date order, no pinning of active or done phases.
    const phases = [
      { key: 1, date: 'Jan 2025 – Jun 2025', done: true }, // Jun 2025 → earliest → first
      { key: 2, date: 'Jul 2026 – Sep 2026', active: true }, // Sep 2026 — no active pinning
      { key: 3, date: 'May 2026' }, // May 2026 → second
      { key: 4, date: 'Jul 2026 – Sep 2026' }, // Sep 2026, tie with key 2
    ];
    const result = sortPhasesByDate(phases, 'asc');
    expect(result[0]!.key).toBe(1); // Jun 2025 — earliest (done, but no done-pinning in asc)
    expect(result[1]!.key).toBe(3); // May 2026
    expect(result[2]!.key).toBe(2); // Sep 2026 — active, tie with key 4, key 2 < 4 → first
    expect(result[3]!.key).toBe(4); // Sep 2026
  });
});

// ----------------------------------------------------------------------

describe('parseFirstDate', () => {
  it('returns the first day of the start month for a range', () => {
    // "Jul 2025 – Mar 2026" → Jul 1 2025
    const result = parseFirstDate('Jul 2025 – Mar 2026');
    expect(result).toBe(new Date(2025, 6, 1).getTime()); // month 6 = July
  });

  it('returns the first day of the month for a single month date', () => {
    expect(parseFirstDate('May 2026')).toBe(new Date(2026, 4, 1).getTime());
  });

  it('returns Jan 1 for a year-only string', () => {
    expect(parseFirstDate('2025')).toBe(new Date(2025, 0, 1).getTime());
  });

  it('returns null for an empty string', () => {
    expect(parseFirstDate('')).toBeNull();
  });

  it('returns null when no date is present', () => {
    expect(parseFirstDate('present')).toBeNull();
  });
});

// ----------------------------------------------------------------------

describe('detectPhaseOverlaps', () => {
  it('returns an empty set when no phases overlap', () => {
    const phases = [
      { key: 1, date: 'Jan 2025 – Jun 2025' },
      { key: 2, date: 'Jul 2025 – Dec 2025' },
      { key: 3, date: 'Jan 2026 – Mar 2026' },
    ];
    expect(detectPhaseOverlaps(phases).size).toBe(0);
  });

  it('returns both keys when two phases overlap', () => {
    const phases = [
      { key: 1, date: 'Jan 2025 – Jun 2025', title: 'Phase A' },
      { key: 2, date: 'Apr 2025 – Sep 2025', title: 'Phase B' }, // overlaps key 1: Apr-Jun is shared
    ];
    const result = detectPhaseOverlaps(phases);
    expect(result.has(1)).toBe(true);
    expect(result.has(2)).toBe(true);
    expect(result.get(1)).toContain('Phase B');
    expect(result.get(2)).toContain('Phase A');
  });

  it('returns all three keys when three phases share an overlap', () => {
    const phases = [
      { key: 1, date: 'Jan 2025 – Jun 2025' },
      { key: 2, date: 'Apr 2025 – Sep 2025' },
      { key: 3, date: 'Aug 2025 – Dec 2025' },
    ];
    // key1 overlaps key2, key2 overlaps key3 → all three flagged
    const result = detectPhaseOverlaps(phases);
    expect(result.has(1)).toBe(true);
    expect(result.has(2)).toBe(true);
    expect(result.has(3)).toBe(true);
  });

  it('ignores phases with unparseable dates', () => {
    const phases = [
      { key: 1, date: '' },
      { key: 2, date: 'present' },
    ];
    expect(detectPhaseOverlaps(phases).size).toBe(0);
  });

  it('does not flag adjacent ranges that share only an endpoint month', () => {
    // Jun 2025 end-of-month vs Jul 2025 start-of-month — different timestamps, no overlap
    const phases = [
      { key: 1, date: 'Jan 2025 – Jun 2025' }, // end = Jun 30 2025
      { key: 2, date: 'Jul 2025 – Dec 2025' }, // start = Jul 1 2025
    ];
    expect(detectPhaseOverlaps(phases).size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// sortMilestonesAsc / sortMilestonesDesc
// ---------------------------------------------------------------------------

/** Minimal milestone shape for sorting tests. */
function ms(date: string, title = date) {
  return { date, title };
}

describe('sortMilestonesAsc', () => {
  it('returns earliest milestone first', () => {
    const result = sortMilestonesAsc([ms('Dec 2020'), ms('Mar 2019'), ms('Jun 2021')]);
    expect(result.map((m) => m.date)).toEqual(['Mar 2019', 'Dec 2020', 'Jun 2021']);
  });

  it('milestones without parseable dates sort to the end', () => {
    const result = sortMilestonesAsc([ms('Jan 2020'), ms('unknown'), ms('Feb 2018')]);
    expect(result[0]!.date).toBe('Feb 2018');
    expect(result[1]!.date).toBe('Jan 2020');
    expect(result[2]!.date).toBe('unknown');
  });

  it('returns a new array (does not mutate the original)', () => {
    const original = [ms('Jun 2021'), ms('Jan 2020')];
    const sorted = sortMilestonesAsc(original);
    expect(sorted).not.toBe(original);
    expect(original[0]!.date).toBe('Jun 2021'); // original untouched
  });
});

describe('sortMilestonesDesc', () => {
  it('returns latest milestone first', () => {
    const result = sortMilestonesDesc([ms('Mar 2019'), ms('Dec 2020'), ms('Jun 2021')]);
    expect(result.map((m) => m.date)).toEqual(['Jun 2021', 'Dec 2020', 'Mar 2019']);
  });

  it('result is the exact reverse of sortMilestonesAsc for the same input', () => {
    const milestones = [ms('Mar 2019'), ms('Dec 2020'), ms('Jun 2021')];
    const asc = sortMilestonesAsc(milestones);
    const desc = sortMilestonesDesc(milestones);
    expect(desc.map((m) => m.date)).toEqual([...asc].reverse().map((m) => m.date));
  });

  it('milestones without parseable dates sort to the end regardless of direction', () => {
    const result = sortMilestonesDesc([ms('Jan 2020'), ms('unknown'), ms('Feb 2018')]);
    expect(result[0]!.date).toBe('Jan 2020');
    expect(result[1]!.date).toBe('Feb 2018');
    expect(result[2]!.date).toBe('unknown');
  });
});
