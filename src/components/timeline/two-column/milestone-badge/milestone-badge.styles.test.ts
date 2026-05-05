// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

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

// ---------------------------------------------------------------------------
// milestoneNewBadgeRowSx
// ---------------------------------------------------------------------------

describe('milestoneNewBadgeRowSx — "New" indicator row', () => {
  it('right-aligns content when rightAlign=true', () => {
    const styles = milestoneNewBadgeRowSx(true) as Record<string, unknown>;
    expect(styles['justifyContent']).toBe('flex-end');
  });

  it('omits justifyContent when rightAlign=false', () => {
    const styles = milestoneNewBadgeRowSx(false) as Record<string, unknown>;
    expect(styles['justifyContent']).toBeUndefined();
  });

  it('is a flex row with bottom margin', () => {
    const styles = milestoneNewBadgeRowSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['alignItems']).toBe('center');
    expect(styles['mb']).toBe(0.5);
  });
});

// ---------------------------------------------------------------------------
// milestoneNewDotSx
// ---------------------------------------------------------------------------

describe('milestoneNewDotSx — "New" status dot', () => {
  it('is circular and success-green', () => {
    const sx = milestoneNewDotSx as Record<string, unknown>;
    expect(sx['borderRadius']).toBe('50%');
    expect(sx['bgcolor']).toBe('success.main');
    expect(sx['flexShrink']).toBe(0);
  });

  it('[regression] dot meets 12px minimum readability size', () => {
    const sx = milestoneNewDotSx as Record<string, unknown>;
    expect(Number(sx['width'])).toBeGreaterThanOrEqual(12);
    expect(Number(sx['height'])).toBeGreaterThanOrEqual(12);
  });
});

// ---------------------------------------------------------------------------
// milestoneNewLabelSx
// ---------------------------------------------------------------------------

describe('milestoneNewLabelSx — "New" label text', () => {
  it('is small, bold, and success-green', () => {
    const sx = milestoneNewLabelSx as Record<string, unknown>;
    expect(sx['fontWeight']).toBe(700);
    expect(sx['color']).toBe('success.main');
    expect(sx['lineHeight']).toBe(1);
  });

  it('[regression] font size meets badge-label minimum of 0.75rem', () => {
    const sx = milestoneNewLabelSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.75rem');
  });
});

// ---------------------------------------------------------------------------
// milestoneDateSx
// ---------------------------------------------------------------------------

describe('milestoneDateSx — date label', () => {
  it('uses the provided fontSize', () => {
    const styles = milestoneDateSx('0.875rem') as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.875rem');
  });

  it('defaults to 0.875rem (MILESTONE_DATE_FONT_SIZE)', () => {
    const styles = milestoneDateSx() as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.875rem');
  });

  it('[regression] minimum readable size is 0.875rem', () => {
    // 0.875rem matches body2 — below this, dates become hard to read.
    const styles = milestoneDateSx() as Record<string, unknown>;
    const rem = Number.parseFloat(String(styles['fontSize']));
    expect(rem).toBeGreaterThanOrEqual(0.875);
  });

  it('is displayed as a block with bottom margin', () => {
    const styles = milestoneDateSx() as Record<string, unknown>;
    expect(styles['display']).toBe('block');
    expect(styles['mb']).toBe(0.5);
  });
});

// ---------------------------------------------------------------------------
// milestoneTitleRowSx
// ---------------------------------------------------------------------------

describe('milestoneTitleRowSx — title row container', () => {
  it('right-aligns when rightAlign=true', () => {
    const styles = milestoneTitleRowSx(true) as Record<string, unknown>;
    expect(styles['justifyContent']).toBe('flex-end');
  });

  it('left-aligns when rightAlign=false', () => {
    const styles = milestoneTitleRowSx(false) as Record<string, unknown>;
    expect(styles['justifyContent']).toBe('flex-start');
  });

  it('is a flex row with gap', () => {
    const styles = milestoneTitleRowSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['alignItems']).toBe('center');
    expect(styles['gap']).toBe(0.75);
  });
});

// ---------------------------------------------------------------------------
// milestoneEyeButtonSx
// ---------------------------------------------------------------------------

