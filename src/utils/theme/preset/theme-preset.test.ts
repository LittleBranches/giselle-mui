// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import {
  GISELLE_PRIMARY_DARK_MAIN,
  GISELLE_PRIMARY_MAIN,
  GISELLE_SECONDARY_MAIN,
  giselleTheme,
} from './theme-preset';

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

// ----------------------------------------------------------------------

describe('palette constants', () => {
  it('GISELLE_PRIMARY_MAIN is a valid 6-digit hex colour', () => {
    expect(GISELLE_PRIMARY_MAIN).toMatch(HEX_REGEX);
  });

  it('GISELLE_PRIMARY_DARK_MAIN is a valid 6-digit hex colour', () => {
    expect(GISELLE_PRIMARY_DARK_MAIN).toMatch(HEX_REGEX);
  });

  it('GISELLE_SECONDARY_MAIN is a valid 6-digit hex colour', () => {
    expect(GISELLE_SECONDARY_MAIN).toMatch(HEX_REGEX);
  });

  it('light-mode and dark-mode primaries are different (dark mode is lighter)', () => {
    expect(GISELLE_PRIMARY_MAIN).not.toBe(GISELLE_PRIMARY_DARK_MAIN);
  });

  it('GISELLE_PRIMARY_MAIN is Deep grove green', () => {
    expect(GISELLE_PRIMARY_MAIN).toBe('#2E7D32');
  });

  it('GISELLE_PRIMARY_DARK_MAIN is Lime green', () => {
    expect(GISELLE_PRIMARY_DARK_MAIN).toBe('#76C442');
  });

  it('GISELLE_SECONDARY_MAIN is Mango gold', () => {
    expect(GISELLE_SECONDARY_MAIN).toBe('#F5A623');
  });
});

// ----------------------------------------------------------------------

describe('giselleTheme', () => {
  // Non-null assertions are safe: extendTheme always populates both schemes
  // when colorSchemes.light and .dark are explicitly provided.
  const light = giselleTheme.colorSchemes.light!;
  const dark = giselleTheme.colorSchemes.dark!;

  it('is defined and is an object', () => {
    expect(giselleTheme).toBeDefined();
    expect(typeof giselleTheme).toBe('object');
  });

  it('both light and dark colour schemes are present', () => {
    expect(light).toBeDefined();
    expect(dark).toBeDefined();
  });

  it('light palette primary.main matches GISELLE_PRIMARY_MAIN', () => {
    expect(light.palette.primary.main).toBe(GISELLE_PRIMARY_MAIN);
  });

  it('dark palette primary.main matches GISELLE_PRIMARY_DARK_MAIN', () => {
    expect(dark.palette.primary.main).toBe(GISELLE_PRIMARY_DARK_MAIN);
  });

  it('secondary.main is Mango gold in both light and dark schemes', () => {
    expect(light.palette.secondary.main).toBe(GISELLE_SECONDARY_MAIN);
    expect(dark.palette.secondary.main).toBe(GISELLE_SECONDARY_MAIN);
  });

  it('all six palette keys present in light scheme', () => {
    expect(light.palette.primary.main).toBeDefined();
    expect(light.palette.secondary.main).toBeDefined();
    expect(light.palette.info.main).toBeDefined();
    expect(light.palette.success.main).toBeDefined();
    expect(light.palette.warning.main).toBeDefined();
    expect(light.palette.error.main).toBeDefined();
  });

  it('all six palette keys present in dark scheme', () => {
    expect(dark.palette.primary.main).toBeDefined();
    expect(dark.palette.secondary.main).toBeDefined();
    expect(dark.palette.info.main).toBeDefined();
    expect(dark.palette.success.main).toBeDefined();
    expect(dark.palette.warning.main).toBeDefined();
    expect(dark.palette.error.main).toBeDefined();
  });

  it('all palette main values are valid 6-digit hex colours', () => {
    const keys = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const key of keys) {
      expect(light.palette[key].main).toMatch(HEX_REGEX);
      expect(dark.palette[key].main).toMatch(HEX_REGEX);
    }
  });

  it('success.main is distinct from primary.main (no visual ambiguity)', () => {
    expect(light.palette.success.main).not.toBe(GISELLE_PRIMARY_MAIN);
  });
});
