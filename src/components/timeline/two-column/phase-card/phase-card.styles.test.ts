// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import {
  photoImgSx,
  labeledIconStripLabelSx,
  detailBulletsContainerSx,
  detailBulletsRowSx,
  tooltipAlertListSx,
  cornerBadgeCircleSx,
  statusBadgeWrapperSx,
  newStatusDotSx,
  newStatusLabelSx,
  activeDotSx,
  activeStatusLabelSx,
  scenarioBadgeSx,
  detailCountPillSx,
  logoStripSx,
  clientLogoSx,
  platformStripSx,
  projectLogoSx,
  eyeButtonSx,
} from './phase-card.styles';

const mockTheme = {
  vars: { palette: { grey: { '900Channel': '33 43 54' } } },
} as unknown as Theme;

// ---------------------------------------------------------------------------
// photoImgSx — first-photo vs subsequent-photo margin
// ---------------------------------------------------------------------------

describe('photoImgSx — photo image sx factory', () => {
  it('first photo gets mt: 2 (breathing room after description)', () => {
    const styles = photoImgSx(true) as Record<string, unknown>;
    expect(styles['mt']).toBe(2);
  });

  it('subsequent photos get mt: 1 (tighter gap within the strip)', () => {
    const styles = photoImgSx(false) as Record<string, unknown>;
    expect(styles['mt']).toBe(1);
  });

  it('all photos share the same base styles regardless of position', () => {
    const first = photoImgSx(true) as Record<string, unknown>;
    const second = photoImgSx(false) as Record<string, unknown>;

    expect(first['width']).toBe('100%');
    expect(second['width']).toBe('100%');
    expect(first['maxWidth']).toBe(200);
    expect(second['maxWidth']).toBe(200);
    expect(first['display']).toBe('block');
    expect(second['display']).toBe('block');
  });

  it('[regression] first photo margin is 2, not 1 — prevents missing breathing room', () => {
    expect((photoImgSx(true) as Record<string, unknown>)['mt']).toBe(2);
    expect((photoImgSx(false) as Record<string, unknown>)['mt']).toBe(1);
    expect((photoImgSx(true) as Record<string, unknown>)['mt']).not.toBe(
      (photoImgSx(false) as Record<string, unknown>)['mt']
    );
  });
});

// ---------------------------------------------------------------------------
// labeledIconStripLabelSx — section overline label
// ---------------------------------------------------------------------------

describe('labeledIconStripLabelSx — section overline label', () => {
  it('uses display:block with bottom margin', () => {
    const sx = labeledIconStripLabelSx as Record<string, unknown>;
    expect(sx['display']).toBe('block');
    expect(sx['mb']).toBe(1);
  });

  it('[regression] font size meets badge-label minimum of 0.75rem', () => {
    const sx = labeledIconStripLabelSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.75rem');
  });
});

// ---------------------------------------------------------------------------
// detailBulletsContainerSx / detailBulletsRowSx
// ---------------------------------------------------------------------------

describe('detailBulletsContainerSx — expandable bullet list container', () => {
  it('has top border separator and vertical gap', () => {
    const sx = detailBulletsContainerSx as Record<string, unknown>;
    expect(sx['borderTop']).toBe('1px solid');
    expect(sx['gap']).toBe(0.75);
  });

  it('is a column flex with spacing above the separator', () => {
    const sx = detailBulletsContainerSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['mt']).toBe(1.5);
    expect(sx['pt']).toBe(1.5);
  });
});

describe('detailBulletsRowSx — individual bullet row', () => {
  it('is flex row with left-aligned text', () => {
    const sx = detailBulletsRowSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['alignItems']).toBe('flex-start');
    expect(sx['textAlign']).toBe('left');
  });
});

// ---------------------------------------------------------------------------
// tooltipAlertListSx — tooltip content column
// ---------------------------------------------------------------------------

describe('tooltipAlertListSx — tooltip alert list', () => {
  it('is a column flex with gap and padding', () => {
    const sx = tooltipAlertListSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['gap']).toBe(1.25);
  });
});

