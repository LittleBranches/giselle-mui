// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  TECH_ICON_STRIP_ICON_SIZE,
  TECH_ICON_STRIP_LABEL_FONT_SIZE,
} from './tech-icon-strip.const';
import { stripWrapperSx, itemSx, iconSlotSx } from './tech-icon-strip.styles';

// ----------------------------------------------------------------------

describe('TECH_ICON_STRIP_ICON_SIZE', () => {
  it('[regression] is >= 32px (minimum standalone decorative icon size)', () => {
    expect(TECH_ICON_STRIP_ICON_SIZE).toBeGreaterThanOrEqual(32);
  });
});

describe('TECH_ICON_STRIP_LABEL_FONT_SIZE', () => {
  it('[regression] is 0.75rem (minimum badge/pill label size)', () => {
    expect(TECH_ICON_STRIP_LABEL_FONT_SIZE).toBe('0.75rem');
  });
});

describe('stripWrapperSx', () => {
  it('sets justifyContent to center when centeredWrap is true', () => {
    const styles = stripWrapperSx(true) as Record<string, unknown>;
    expect(styles.justifyContent).toBe('center');
  });

  it('sets justifyContent to flex-start when centeredWrap is false', () => {
    const styles = stripWrapperSx(false) as Record<string, unknown>;
    expect(styles.justifyContent).toBe('flex-start');
  });

  it('uses flex layout', () => {
    const styles = stripWrapperSx(false) as Record<string, unknown>;
    expect(styles.display).toBe('flex');
  });

  it('wraps items', () => {
    const styles = stripWrapperSx(false) as Record<string, unknown>;
    expect(styles.flexWrap).toBe('wrap');
  });
});

describe('itemSx', () => {
  it('stacks content in a column', () => {
    expect((itemSx as Record<string, unknown>).flexDirection).toBe('column');
  });
});

describe('iconSlotSx', () => {
  it('enforces TECH_ICON_STRIP_ICON_SIZE on svg width', () => {
    const svgStyles = (iconSlotSx as Record<string, unknown>)['& svg'] as Record<string, unknown>;
    expect(svgStyles.width).toBe(TECH_ICON_STRIP_ICON_SIZE);
  });

  it('enforces TECH_ICON_STRIP_ICON_SIZE on svg height', () => {
    const svgStyles = (iconSlotSx as Record<string, unknown>)['& svg'] as Record<string, unknown>;
    expect(svgStyles.height).toBe(TECH_ICON_STRIP_ICON_SIZE);
  });
});
