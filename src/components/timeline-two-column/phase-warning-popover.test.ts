// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  parsePhaseRange,
  getConnectedOverlapGroup,
  computeAxis,
  hasRemainingOverlaps,
  applyOverrides,
  mergeIntoAll,
} from './phase-warning-popover';
import type { TimelinePhase } from './types';

// Minimal phase factory — only the fields the helpers care about.
function phase(key: number, date: string, overrides: Partial<TimelinePhase> = {}): TimelinePhase {
  return {
    key,
    date,
    title: `Phase ${key}`,
    icon: null,
    side: 'right',
    done: false,
    color: 'primary',
    milestones: [],
    ...overrides,
  };
}

// ----------------------------------------------------------------------
// parsePhaseRange
// ----------------------------------------------------------------------

describe('parsePhaseRange', () => {
  it('parses a single "Mon YYYY" date', () => {
    const r = parsePhaseRange(phase(1, 'Jan 2020'));
    expect(r).toEqual({ startIdx: 2020 * 12 + 0, endIdx: 2020 * 12 + 0 });
  });

  it('parses a "Mon YYYY – Mon YYYY" range', () => {
    const r = parsePhaseRange(phase(1, 'Jan 2020 – Apr 2021'));
    expect(r).toEqual({ startIdx: 2020 * 12 + 0, endIdx: 2021 * 12 + 3 });
  });

  it('parses a range with hyphen separator', () => {
    const r = parsePhaseRange(phase(1, 'Mar 2022 - Jun 2023'));
    expect(r).toEqual({ startIdx: 2022 * 12 + 2, endIdx: 2023 * 12 + 5 });
  });

  it('returns null for a year-only string like ~1994', () => {
    expect(parsePhaseRange(phase(1, '~1994'))).toBeNull();
  });

  it('returns null for "2022 – Now"', () => {
    expect(parsePhaseRange(phase(1, '2022 – Now'))).toBeNull();
  });

  it('uses startIdx for endIdx when only start is parseable', () => {
    // "Jan 2020 – Now" — start is valid, end is not → endIdx falls back to startIdx
    const r = parsePhaseRange(phase(1, 'Jan 2020 – Now'));
    expect(r).toEqual({ startIdx: 2020 * 12 + 0, endIdx: 2020 * 12 + 0 });
  });
});

// ----------------------------------------------------------------------
// getConnectedOverlapGroup
// ----------------------------------------------------------------------

describe('getConnectedOverlapGroup', () => {
  it('returns only the phases in the same connected overlap cluster as startKey', () => {
    const phases = [
      phase(1, 'Jan 2020 – Jun 2020'), // overlaps with 2
      phase(2, 'Apr 2020 – Dec 2020'), // overlaps with 1 and 3
      phase(3, 'Oct 2020 – Mar 2021'), // overlaps with 2 only
      phase(4, 'Jan 2022 – Jun 2022'), // isolated — different year
    ];
    const group = getConnectedOverlapGroup(phases, 1);
    const keys = group.map((p) => p.key).sort();
    expect(keys).toEqual([1, 2, 3]);
  });

  it('excludes unrelated overlap groups', () => {
    const phases = [
      phase(1, 'Jan 2020 – Jun 2020'),
      phase(2, 'Apr 2020 – Dec 2020'), // overlaps with 1
      phase(3, 'Jan 2023 – Jun 2023'),
      phase(4, 'Apr 2023 – Dec 2023'), // overlaps with 3, but unrelated to 1+2
    ];
    const group = getConnectedOverlapGroup(phases, 1);
    const keys = group.map((p) => p.key).sort();
    expect(keys).toEqual([1, 2]);
  });

  it('returns only the startKey phase when it has no overlaps', () => {
    const phases = [
      phase(1, 'Jan 2020 – Mar 2020'),
      phase(2, 'Jun 2020 – Sep 2020'), // no overlap with 1
    ];
    const group = getConnectedOverlapGroup(phases, 1);
    expect(group.map((p) => p.key)).toEqual([1]);
  });

  it('handles transitive overlap (A overlaps B, B overlaps C, A does not directly overlap C)', () => {
    const phases = [
      phase(1, 'Jan 2020 – Apr 2020'),
      phase(2, 'Mar 2020 – Jul 2020'), // overlaps 1 and 3
      phase(3, 'Jun 2020 – Oct 2020'), // overlaps 2 only
    ];
    const group = getConnectedOverlapGroup(phases, 1);
    expect(group.map((p) => p.key).sort()).toEqual([1, 2, 3]);
  });

  it('skips phases with unparseable dates (year-only)', () => {
    const phases = [
      phase(1, 'Jan 2020 – Jun 2020'),
      phase(2, 'Apr 2020 – Dec 2020'), // overlaps 1
      phase(3, '~1994'), // unparseable — excluded from adjacency
    ];
    const group = getConnectedOverlapGroup(phases, 1);
    expect(group.map((p) => p.key).sort()).toEqual([1, 2]);
  });
});

// ----------------------------------------------------------------------
// computeAxis
// ----------------------------------------------------------------------