// ---------------------------------------------------------------------------
// cornerBadgeCircleSx — corner alert badge circle (dynamic, theme callback)
// ---------------------------------------------------------------------------

describe('cornerBadgeCircleSx — corner alert badge', () => {
  it('positions absolutely with given transform', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: 'translate(50%, -50%)',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['position']).toBe('absolute');
    expect(styles['right']).toBe(0);
    expect(styles['transform']).toBe('translate(50%, -50%)');
  });

  it('applies error bg when hasError=true', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { left: 0 },
      transform: 'translate(-50%, -50%)',
      hasError: true,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    expect(sxFn(mockTheme)['bgcolor']).toBe('error.main');
  });

  it('applies warning bg when hasError=false', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: 'translate(50%, -50%)',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    expect(sxFn(mockTheme)['bgcolor']).toBe('warning.dark');
  });

  it('[regression] box-shadow uses theme grey-900 channel', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: '',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['boxShadow']).toContain('33 43 54');
  });

  it('defaults badge size to 26 (CORNER_ALERT_BADGE_SIZE)', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: '',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['width']).toBe(26);
    expect(styles['height']).toBe(26);
  });
});

// ---------------------------------------------------------------------------
// statusBadgeWrapperSx — shared NewBadge / ActiveBadge row wrapper
// ---------------------------------------------------------------------------

