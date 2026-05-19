// @vitest-environment jsdom

/**
 * Pure-logic unit tests for the size constants and WCAG accessibility values
 * exported from milestone-badge.tsx.
 *
 * None of these tests mount the component — they verify the exported constants
 * against minimum readability and accessibility thresholds. If a constant is
 * ever reduced below the minimum, the test fails before the change reaches
 * production or Storybook.
 */

import { it, expect, describe } from 'vitest';

import {
  MILESTONE_DATE_FONT_SIZE,
  MILESTONE_PILL_ICON_SIZE,
  MILESTONE_PILL_TEXT_FONT_SIZE,
  MILESTONE_EYE_ICON_SIZE,
} from './milestone-badge';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseRem(rem: string): number {
  return Number.parseFloat(rem);
}

const MIN_ICON_SIZE_PX = 16;
const MIN_FONT_SIZE_REM = 0.75;

// ---------------------------------------------------------------------------
// Readability — minimum size constants (regression)
//
// These tests guard against accidental size reductions. Each constant maps to
// a visible element; falling below the minimum would harm legibility.
// ---------------------------------------------------------------------------

describe('readability — minimum size constants', () => {
  it('[regression] MILESTONE_DATE_FONT_SIZE >= 0.875rem (matches body2 — never override below default)', () => {
    expect(parseRem(MILESTONE_DATE_FONT_SIZE)).toBeGreaterThanOrEqual(0.875);
  });

  it('[regression] MILESTONE_PILL_ICON_SIZE >= 16px (subtask icon in expandable details pill)', () => {
    expect(MILESTONE_PILL_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] MILESTONE_PILL_TEXT_FONT_SIZE >= 0.75rem (count label in expandable details pill)', () => {
    expect(parseRem(MILESTONE_PILL_TEXT_FONT_SIZE)).toBeGreaterThanOrEqual(MIN_FONT_SIZE_REM);
  });

  it('[regression] MILESTONE_EYE_ICON_SIZE >= 20px (interactive eye icon — larger than decorative minimum)', () => {
    expect(MILESTONE_EYE_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });
});

// ---------------------------------------------------------------------------
// Eye button accessibility (WCAG 2.2 AA regression)
// ---------------------------------------------------------------------------

describe('eye button — WCAG accessibility regression', () => {
  it('[regression] MILESTONE_EYE_ICON_SIZE >= 20px (WCAG 1.4.11 — interactive icon minimum contrast target)', () => {
    expect(MILESTONE_EYE_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });

  it('[regression] MILESTONE_EYE_ICON_SIZE >= 16px (must be >= inline icon minimum)', () => {
    expect(MILESTONE_EYE_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });
});