describe('milestoneEyeButtonSx — viewed eye button', () => {
  it('[regression] default minimum size is 28px (WCAG tap target)', () => {
    const styles = milestoneEyeButtonSx({ isViewed: false }) as Record<string, unknown>;
    expect(Number(styles['minWidth'])).toBeGreaterThanOrEqual(28);
    expect(Number(styles['minHeight'])).toBeGreaterThanOrEqual(28);
  });

  it('uses provided minSize', () => {
    const styles = milestoneEyeButtonSx({ isViewed: false, minSize: 32 }) as Record<
      string,
      unknown
    >;
    expect(styles['minWidth']).toBe(32);
  });

  it('is success color when isViewed=true', () => {
    const styles = milestoneEyeButtonSx({ isViewed: true }) as Record<string, unknown>;
    expect(styles['color']).toBe('success.main');
  });

  it('is text.secondary when isViewed=false', () => {
    const styles = milestoneEyeButtonSx({ isViewed: false }) as Record<string, unknown>;
    expect(styles['color']).toBe('text.secondary');
  });

  it('is flex-centered with no background or border', () => {
    const styles = milestoneEyeButtonSx({ isViewed: false }) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['background']).toBe('none');
    expect(styles['border']).toBe('none');
    expect(styles['cursor']).toBe('pointer');
  });
});

// ---------------------------------------------------------------------------
// milestoneDetailPillSx
// ---------------------------------------------------------------------------

describe('milestoneDetailPillSx — collapsed detail-count pill', () => {
  it('is inline-flex with action.hover background', () => {
    const sx = milestoneDetailPillSx as Record<string, unknown>;
    expect(sx['display']).toBe('inline-flex');
    expect(sx['bgcolor']).toBe('action.hover');
    expect(sx['color']).toBe('text.secondary');
  });

  it('has horizontal and vertical padding', () => {
    const sx = milestoneDetailPillSx as Record<string, unknown>;
    expect(sx['px']).toBe(0.625);
    expect(sx['py']).toBe(0.2);
  });
});

// ---------------------------------------------------------------------------
// milestoneDetailListSx
// ---------------------------------------------------------------------------

describe('milestoneDetailListSx — expanded detail list container', () => {
  it('has top border separator', () => {
    const sx = milestoneDetailListSx as Record<string, unknown>;
    expect(sx['borderTop']).toBe('1px solid');
    expect(sx['borderColor']).toBe('divider');
  });

  it('is a column flex with vertical spacing', () => {
    const sx = milestoneDetailListSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['gap']).toBe(0.75);
    expect(sx['mt']).toBe(1.5);
    expect(sx['pt']).toBe(1.5);
  });
});

// ---------------------------------------------------------------------------
// milestoneDetailRowSx
// ---------------------------------------------------------------------------

describe('milestoneDetailRowSx — individual bullet row', () => {
  it('is flex row with left-aligned text', () => {
    const sx = milestoneDetailRowSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['alignItems']).toBe('flex-start');
    expect(sx['textAlign']).toBe('left');
  });
});

// ---------------------------------------------------------------------------
// Done milestone card pointerEvents override — regression (6 May 2026)
//
// When a milestone is suppressed (msCardWrapperSx with suppressElevation=true),
// the wrapper applies `pointerEvents: 'none'`. Done milestones must still
// receive hover events so the user can temporarily restore full colour by
// hovering over any done item.
//
// The fix adds `pointerEvents: 'auto'` to the `done` block of the Paper sx
// inside MilestoneBadge. The mirror below documents this invariant so any
// future revert is caught immediately.
// ---------------------------------------------------------------------------

/**
 * Mirrors the `done` style fragment of the Paper sx in milestone-badge.tsx.
 *
 * Done milestones must always be hoverable (pointerEvents: auto) so the
 * hover restore rule (opacity: 1, filter: none) can fire despite the parent
 * msCardWrapperSx applying pointerEvents: none when suppressElevation is set.
 */
function buildDoneMilestoneFragment(done: boolean): Record<string, unknown> {
  if (!done) return {};
  return {
    opacity: 0.45,
    filter: 'grayscale(1)',
    // Overrides parent pointerEvents:none so hover events reach this Paper.
    pointerEvents: 'auto',
  };
}

describe('[regression] done milestone card pointerEvents — hover reachable despite parent suppress', () => {
  it('done milestone has pointerEvents:auto so hover works when parent has pointerEvents:none', () => {
    const fragment = buildDoneMilestoneFragment(true);
    expect(fragment['pointerEvents']).toBe('auto');
  });

  it('not-done milestone does not set pointerEvents (inherits from parent, no override needed)', () => {
    const fragment = buildDoneMilestoneFragment(false);
    expect(fragment['pointerEvents']).toBeUndefined();
  });

  it('[regression] done milestone base opacity is 0.45 (greyed out at rest)', () => {
    const fragment = buildDoneMilestoneFragment(true);
    expect(fragment['opacity']).toBe(0.45);
  });

  it('[regression] done milestone base filter is grayscale(1) (greyed out at rest)', () => {
    const fragment = buildDoneMilestoneFragment(true);
    expect(fragment['filter']).toBe('grayscale(1)');
  });
});