describe('statusBadgeWrapperSx — badge row wrapper', () => {
  it('is a flex row with bottom margin', () => {
    const sx = statusBadgeWrapperSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['alignItems']).toBe('center');
    expect(sx['mb']).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// newStatusDotSx / activeDotSx — pulsing status dots
// ---------------------------------------------------------------------------

describe('newStatusDotSx — NewBadge pulsing dot', () => {
  it('is circular with the given size', () => {
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(styles['width']).toBe(12);
    expect(styles['height']).toBe(12);
    expect(styles['borderRadius']).toBe('50%');
  });

  it('[regression] minimum dot size is 12px', () => {
    // Smaller dots fall below the 12px minimum readability size (copilot-instructions.md).
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(Number(styles['width'])).toBeGreaterThanOrEqual(12);
    // Width must be a static value, not a function (no theme callback on this factory)
    expect(typeof styles['width']).not.toBe('function');
  });

  it('applies success-main color (always green for New)', () => {
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(styles['bgcolor']).toBe('success.main');
  });

  it('contains a pulse animation', () => {
    const styles = newStatusDotSx(12) as Record<string, unknown>;
    expect(String(styles['animation'])).toContain('1.4s');
  });
});

describe('activeDotSx — ActiveBadge pulsing dot', () => {
  it('uses the dynamic color prop for bgcolor', () => {
    const styles = activeDotSx('primary', 12) as Record<string, unknown>;
    expect(styles['bgcolor']).toBe('primary.main');
  });

  it('[regression] minimum dot size is 12px', () => {
    const styles = activeDotSx('info', 12) as Record<string, unknown>;
    expect(Number(styles['width'])).toBeGreaterThanOrEqual(12);
  });
});

// ---------------------------------------------------------------------------
// newStatusLabelSx / activeStatusLabelSx — badge typography
// ---------------------------------------------------------------------------

describe('newStatusLabelSx — NewBadge label', () => {
  it('[regression] font size is at least 0.75rem (badge minimum)', () => {
    const sx = newStatusLabelSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.75rem');
  });

  it('is success-colored', () => {
    const sx = newStatusLabelSx as Record<string, unknown>;
    expect(sx['color']).toBe('success.main');
  });
});

describe('activeStatusLabelSx — ActiveBadge label', () => {
  it('[regression] font size is at least 0.75rem (badge minimum)', () => {
    const styles = activeStatusLabelSx('primary') as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.75rem');
  });

  it('uses the dynamic color for text', () => {
    expect((activeStatusLabelSx('error') as Record<string, unknown>)['color']).toBe('error.main');
  });
});

// ---------------------------------------------------------------------------
// scenarioBadgeSx — scenario pill badge
// ---------------------------------------------------------------------------

describe('scenarioBadgeSx — scenario pill badge', () => {
  it('[regression] font size is at least 0.75rem (badge minimum)', () => {
    const styles = scenarioBadgeSx('info') as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.75rem');
  });

  it('uses dark variant of the color for text', () => {
    const styles = scenarioBadgeSx('warning') as Record<string, unknown>;
    expect(styles['color']).toBe('warning.dark');
  });

  it('uses CSS var channel for soft background tint', () => {
    const styles = scenarioBadgeSx('success') as Record<string, unknown>;
    expect(String(styles['bgcolor'])).toContain('--mui-palette-success-mainChannel');
  });
});

// ---------------------------------------------------------------------------
// detailCountPillSx — detail count pill
// ---------------------------------------------------------------------------

describe('detailCountPillSx — collapsed detail-count pill', () => {
  it('is inline-flex with action.hover background', () => {
    const sx = detailCountPillSx as Record<string, unknown>;
    expect(sx['display']).toBe('inline-flex');
    expect(sx['bgcolor']).toBe('action.hover');
    expect(sx['color']).toBe('text.secondary');
  });
});

// ---------------------------------------------------------------------------
// logoStripSx / platformStripSx — logo containers
// ---------------------------------------------------------------------------

describe('logoStripSx — clients/projects logo strip', () => {
  it('is flex-wrap with gap 2.5', () => {
    const sx = logoStripSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexWrap']).toBe('wrap');
    expect(sx['gap']).toBe(2.5);
  });
});

describe('platformStripSx — tech platform strip', () => {
  it('is flex-wrap with tighter gap 1', () => {
    const sx = platformStripSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexWrap']).toBe('wrap');
    expect(sx['gap']).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// clientLogoSx / projectLogoSx — logo images
// ---------------------------------------------------------------------------

describe('clientLogoSx — client logo image', () => {
  it('is contained, greyscale, 40px tall', () => {
    const sx = clientLogoSx as Record<string, unknown>;
    expect(sx['height']).toBe(40);
    expect(sx['objectFit']).toBe('contain');
    expect(sx['filter']).toBe('grayscale(1)');
  });

  it('removes grayscale on hover', () => {
    const hover = (clientLogoSx as Record<string, unknown>)['&:hover'] as
      | Record<string, unknown>
      | undefined;
    expect(hover?.['filter']).toBe('none');
    expect(hover?.['opacity']).toBe(1);
  });
});

describe('projectLogoSx — project logo image', () => {
  it('is contained, 28px tall with opacity', () => {
    const sx = projectLogoSx as Record<string, unknown>;
    expect(sx['height']).toBe(28);
    expect(sx['objectFit']).toBe('contain');
    expect(sx['opacity']).toBe(0.85);
  });
});

// ---------------------------------------------------------------------------
// eyeButtonSx — viewed eye button (dynamic)
// ---------------------------------------------------------------------------

describe('eyeButtonSx — viewed eye button', () => {
  it('positions right when columnSide=right', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['right']).toBe(0);
    expect(styles['left']).toBeUndefined();
  });

  it('positions left when columnSide=left', () => {
    const styles = eyeButtonSx({ columnSide: 'left', isViewed: false }) as Record<string, unknown>;
    expect(styles['left']).toBe(0);
    expect(styles['right']).toBeUndefined();
  });

  it('defaults minWidth/minHeight to 28 (EYE_BUTTON_MIN_SIZE)', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(28);
    expect(styles['minHeight']).toBe(28);
  });

  it('[regression] minimum button size is 28px (WCAG tap target)', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(Number(styles['minWidth'])).toBeGreaterThanOrEqual(28);
    expect(Number(styles['minHeight'])).toBeGreaterThanOrEqual(28);
  });

  it('uses success color when isViewed=true', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: true }) as Record<string, unknown>;
    expect(styles['color']).toBe('success.main');
  });

  it('uses text.secondary when isViewed=false', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['color']).toBe('text.secondary');
  });

  it('is absolutely positioned', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['position']).toBe('absolute');
    expect(styles['bottom']).toBe(0);
  });
});
