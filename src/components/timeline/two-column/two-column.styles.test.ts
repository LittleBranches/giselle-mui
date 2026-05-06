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

  it('hides on xs when hasContent=false, shows on md', () => {
    const styles = timelineColumnSx('left', false, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('shows on xs when hasContent=true', () => {
    const styles = timelineColumnSx('right', true, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
  });

  it('[regression] has minWidth:0 so the flex child can shrink at narrow widths', () => {
    const styles = timelineColumnSx('left', true, 40) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(0);
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
  it('shows on xs when visible=true', () => {
    const styles = msColumnBoxSx(true) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
    expect(display['md']).toBe('block');
  });

  it('hides on xs when visible=false', () => {
    const styles = msColumnBoxSx(false) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('is relatively positioned with overflow:visible', () => {
    const styles = msColumnBoxSx(true) as Record<string, unknown>;
    expect(styles['position']).toBe('relative');
    expect(styles['overflow']).toBe('visible');
    expect(styles['flex']).toBe(1);
  });

  it('[regression] has minWidth:0 so the milestone column can shrink at narrow widths', () => {
    const styles = msColumnBoxSx(true) as Record<string, unknown>;
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

  it('sets responsive minHeight when computedMinHeight is provided', () => {
    const styles = phaseLiSx({ zIndex: 1, computedMinHeight: 480 }) as Record<string, unknown>;
    const mh = styles['minHeight'] as { xs: number; md: number };
    expect(mh.md).toBe(480);
    expect(mh.xs).toBe(960);
  });

  it('[regression] xs minHeight is 2× md to prevent milestone-over-phase-card overlap at narrow widths', () => {
    const styles = phaseLiSx({ zIndex: 1, computedMinHeight: 172 }) as Record<string, unknown>;
    const mh = styles['minHeight'] as { xs: number; md: number };
    expect(mh.xs).toBe(mh.md * 2);
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
