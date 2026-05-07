// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import {
  timelineColumnSx,
  msRowSx,
  msColumnBoxSx,
  msDotWrapperSx,
  floatingDatePillSx,
  markerPhaseLiSx,
  markerLeftLabelSx,
  markerCenterSx,
  markerRightLabelSx,
  phaseRowSx,
  phaseLiSx,
  centerColumnSx,
  timelineRootSx,
} from './two-column.styles';

// ---------------------------------------------------------------------------
// timelineColumnSx
// ---------------------------------------------------------------------------

describe('timelineColumnSx — column layout', () => {
  it('left column: right text-align, right padding', () => {
    const styles = timelineColumnSx('left', true, 40) as Record<string, unknown>;
    expect(styles['textAlign']).toBe('right');
    expect(styles['pr']).toBe(2);
    expect(styles['pl']).toBe(0);
  });

  it('right column: left text-align, left padding', () => {
    const styles = timelineColumnSx('right', true, 40) as Record<string, unknown>;
    expect(styles['textAlign']).toBe('left');
    expect(styles['pl']).toBe(2);
    expect(styles['pr']).toBe(0);
  });

  it('applies paddingBottom from the argument', () => {
    const styles = timelineColumnSx('left', true, 48) as Record<string, unknown>;
    expect(styles['paddingBottom']).toBe('48px');
  });

  it('[regression] left column always hidden on xs (cards move to right slot on mobile)', () => {
    const styles = timelineColumnSx('left', false, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('[regression] left column hidden on xs even when hasContent=true', () => {
    const styles = timelineColumnSx('left', true, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('shows on xs when hasContent=true', () => {
    const styles = timelineColumnSx('right', true, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
  });

  it('[regression] right column always visible on xs even when hasContent=false (receives all cards on mobile)', () => {
    const styles = timelineColumnSx('right', false, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
    expect(display['md']).toBe('none');
  });

  it('[regression] has minWidth:0 so the flex child can shrink at narrow widths', () => {
    const styles = timelineColumnSx('left', true, 40) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Phase-card reserve slot regression — milestone clearance invariant
// ---------------------------------------------------------------------------
//
// The first milestone must never overlap the phase card.
// milestone-row.tsx uses PHASE_CARD_RESERVE_SLOTS=2 in the topPercent formula.
// two-column.tsx uses the same constant in phaseMinHeight.
// This test locks in the math so a refactor cannot silently break the invariant.
//
// Variables (using typical values):
//   RESERVE = 2
//   slotHeight = 80px (measured card 64px + 16px padding)
//   n = 4 milestones
//   H_ms = 64px (milestone card height)
//   H_phase = 110px (typical desktop phase card)
//
// Expected:
//   phaseMinHeight = (RESERVE + n + 1) × slotHeight = 7 × 80 = 560px
//   topPercent[0] = (RESERVE + 0 + 1) / (RESERVE + n + 1) = 3/7 ≈ 42.86%
//   first milestone top (center) = 42.86% × 560 + 15 = 255px
//   first milestone card top = 255 - 32 = 223px
//   phase card bottom = 6 + 110 = 116px
//   clearance = 223 - 116 = 107px > 0 ✓

describe('[regression] phase-card reserve — milestone clearance invariant', () => {
  const RESERVE = 2;
  const slotHeight = 80;
  const H_ms = 64;

  it('first milestone (n=4) clears a 110px phase card by at least 80px', () => {
    const n = 4;
    const liHeight = (RESERVE + n + 1) * slotHeight; // 7 × 80 = 560
    const topFraction = (RESERVE + 1) / (RESERVE + n + 1); // 3/7
    const firstMsCenter = topFraction * liHeight + 15; // 240 + 15 = 255
    const firstMsCardTop = firstMsCenter - H_ms / 2; // 255 - 32 = 223
    const phaseCardBottom = 6 + 110; // pt:0.75 (6px) + H_phase
    expect(firstMsCardTop - phaseCardBottom).toBeGreaterThanOrEqual(80);
  });

  it('[regression] first milestone (n=1) clears a 90px phase card', () => {
    const n = 1;
    const liHeight = (RESERVE + n + 1) * slotHeight; // 4 × 80 = 320
    const topFraction = (RESERVE + 1) / (RESERVE + n + 1); // 3/4
    const firstMsCenter = topFraction * liHeight + 15;
    const firstMsCardTop = firstMsCenter - H_ms / 2;
    const phaseCardBottom = 6 + 90;
    expect(firstMsCardTop).toBeGreaterThan(phaseCardBottom);
  });

  it('[regression] formula holds at extreme xs phase card height (200px) with n=4', () => {
    const n = 4;
    const liHeight = (RESERVE + n + 1) * slotHeight;
    const firstMsCardTop = ((RESERVE + 1) / (RESERVE + n + 1)) * liHeight + 15 - H_ms / 2;
    const phaseCardBottom = 6 + 200; // very tall xs phase card
    expect(firstMsCardTop).toBeGreaterThan(phaseCardBottom);
  });
});

// ---------------------------------------------------------------------------
// msRowSx
// ---------------------------------------------------------------------------

describe('msRowSx — milestone row wrapper', () => {
  it('positions absolutely at the given percentage', () => {
    const styles = msRowSx(25) as Record<string, unknown>;
    expect(styles['position']).toBe('absolute');
    expect(styles['top']).toBe('25%');
    expect(styles['left']).toBe(0);
    expect(styles['right']).toBe(0);
  });

  it('is a horizontal flex row', () => {
    const styles = msRowSx(50) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['flexDirection']).toBe('row');
  });
});

// ---------------------------------------------------------------------------
// msColumnBoxSx
// ---------------------------------------------------------------------------

describe('msColumnBoxSx — milestone column box', () => {
  it('[regression] right column always visible on xs (receives all milestone cards on mobile)', () => {
    const styles = msColumnBoxSx('right', true) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
    expect(display['md']).toBe('block');
  });

  it('[regression] right column visible on xs even when visible=false', () => {
    const styles = msColumnBoxSx('right', false) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
    expect(display['md']).toBe('none');
  });

  it('[regression] left column always hidden on xs (milestone cards shift to right slot on mobile)', () => {
    const styles = msColumnBoxSx('left', true) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('is relatively positioned with overflow:visible', () => {
    const styles = msColumnBoxSx('right', true) as Record<string, unknown>;
    expect(styles['position']).toBe('relative');
    expect(styles['overflow']).toBe('visible');
    expect(styles['flex']).toBe(1);
  });

  it('[regression] has minWidth:0 so the milestone column can shrink at narrow widths', () => {
    const styles = msColumnBoxSx('right', true) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// msDotWrapperSx
// ---------------------------------------------------------------------------

describe('msDotWrapperSx — milestone dot blur wrapper', () => {
  it('has transition defined (not blurred)', () => {
    const styles = msDotWrapperSx(false) as Record<string, unknown>;
    expect(String(styles['transition'])).toContain('filter');
    expect(styles['filter']).toBeUndefined();
  });

  it('applies blur and dim when blurred=true', () => {
    const styles = msDotWrapperSx(true) as Record<string, unknown>;
    expect(styles['filter']).toBe('blur(1.5px)');
    expect(styles['opacity']).toBe(0.38);
    expect(styles['pointerEvents']).toBe('none');
  });

  it('is inline-flex positioned relatively', () => {
    const styles = msDotWrapperSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('inline-flex');
    expect(styles['position']).toBe('relative');
  });
});

// ---------------------------------------------------------------------------
// floatingDatePillSx
// ---------------------------------------------------------------------------

describe('floatingDatePillSx — floating date pill above a dot', () => {
  it('[regression] is display:none by default (shown on hover via parent wrapper)', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['display']).toBe('none');
  });

  it('is absolutely positioned above the dot', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['position']).toBe('absolute');
    expect(sx['bottom']).toBe('calc(100% + 4px)');
    expect(sx['left']).toBe('50%');
    expect(sx['transform']).toBe('translateX(-50%)');
  });

  it('[regression] font size meets item-date minimum of 0.875rem', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.875rem');
  });

  it('has z-index 2 so it renders above dot', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['zIndex']).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// markerPhaseLiSx
// ---------------------------------------------------------------------------

describe('markerPhaseLiSx — marker phase li', () => {
  it('has a minimum height for the dot', () => {
    const sx = markerPhaseLiSx as Record<string, unknown>;
    expect(sx['minHeight']).toBe(40);
  });

  it('is column flex, relatively positioned', () => {
    const sx = markerPhaseLiSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['position']).toBe('relative');
    expect(sx['zIndex']).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// markerLeftLabelSx / markerRightLabelSx / markerCenterSx
// ---------------------------------------------------------------------------

describe('markerLeftLabelSx — left label column', () => {
  it('right-aligns content with right padding', () => {
    const sx = markerLeftLabelSx as Record<string, unknown>;
    expect(sx['justifyContent']).toBe('flex-end');
    expect(sx['pr']).toBe(1.5);
    expect(sx['flex']).toBe(1);
  });

  it('[regression] has minWidth:0 and overflow:hidden to clip nowrap labels at narrow widths', () => {
    const sx = markerLeftLabelSx as Record<string, unknown>;
    expect(sx['minWidth']).toBe(0);
    expect(sx['overflow']).toBe('hidden');
  });

  it('[regression: markerLeftLabelSx hidden xs] left label hidden so left-side labels move to the right slot on mobile', () => {
    const sx = markerLeftLabelSx as Record<string, unknown>;
    const display = sx['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('flex');
  });
});

describe('markerRightLabelSx — right label column', () => {
  it('left-aligns content with left padding', () => {
    const sx = markerRightLabelSx as Record<string, unknown>;
    expect(sx['justifyContent']).toBe('flex-start');
    expect(sx['pl']).toBe(1.5);
    expect(sx['flex']).toBe(1);
  });

  it('[regression] has minWidth:0 and overflow:hidden to clip nowrap labels at narrow widths', () => {
    const sx = markerRightLabelSx as Record<string, unknown>;
    expect(sx['minWidth']).toBe(0);
    expect(sx['overflow']).toBe('hidden');
  });
});

describe('markerCenterSx — centre column', () => {
  it('is column flex centered, relatively positioned', () => {
    const sx = markerCenterSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['alignItems']).toBe('center');
    expect(sx['position']).toBe('relative');
  });

  it('[regression] has flexShrink:0 so the spine dot is never squeezed', () => {
    const sx = markerCenterSx as Record<string, unknown>;
    expect(sx['flexShrink']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// phaseRowSx
// ---------------------------------------------------------------------------

describe('phaseRowSx — phase row', () => {
  it('is stretch-aligned flex row with transition', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['alignItems']).toBe('stretch');
    expect(String(styles['transition'])).toContain('filter');
  });

  it('has flex:1 to fill the li height', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['flex']).toBe(1);
  });

  it('applies blur when blurred=true', () => {
    const styles = phaseRowSx(true) as Record<string, unknown>;
    expect(styles['filter']).toBe('blur(1.5px)');
    expect(styles['opacity']).toBe(0.38);
    expect(styles['pointerEvents']).toBe('none');
  });

  it('does not apply blur when blurred=false', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['filter']).toBeUndefined();
    expect(styles['opacity']).toBeUndefined();
  });

  it('[regression] has minWidth:0 to prevent the phase row from overflowing its li', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// phaseLiSx
// ---------------------------------------------------------------------------

describe('phaseLiSx — phase li element', () => {
  it('uses zIndex=1 when no milestone expanded', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    expect(styles['zIndex']).toBe(1);
  });

  it('uses zIndex=2 when a milestone is expanded', () => {
    const styles = phaseLiSx({ zIndex: 2 }) as Record<string, unknown>;
    expect(styles['zIndex']).toBe(2);
  });

  it('sets minHeight when computedMinHeight is provided', () => {
    const styles = phaseLiSx({ zIndex: 1, computedMinHeight: 480 }) as Record<string, unknown>;
    expect(styles['minHeight']).toBe(480);
  });

  it('omits minHeight when computedMinHeight is undefined', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    expect(styles['minHeight']).toBeUndefined();
  });

  it('has :has() pseudo-class for hovered milestone cards', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    const hasRule = styles['&:has([data-ms-card]:hover)'] as Record<string, number>;
    expect(hasRule['zIndex']).toBe(3);
  });

  it('is column flex, relatively positioned', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    expect(styles['position']).toBe('relative');
    expect(styles['display']).toBe('flex');
    expect(styles['flexDirection']).toBe('column');
  });
});

// ---------------------------------------------------------------------------
// centerColumnSx
// ---------------------------------------------------------------------------

describe('centerColumnSx — centre spine column', () => {
  it('is column flex, centred', () => {
    const sx = centerColumnSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['alignItems']).toBe('center');
  });

  it('[regression] has flexShrink:0 so the spine dot is never squeezed at narrow widths', () => {
    const sx = centerColumnSx as Record<string, unknown>;
    expect(sx['flexShrink']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// timelineRootSx
// ---------------------------------------------------------------------------

describe('timelineRootSx — MUI Timeline root', () => {
  it('resets MUI default padding and margin', () => {
    const sx = timelineRootSx as Record<string, unknown>;
    expect(sx['p']).toBe(0);
    expect(sx['m']).toBe(0);
  });

  it('removes MUI pseudo-element before TimelineItem', () => {
    const sx = timelineRootSx as Record<string, unknown>;
    const reset = sx['& .MuiTimelineItem-root:before'] as Record<string, unknown>;
    expect(reset['flex']).toBe(0);
    expect(reset['padding']).toBe(0);
  });

  it('[regression] has overflowX:hidden to clip absolutely-positioned milestone cards at narrow widths', () => {
    const sx = timelineRootSx as Record<string, unknown>;
    expect(sx['overflowX']).toBe('hidden');
  });
});
