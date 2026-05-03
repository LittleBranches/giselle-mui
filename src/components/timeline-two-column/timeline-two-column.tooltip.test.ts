// @vitest-environment jsdom

/**
 * Unit tests for the dot-tooltip resolution helpers exported from
 * `timeline-two-column.tsx`.
 *
 * ## Functions under test
 *
 *   truncateDescription   — first-sentence extraction + length cap
 *   resolvePhaseTooltip   — tooltip for a phase dot (checklist vs read-only)
 *   resolveMilestoneTooltip — tooltip for a milestone dot (same logic, Milestone type)
 *
 * ## Why these need tests
 *
 *   The tooltip is the *only* way a user can preview a phase/milestone description
 *   without expanding the card. If `truncateDescription` returns the wrong sentence,
 *   or if `resolvePhaseTooltip` falls through to the wrong branch, the user sees a
 *   misleading or empty tooltip. These are silent failures — no runtime error, just
 *   wrong content. Tests here lock the branching logic.
 */

import { it, expect, describe } from 'vitest';

import type { TimelinePhase } from './types';
import {
  truncateDescription,
  resolvePhaseTooltip,
  resolveMilestoneTooltip,
} from './timeline-two-column';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid TimelinePhase for tooltip tests. */
function phase(overrides: Partial<TimelinePhase> = {}): TimelinePhase {
  return {
    key: 1,
    title: 'Default Title',
    date: 'Jan 2020',
    icon: null,
    color: 'primary',
    side: 'right',
    ...overrides,
  };
}

type Milestone = NonNullable<TimelinePhase['milestones']>[number];

/** Minimal valid Milestone for tooltip tests. */
function milestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    title: 'Default Milestone',
    date: 'Feb 2020',
    icon: null,
    color: 'primary',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// truncateDescription
// ---------------------------------------------------------------------------

describe('truncateDescription', () => {
  it('short string returned as-is', () => {
    expect(truncateDescription('Hello world')).toBe('Hello world');
  });

  it('string exactly at maxLen returned as-is', () => {
    const s = 'A'.repeat(72);
    expect(truncateDescription(s)).toBe(s);
  });

  it('string one char over maxLen gets truncated with ellipsis', () => {
    const s = 'A'.repeat(73);
    const result = truncateDescription(s);
    expect(result).toHaveLength(73); // 72 chars + '…'
    expect(result.endsWith('…')).toBe(true);
  });

  it('extracts first sentence when text has multiple sentences', () => {
    const result = truncateDescription('First sentence. Second sentence. Third sentence.');
    expect(result).toBe('First sentence');
  });

  it('exclamation mark is treated as sentence boundary', () => {
    const result = truncateDescription('Wow! Something else happened.');
    expect(result).toBe('Wow');
  });

  it('question mark is treated as sentence boundary', () => {
    const result = truncateDescription('Are you sure? Yes I am.');
    expect(result).toBe('Are you sure');
  });

  it('first sentence still capped at maxLen when it is very long', () => {
    const longFirstSentence = 'B'.repeat(100) + '. Short second sentence.';
    const result = truncateDescription(longFirstSentence);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBe(73); // 72 + ellipsis char
  });

  it('falls back to full string when no sentence boundary found', () => {
    const s = 'No sentence boundary here';
    expect(truncateDescription(s)).toBe(s);
  });

  it('custom maxLen is respected', () => {
    const result = truncateDescription('Hello world, this is long', 10);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBe(11); // 10 + ellipsis
  });

  it('[regression] empty string returns empty string (no crash)', () => {
    expect(truncateDescription('')).toBe('');
  });

  it('[regression] trailing whitespace before ellipsis is trimmed', () => {
    // "AAAA " at position 72 — the space should be trimmed before adding ellipsis
    const s = 'A'.repeat(71) + ' ' + 'B'.repeat(10);
    const result = truncateDescription(s);
    expect(result.endsWith(' …')).toBe(false);
    expect(result.endsWith('…')).toBe(true);
  });

  it('[regression] decimal numbers are not treated as sentence boundaries', () => {
    // "TS 4.0" — the period is NOT followed by whitespace, so it must NOT split here.
    // Before the fix, split(/[.!?]/) would have returned "TS 4" as the first sentence.
    expect(truncateDescription('TS 4.0 is a great release')).toBe('TS 4.0 is a great release');
  });

  it('[regression] decimal numbers embedded mid-sentence are not split', () => {
    // "v5.0" — the period is followed by a digit, not whitespace → not a sentence boundary.
    expect(
      truncateDescription('Migrated the entire codebase to v5.0 without breaking changes')
    ).toBe('Migrated the entire codebase to v5.0 without breaking changes');
  });

  it('[regression] sentence boundary with whitespace is still detected', () => {
    // Period followed by a space IS a valid boundary.
    expect(truncateDescription('First sentence. Second sentence.')).toBe('First sentence');
  });
});

// ---------------------------------------------------------------------------
// resolvePhaseTooltip
// ---------------------------------------------------------------------------

describe('resolvePhaseTooltip — dotTooltip override', () => {
  it('dotTooltip always wins over description and status label', () => {
    const p = phase({ dotTooltip: 'Custom override', description: 'Should be ignored' });
    expect(resolvePhaseTooltip(false, 'primary', false, p)).toBe('Custom override');
    expect(resolvePhaseTooltip(true, 'primary', false, p)).toBe('Custom override');
  });
});