describe('computeAxis', () => {
  it('returns min-2 and max+2 of the override ranges', () => {
    const overrides = new Map([
      [1, { startIdx: 100, endIdx: 110 }],
      [2, { startIdx: 108, endIdx: 120 }],
    ]);
    expect(computeAxis(overrides)).toEqual({ min: 98, max: 122 });
  });

  it('handles a single override', () => {
    const overrides = new Map([[1, { startIdx: 50, endIdx: 60 }]]);
    expect(computeAxis(overrides)).toEqual({ min: 48, max: 62 });
  });

  it('returns fallback { min: 0, max: 24 } for empty map', () => {
    expect(computeAxis(new Map())).toEqual({ min: 0, max: 24 });
  });
});

// ----------------------------------------------------------------------
// hasRemainingOverlaps
// ----------------------------------------------------------------------

describe('hasRemainingOverlaps', () => {
  it('returns true when two ranges overlap', () => {
    const overrides = new Map([
      [1, { startIdx: 100, endIdx: 110 }],
      [2, { startIdx: 108, endIdx: 120 }],
    ]);
    expect(hasRemainingOverlaps(overrides)).toBe(true);
  });

  it('returns false when ranges are non-overlapping (touching is ok — same boundary)', () => {
    // [100–110] and [111–120]: no overlap
    const overrides = new Map([
      [1, { startIdx: 100, endIdx: 110 }],
      [2, { startIdx: 111, endIdx: 120 }],
    ]);
    expect(hasRemainingOverlaps(overrides)).toBe(false);
  });

  it('returns true when ranges share a single boundary month (a.end === b.start)', () => {
    // [100–110] and [110–120]: start <= end and start <= end → overlap
    const overrides = new Map([
      [1, { startIdx: 100, endIdx: 110 }],
      [2, { startIdx: 110, endIdx: 120 }],
    ]);
    expect(hasRemainingOverlaps(overrides)).toBe(true);
  });

  it('returns false for a single range', () => {
    expect(hasRemainingOverlaps(new Map([[1, { startIdx: 100, endIdx: 110 }]]))).toBe(false);
  });

  it('returns false for empty map', () => {
    expect(hasRemainingOverlaps(new Map())).toBe(false);
  });
});

// ----------------------------------------------------------------------
// applyOverrides
// ----------------------------------------------------------------------

describe('applyOverrides', () => {
  it('rebuilds date string from override range', () => {
    const phases = [phase(1, 'Jan 2020 – Jun 2020')];
    // Jan 2021 = 2021*12+0 = 24252, Apr 2021 = 2021*12+3 = 24255
    const overrides = new Map([[1, { startIdx: 24252, endIdx: 24255 }]]);
    const result = applyOverrides(phases, overrides);
    expect(result[0]!.date).toBe('Jan 2021 – Apr 2021');
  });

  it('uses a single month string when startIdx === endIdx', () => {
    const phases = [phase(1, 'Jan 2020 – Jun 2020')];
    const overrides = new Map([[1, { startIdx: 24252, endIdx: 24252 }]]);
    const result = applyOverrides(phases, overrides);
    expect(result[0]!.date).toBe('Jan 2021');
  });

  it('leaves phases without an override unchanged', () => {
    const phases = [phase(1, 'Jan 2020'), phase(2, 'Mar 2020')];
    const overrides = new Map([[1, { startIdx: 24252, endIdx: 24252 }]]);
    const result = applyOverrides(phases, overrides);
    expect(result[1]!.date).toBe('Mar 2020');
  });

  it('does not mutate the input array', () => {
    const phases = [phase(1, 'Jan 2020 – Jun 2020')];
    const original = phases[0]!.date;
    const overrides = new Map([[1, { startIdx: 24252, endIdx: 24255 }]]);
    applyOverrides(phases, overrides);
    expect(phases[0]!.date).toBe(original);
  });
});

// ----------------------------------------------------------------------
// mergeIntoAll
// ----------------------------------------------------------------------

describe('mergeIntoAll', () => {
  it('replaces updated phases by key, leaves others untouched', () => {
    const all = [phase(1, 'Jan 2020'), phase(2, 'Mar 2020'), phase(3, 'Jun 2020')];
    const updated = [phase(2, 'Apr 2021')];
    const result = mergeIntoAll(all, updated);
    expect(result[0]!.date).toBe('Jan 2020');
    expect(result[1]!.date).toBe('Apr 2021');
    expect(result[2]!.date).toBe('Jun 2020');
  });

  it('preserves array length and order', () => {
    const all = [phase(1, 'Jan 2020'), phase(2, 'Mar 2020')];
    const result = mergeIntoAll(all, [phase(1, 'Feb 2021')]);
    expect(result).toHaveLength(2);
    expect(result[0]!.key).toBe(1);
    expect(result[1]!.key).toBe(2);
  });

  it('does not mutate the input arrays', () => {
    const all = [phase(1, 'Jan 2020')];
    const updated = [phase(1, 'Dec 2021')];
    mergeIntoAll(all, updated);
    expect(all[0]!.date).toBe('Jan 2020');
  });
});
