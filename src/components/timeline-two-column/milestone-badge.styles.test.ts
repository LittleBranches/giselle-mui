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

  it('[regression] dot width and height are both 7px', () => {
    const sx = milestoneNewDotSx as Record<string, unknown>;
    expect(sx['width']).toBe(7);
    expect(sx['height']).toBe(7);
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

  it('[regression] font size is 0.65rem', () => {
    const sx = milestoneNewLabelSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.65rem');
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