describe('resolvePhaseTooltip — checklist mode', () => {
  it('done=true → "Done · date"', () => {
    expect(resolvePhaseTooltip(true, 'primary', true, phase({ date: 'Mar 2020' }))).toBe(
      'Done · Mar 2020'
    );
  });

  it('color=error + not done → "Blocking · date"', () => {
    expect(resolvePhaseTooltip(true, 'error', false, phase({ date: 'Mar 2020' }))).toBe(
      'Blocking · Mar 2020'
    );
  });

  it('color=warning + not done → "In progress · date"', () => {
    expect(resolvePhaseTooltip(true, 'warning', false, phase({ date: 'Mar 2020' }))).toBe(
      'In progress · Mar 2020'
    );
  });

  it('color=success + not done → "Planned · date"', () => {
    expect(resolvePhaseTooltip(true, 'success', false, phase({ date: 'Mar 2020' }))).toBe(
      'Planned · Mar 2020'
    );
  });

  it('no date → status only, no separator', () => {
    const p = phase({ date: undefined });
    expect(resolvePhaseTooltip(true, 'primary', true, p)).toBe('Done');
  });

  it('[regression] checklist mode ignores phase.description (status is more actionable)', () => {
    const p = phase({ description: 'Some long description that should be ignored', date: 'Q1' });
    const result = resolvePhaseTooltip(true, 'primary', false, p);
    expect(result).not.toContain('long description');
    expect(result).toBe('Upcoming · Q1');
  });
});

describe('resolvePhaseTooltip — read-only mode', () => {
  it('description provided → truncated description preview', () => {
    const p = phase({ description: 'This is the preview. More details follow.' });
    expect(resolvePhaseTooltip(false, 'primary', false, p)).toBe('This is the preview');
  });

  it('no description → title · date fallback', () => {
    const p = phase({ title: 'My Phase', date: 'Jun 2021' });
    expect(resolvePhaseTooltip(false, 'primary', false, p)).toBe('My Phase · Jun 2021');
  });

  it('no description, no date → title only', () => {
    const p = phase({ title: 'My Phase', date: undefined });
    expect(resolvePhaseTooltip(false, 'primary', false, p)).toBe('My Phase');
  });

  it('shortTitle used instead of title when available', () => {
    const p = phase({ title: 'Long Full Title', shortTitle: 'Short', date: 'Q2' });
    expect(resolvePhaseTooltip(false, 'primary', false, p)).toBe('Short · Q2');
  });

  it('[regression] read-only mode ignores done/color for tooltip content', () => {
    const p = phase({ description: 'Context that matters', date: 'Q3' });
    // done=true and color=error should not change the read-only tooltip
    expect(resolvePhaseTooltip(false, 'error', true, p)).toBe('Context that matters');
  });
});

// ---------------------------------------------------------------------------
// resolveMilestoneTooltip
// ---------------------------------------------------------------------------

describe('resolveMilestoneTooltip — dotTooltip override', () => {
  it('dotTooltip always wins', () => {
    const ms = milestone({ dotTooltip: 'Custom', description: 'Ignored' });
    expect(resolveMilestoneTooltip(false, 'primary', false, ms)).toBe('Custom');
  });
});

describe('resolveMilestoneTooltip — checklist mode', () => {
  it('done=true → "Done · date"', () => {
    const ms = milestone({ date: 'Apr 2021' });
    expect(resolveMilestoneTooltip(true, 'primary', true, ms)).toBe('Done · Apr 2021');
  });

  it('color=warning + not done → "In progress · date"', () => {
    const ms = milestone({ date: 'Apr 2021' });
    expect(resolveMilestoneTooltip(true, 'warning', false, ms)).toBe('In progress · Apr 2021');
  });
});

describe('resolveMilestoneTooltip — read-only mode', () => {
  it('description → truncated preview', () => {
    // truncateDescription splits only when a sentence-ending terminator is followed
    // by whitespace or end-of-string.  Version numbers like "TS 5.0" or abbreviations
    // like "e.g." are NOT split because the period is not followed by whitespace.
    const ms = milestone({ description: 'Decorators reached stable status. More detail here.' });
    expect(resolveMilestoneTooltip(false, 'primary', false, ms)).toBe(
      'Decorators reached stable status'
    );
  });

  it('no description → title · date fallback (version numbers like "TS 4.0" are safe — no split)', () => {
    // "TS 4.0" contains a period NOT followed by whitespace, so truncateDescription treats it
    // as part of the word, not a sentence boundary. The full title is returned intact.
    const ms = milestone({ title: 'TS 4.0', date: 'Aug 2020' });
    expect(resolveMilestoneTooltip(false, 'primary', false, ms)).toBe('TS 4.0 · Aug 2020');
  });

  it('shortTitle preferred over title in fallback', () => {
    const ms = milestone({ title: 'TypeScript 4.0 Released', shortTitle: 'TS 4.0', date: 'Q3' });
    expect(resolveMilestoneTooltip(false, 'primary', false, ms)).toBe('TS 4.0 · Q3');
  });

  it('no description, no date → title only', () => {
    const ms = milestone({ title: 'TS 3.0', date: undefined });
    expect(resolveMilestoneTooltip(false, 'primary', false, ms)).toBe('TS 3.0');
  });

  it('[regression] read-only ignores done state for tooltip content', () => {
    const ms = milestone({ description: 'Shipped and stable', date: 'Q1' });
    expect(resolveMilestoneTooltip(false, 'success', true, ms)).toBe('Shipped and stable');
  });
});
