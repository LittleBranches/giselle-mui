// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { ANIMATED_GRADIENT_DEFAULT_DURATION } from './animated-gradient-text.const';
import { gradientTextSx } from './animated-gradient-text.styles';

// ----------------------------------------------------------------------

describe('ANIMATED_GRADIENT_DEFAULT_DURATION', () => {
  it('[regression] is a positive number', () => {
    expect(ANIMATED_GRADIENT_DEFAULT_DURATION).toBeGreaterThan(0);
  });
});

describe('gradientTextSx', () => {
  it('uses the correct MUI CSS variable for color1', () => {
    const styles = gradientTextSx('primary', 'secondary', 3) as Record<string, unknown>;
    expect(styles.background).toContain('var(--mui-palette-primary-main)');
  });

  it('uses the correct MUI CSS variable for color2', () => {
    const styles = gradientTextSx('primary', 'secondary', 3) as Record<string, unknown>;
    expect(styles.background).toContain('var(--mui-palette-secondary-main)');
  });

  it('includes the given duration in the animation value', () => {
    const styles = gradientTextSx('primary', 'secondary', 5) as Record<string, unknown>;
    expect(styles.animation).toContain('5s');
  });

  it('sets backgroundClip to text', () => {
    const styles = gradientTextSx('primary', 'secondary', 3) as Record<string, unknown>;
    expect(styles.backgroundClip).toBe('text');
  });

  it('sets display to inline-block (required for backgroundClip)', () => {
    const styles = gradientTextSx('primary', 'secondary', 3) as Record<string, unknown>;
    expect(styles.display).toBe('inline-block');
  });

  it('defines @keyframes for the animation', () => {
    const styles = gradientTextSx('primary', 'secondary', 3) as Record<string, unknown>;
    expect(styles['@keyframes animatedGradientText']).toBeDefined();
  });

  it('works for all six palette keys', () => {
    const keys = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const key of keys) {
      const styles = gradientTextSx(key, 'primary', 3) as Record<string, unknown>;
      expect(styles.background).toContain(`var(--mui-palette-${key}-main)`);
    }
  });
});
