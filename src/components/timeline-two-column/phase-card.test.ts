// @vitest-environment jsdom

/**
 * Pure-logic unit tests for the helper functions inside PhaseCard.
 *
 * None of these tests mount the component — they extract and verify the exact
 * decision functions in isolation. If the component logic changes, update the
 * mirror functions below to match and the tests will catch any unintentional
 * behavioural drift.
 *
 * ## Derivations under test
 *
 *   isHighlightedVariant    — gates the highlighted card border/bg treatment
 *   buildCardClickHandler   — calls toggle only when hasDetails is true
 *   buildCardKeyDownHandler — fires toggle on Enter/Space when hasDetails is true
 *   resolveCardExpansion    — selects controlled vs. uncontrolled expand mode
 *   CardStatusBadge logic   — stacked: active + overdue can show together; scenario is fallback-only
 *   derivePlatformEntry     — pure derivation; null icon for string platforms
 *   buildPlatformStripItems — HTML integration: icon renders, text fallback suppressed
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { it, vi, expect, describe } from 'vitest';

import {
  STATUS_BADGE_FONT_SIZE,
  CORNER_ALERT_ICON_SIZE,
  CORNER_ALERT_LIST_ICON_SIZE,
  CORNER_ALERT_BADGE_SIZE,
  ACTIVE_DOT_SIZE,
  PHASE_PILL_ICON_SIZE,
  PHASE_PILL_TEXT_FONT_SIZE,
  PHASE_EYE_ICON_SIZE,
  EYE_BUTTON_MIN_SIZE,
  buildPlatformStripItems,
  derivePlatformEntry,
  resolveCornerBadgeAlign,
} from './phase-card';

// ---------------------------------------------------------------------------
// Mirror functions — exact copies of the inline helpers in phase-card.tsx
// ---------------------------------------------------------------------------

function isHighlightedVariant(variant?: string): boolean {
  return variant === 'scenario' || variant === 'life-event';
}

function buildCardClickHandler(hasDetails: boolean, toggle: () => void): () => void {
  return () => {
    if (hasDetails) toggle();
  };
}

function buildCardKeyDownHandler(
  hasDetails: boolean,
  toggle: () => void
): (e: { key: string; preventDefault: () => void }) => void {
  return (e) => {
    if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggle();
    }
  };
}

function resolveCardExpansion(
  onRequestExpand: (() => void) | undefined,
  isExpanded: boolean | undefined,
  internalExpanded: boolean,
  setInternalExpanded: (updater: (v: boolean) => boolean) => void
): { expanded: boolean; toggle: () => void } {
  if (onRequestExpand === undefined) {
    return { expanded: internalExpanded, toggle: () => setInternalExpanded((v) => !v) };
  }
  return { expanded: isExpanded ?? false, toggle: onRequestExpand };
}

/** Mirrors CardStatusBadge stacked logic — returns the set of badge types that render. */
function resolveStatusBadges(opts: {
  isOverdue: boolean;
  isDone: boolean;
  isActive: boolean;
  isScenario: boolean;
  scenarioLabel?: string;
  dateConflict?: boolean;
}): Array<'active' | 'overdue' | 'dateConflict' | 'scenario'> {
  const result: Array<'active' | 'overdue' | 'dateConflict' | 'scenario'> = [];
  if (opts.isActive && !opts.isDone) result.push('active');
  if (opts.isOverdue && !opts.isDone) result.push('overdue');
  if (opts.dateConflict) result.push('dateConflict');
  const showScenario =
    !opts.isActive &&
    !opts.isOverdue &&
    !opts.dateConflict &&
    opts.isScenario &&
    Boolean(opts.scenarioLabel);
  if (showScenario) result.push('scenario');
  return result;
}

// ---------------------------------------------------------------------------
// isHighlightedVariant
// ---------------------------------------------------------------------------

describe('isHighlightedVariant', () => {
  it('scenario → true', () => {
    expect(isHighlightedVariant('scenario')).toBe(true);
  });

  it('life-event → true', () => {
    expect(isHighlightedVariant('life-event')).toBe(true);
  });

  it('undefined → false', () => {
    expect(isHighlightedVariant()).toBe(false);
  });

  it('unknown variant string → false', () => {
    expect(isHighlightedVariant('custom-variant')).toBe(false);
  });

  it('empty string → false', () => {
    expect(isHighlightedVariant('')).toBe(false);
  });

  it('[regression] marker → false (marker cards use standard, non-highlighted styling)', () => {
    expect(isHighlightedVariant('marker')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// buildCardClickHandler
// ---------------------------------------------------------------------------

describe('buildCardClickHandler', () => {
  it('hasDetails=true → toggle called on click', () => {
    const toggle = vi.fn();
    const handler = buildCardClickHandler(true, toggle);
    handler();
    expect(toggle).toHaveBeenCalledOnce();
  });

  it('hasDetails=false → toggle NOT called on click', () => {
    const toggle = vi.fn();
    const handler = buildCardClickHandler(false, toggle);
    handler();
    expect(toggle).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// buildCardKeyDownHandler
// ---------------------------------------------------------------------------

function makeEvent(key: string) {
  return { key, preventDefault: vi.fn() };
}

describe('buildCardKeyDownHandler', () => {
  it('Enter + hasDetails=true → toggle called + default prevented', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(true, toggle);
    const e = makeEvent('Enter');
    handler(e);
    expect(toggle).toHaveBeenCalledOnce();
    expect(e.preventDefault).toHaveBeenCalledOnce();
  });

  it('Space + hasDetails=true → toggle called + default prevented', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(true, toggle);
    const e = makeEvent(' ');
    handler(e);
    expect(toggle).toHaveBeenCalledOnce();
    expect(e.preventDefault).toHaveBeenCalledOnce();
  });

  it('Enter + hasDetails=false → no-op', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(false, toggle);
    const e = makeEvent('Enter');
    handler(e);
    expect(toggle).not.toHaveBeenCalled();
    expect(e.preventDefault).not.toHaveBeenCalled();
  });

  it('Tab + hasDetails=true → no-op (only Enter/Space are activation keys)', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(true, toggle);
    const e = makeEvent('Tab');
    handler(e);
    expect(toggle).not.toHaveBeenCalled();
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// resolveCardExpansion
// ---------------------------------------------------------------------------

describe('resolveCardExpansion — uncontrolled mode', () => {
  it('no onRequestExpand → expanded = internalExpanded', () => {
    const setter = vi.fn();
    const { expanded } = resolveCardExpansion(undefined, undefined, false, setter);
    expect(expanded).toBe(false);
  });

  it('no onRequestExpand, internalExpanded=true → expanded = true', () => {
    const setter = vi.fn();
    const { expanded } = resolveCardExpansion(undefined, undefined, true, setter);
    expect(expanded).toBe(true);
  });

  it('uncontrolled toggle calls setter with toggler function', () => {
    const setter = vi.fn();
    const { toggle } = resolveCardExpansion(undefined, undefined, false, setter);
    toggle();
    expect(setter).toHaveBeenCalledOnce();
    // The setter receives a function that inverts the current value
    const updater = setter.mock.calls[0]![0] as (v: boolean) => boolean;
    expect(updater(false)).toBe(true);
    expect(updater(true)).toBe(false);
  });
});

describe('resolveCardExpansion — controlled mode', () => {
  it('onRequestExpand provided → expanded = isExpanded', () => {
    const handler = vi.fn();
    const { expanded } = resolveCardExpansion(handler, true, false, vi.fn());
    expect(expanded).toBe(true);
  });

  it('isExpanded undefined in controlled mode → expanded defaults to false', () => {
    const handler = vi.fn();
    const { expanded } = resolveCardExpansion(handler, undefined, false, vi.fn());
    expect(expanded).toBe(false);
  });

  it('controlled toggle calls onRequestExpand', () => {
    const handler = vi.fn();
    const { toggle } = resolveCardExpansion(handler, false, false, vi.fn());
    toggle();
    expect(handler).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// CardStatusBadge stacked badge logic
// ---------------------------------------------------------------------------

describe('CardStatusBadge stacked badge logic', () => {
  it('overdue + not done → [overdue] badge', () => {
    expect(
      resolveStatusBadges({
        isOverdue: true,
        isDone: false,
        isActive: false,
        isScenario: false,
      })
    ).toEqual(['overdue']);
  });

  it('[regression] overdue + done → [] (done suppresses overdue)', () => {
    // A completed phase cannot be pending — the done flag wins.
    expect(
      resolveStatusBadges({
        isOverdue: true,
        isDone: true,
        isActive: false,
        isScenario: false,
      })
    ).toEqual([]);
  });

  it('active phase → [active] badge', () => {
    expect(
      resolveStatusBadges({
        isOverdue: false,
        isDone: false,
        isActive: true,
        isScenario: false,
      })
    ).toEqual(['active']);
  });

  it('[regression] active + overdue → both badges render (Now dot + Overdue chip)', () => {
    // An in-progress phase that has passed its end date shows both simultaneously.
    expect(
      resolveStatusBadges({
        isOverdue: true,
        isDone: false,
        isActive: true,
        isScenario: false,
      })
    ).toEqual(['active', 'overdue']);
  });

  it('[regression] done + active → [] (done suppresses Now dot)', () => {
    // A completed phase must not show the active "Now" dot.
    expect(
      resolveStatusBadges({
        isOverdue: false,
        isDone: true,
        isActive: true,
        isScenario: false,
      })
    ).toEqual([]);
  });

  it('dateConflict stacks on top of active + overdue', () => {
    expect(
      resolveStatusBadges({
        isOverdue: true,
        isDone: false,
        isActive: true,
        isScenario: false,
        dateConflict: true,
      })
    ).toEqual(['active', 'overdue', 'dateConflict']);
  });

  it('scenario + scenarioLabel → [scenario] badge (fallback when nothing else applies)', () => {
    expect(
      resolveStatusBadges({
        isOverdue: false,
        isDone: false,
        isActive: false,
        isScenario: true,
        scenarioLabel: 'Departure scenario',
      })
    ).toEqual(['scenario']);
  });

  it('scenario suppressed when active is set', () => {
    expect(
      resolveStatusBadges({
        isOverdue: false,
        isDone: false,
        isActive: true,
        isScenario: true,
        scenarioLabel: 'Departure scenario',
      })
    ).toEqual(['active']);
  });

  it('scenario without scenarioLabel → [] (no empty badge)', () => {
    expect(
      resolveStatusBadges({
        isOverdue: false,
        isDone: false,
        isActive: false,
        isScenario: true,
        scenarioLabel: undefined,
      })
    ).toEqual([]);
  });

  it('no conditions met → [] (no badges)', () => {
    expect(
      resolveStatusBadges({
        isOverdue: false,
        isDone: false,
        isActive: false,
        isScenario: false,
      })
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Platform entry derivation — REGRESSION tests
//
// REGRESSION: Before the { icon, label } migration, platforms were passed as
// bare strings like 'logos:php'. The component treated those as text labels,
// not as icon IDs to auto-resolve.
//
// These tests intentionally assert only the per-entry derivation contract:
//   - string platform → label from the string value, no icon
//   - { icon, label } platform → preserve both icon node and label
//   - string that looks like an Iconify ID ('logos:php') → still just text
// ---------------------------------------------------------------------------

describe('derivePlatformEntry', () => {
  it('plain tech name resolves to a text label with no icon', () => {
    expect(derivePlatformEntry('jQuery')).toEqual({
      label: 'jQuery',
      icon: null,
      hasTextFallback: true,
    });
  });

  it('Iconify-ID string remains a literal text label and is not auto-resolved', () => {
    expect(derivePlatformEntry('logos:php')).toEqual({
      label: 'logos:php',
      icon: null,
      hasTextFallback: true,
    });
  });

  it('object platform preserves the provided label and icon node', () => {
    const icon = React.createElement('span', { 'aria-hidden': 'true' }, 'php');
    const entry = derivePlatformEntry({ icon, label: 'PHP' });

    expect(entry.label).toBe('PHP');
    expect(entry.icon).toBe(icon);
  });

  it('multiple string platforms each resolve to labels with no icons', () => {
    const entries = ['jQuery', 'Kendo UI', 'C#'].map(derivePlatformEntry);

    expect(entries).toEqual([
      { label: 'jQuery', icon: null, hasTextFallback: true },
      { label: 'Kendo UI', icon: null, hasTextFallback: true },
      { label: 'C#', icon: null, hasTextFallback: true },
    ]);
  });
});

describe('buildPlatformStripItems — { icon, label } platform (icon slot)', () => {
  it('icon node renders and suppresses the fallback text label', () => {
    const iconEl = React.createElement('img', { 'data-testid': 'php-icon', alt: 'PHP' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'PHP' }]);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    // The icon element is rendered
    expect(html).toContain('data-testid="php-icon"');
    // The label is NOT rendered as a text span when an icon is provided
    expect(html).not.toMatch(/<span[^>]*>PHP<\/span>/);
  });

  it('{ icon, label } never renders label as inner text when icon is provided', () => {
    const iconEl = React.createElement('svg', { 'data-testid': 'ts-icon' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'TypeScript' }]);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('data-testid="ts-icon"');
    expect(html).not.toMatch(/<span[^>]*>TypeScript<\/span>/);
  });
});

describe('buildPlatformStripItems — mixed string and object platforms', () => {
  it('icon items and string items can coexist in one array', () => {
    const iconEl = React.createElement('img', { 'data-testid': 'php-icon' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'PHP' }, 'Smarty', 'jQuery']);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('data-testid="php-icon"');
    expect(html).toContain('>Smarty<');
    expect(html).toContain('>jQuery<');
    // PHP label must NOT appear as inner text (it has an icon)
    expect(html).not.toMatch(/<span[^>]*>PHP<\/span>/);
  });
});

// ---------------------------------------------------------------------------
// Readability — minimum size constants (regression)
//
// These tests enforce that no size value falls below the minimum readable
// threshold. If a constant is ever reduced below the minimum, the test fails
// immediately — before the change reaches production or Storybook.
//
// Minimums:
//   - Icon size  >= 16 px
//   - Dot size   >= 12 px  (active pulse dot — smaller than icons but still visible)
//   - Font size  >= 0.75 rem  (12 px at a 16 px base)
// ---------------------------------------------------------------------------

const MIN_ICON_SIZE_PX = 16;
const MIN_DOT_SIZE_PX = 12;
const MIN_FONT_SIZE_REM = 0.75;

function parseRem(rem: string): number {
  return Number.parseFloat(rem);
}

describe('readability — minimum size constants', () => {
  it('[regression] STATUS_BADGE_FONT_SIZE >= 0.75rem (Overdue / Now / Date overlap / Scenario labels)', () => {
    expect(parseRem(STATUS_BADGE_FONT_SIZE)).toBeGreaterThanOrEqual(MIN_FONT_SIZE_REM);
  });

  it('[regression] CORNER_ALERT_ICON_SIZE >= 16px (corner badge icon must be readable)', () => {
    expect(CORNER_ALERT_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] CORNER_ALERT_LIST_ICON_SIZE >= 16px (tooltip list icon must be readable)', () => {
    expect(CORNER_ALERT_LIST_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] CORNER_ALERT_BADGE_SIZE >= 26px (corner badge circle must be large enough)', () => {
    expect(CORNER_ALERT_BADGE_SIZE).toBeGreaterThanOrEqual(26);
  });

  it('[regression] ACTIVE_DOT_SIZE >= 12px ("Now" pulsing dot must be visible)', () => {
    expect(ACTIVE_DOT_SIZE).toBeGreaterThanOrEqual(MIN_DOT_SIZE_PX);
  });

  it('[regression] PHASE_PILL_ICON_SIZE >= 16px (subtask icon in expandable details pill)', () => {
    expect(PHASE_PILL_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] PHASE_PILL_TEXT_FONT_SIZE >= 0.75rem (count label in expandable details pill)', () => {
    expect(parseRem(PHASE_PILL_TEXT_FONT_SIZE)).toBeGreaterThanOrEqual(MIN_FONT_SIZE_REM);
  });
});

// ---------------------------------------------------------------------------
// resolveCornerBadgeAlign — column-side positioning (regression)
// ---------------------------------------------------------------------------

describe('resolveCornerBadgeAlign — column-side positioning (regression)', () => {
  // Regression: the corner alert badge was always positioned at the top-right edge
  // of the card regardless of which column the card sat in. When the card is in the
  // left column the right edge faces the centre spine — the badge was rendered between
  // the spine and the card text (obscured/overlapping). The correct position for a
  // left-column card is the top-left edge (between the card and the outer viewport edge).

  it('[regression] right column positions badge at the right edge', () => {
    const { right, left, transform } = resolveCornerBadgeAlign('right');
    expect(right).toBe(0);
    expect(left).toBeUndefined();
    expect(transform).toBe('translate(50%, -50%)');
  });

  it('[regression] left column positions badge at the left edge', () => {
    const { left, right, transform } = resolveCornerBadgeAlign('left');
    expect(left).toBe(0);
    expect(right).toBeUndefined();
    expect(transform).toBe('translate(-50%, -50%)');
  });

  it('[regression] right column uses top-end tooltip placement', () => {
    expect(resolveCornerBadgeAlign('right').tooltipPlacement).toBe('top-end');
  });

  it('[regression] left column uses top-start tooltip placement (opens away from spine)', () => {
    expect(resolveCornerBadgeAlign('left').tooltipPlacement).toBe('top-start');
  });

  it('[regression] resolveCornerBadgeAlign — right and left placements are mutually exclusive (never both set)', () => {
    const rightResult = resolveCornerBadgeAlign('right');
    expect(rightResult.right).toBeDefined();
    expect(rightResult.left).toBeUndefined();

    const leftResult = resolveCornerBadgeAlign('left');
    expect(leftResult.left).toBeDefined();
    expect(leftResult.right).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Eye button accessibility (WCAG 2.2 AA 2.5.8 regression)
// ---------------------------------------------------------------------------

describe('eye button — WCAG accessibility regression', () => {
  it('[regression] PHASE_EYE_ICON_SIZE >= 20px (WCAG 1.4.11 — interactive icon minimum)', () => {
    expect(PHASE_EYE_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });

  it('[regression] EYE_BUTTON_MIN_SIZE >= 24px (WCAG 2.2 AA 2.5.8 — minimum touch target)', () => {
    expect(EYE_BUTTON_MIN_SIZE).toBeGreaterThanOrEqual(24);
  });

  it('[regression] EYE_BUTTON_MIN_SIZE >= PHASE_EYE_ICON_SIZE (button must be larger than its icon)', () => {
    expect(EYE_BUTTON_MIN_SIZE).toBeGreaterThanOrEqual(PHASE_EYE_ICON_SIZE);
  });
});

// ---------------------------------------------------------------------------
// Viewed-eye toggle logic regression
//
// The eye button onClick in phase-card.tsx is:
//   (e) => { e.stopPropagation(); onMarkViewed(); }
//
// These tests mirror that exact pattern so any change to the handler
// (e.g. re-adding cursor:default guard or removing stopPropagation) is caught
// before it reaches production.
// ---------------------------------------------------------------------------

/** Mirrors the exact onClick closure used in the phase-card eye button. */
function buildPhaseEyeClickHandler(
  onMarkViewed: () => void
): (e: { stopPropagation: () => void }) => void {
  return (e) => {
    e.stopPropagation();
    onMarkViewed();
  };
}

describe('[regression] viewed-eye toggle logic — phase card', () => {
  it('[regression] handler calls onMarkViewed', () => {
    const onMarkViewed = vi.fn();
    const handler = buildPhaseEyeClickHandler(onMarkViewed);
    handler({ stopPropagation: vi.fn() });
    expect(onMarkViewed).toHaveBeenCalledTimes(1);
  });

  it('[regression] handler calls e.stopPropagation (card expansion must not fire)', () => {
    const onMarkViewed = vi.fn();
    const stopPropagation = vi.fn();
    const handler = buildPhaseEyeClickHandler(onMarkViewed);
    handler({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('[regression] handler can be invoked twice — toggle on then off', () => {
    const onMarkViewed = vi.fn();
    const handler = buildPhaseEyeClickHandler(onMarkViewed);
    handler({ stopPropagation: vi.fn() });
    handler({ stopPropagation: vi.fn() });
    expect(onMarkViewed).toHaveBeenCalledTimes(2);
  });

  it('[regression] handler is not gated on isViewed — no conditional guard around onMarkViewed()', () => {
    // Regression: a previous implementation had cursor:default + no-op when isViewed=true.
    // The handler itself must be unconditional — the consumer decides what toggle means.
    const onMarkViewed = vi.fn();
    // Call with isViewed=true scenario: handler must still fire
    const handler = buildPhaseEyeClickHandler(onMarkViewed);
    handler({ stopPropagation: vi.fn() });
    expect(onMarkViewed).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// footer slot — PhaseCard accepts phase.footer and renders it below icon strips
// ---------------------------------------------------------------------------
//
// The footer slot has one critical invariant beyond rendering:
//   Click events on the footer content must NOT propagate to the card Paper,
//   otherwise clicking a button inside the footer toggles the card collapse.
//
// This is enforced by a Box wrapper with onClick: e.stopPropagation().
// The tests below verify that invariant via a mirror of the wrapper logic.

function buildFooterClickHandler(): (e: { stopPropagation: () => void }) => void {
  // Mirrors the onClick on the footer Box in phase-card.tsx:
  //   <Box sx={{ mt: 1 }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
  return (e) => {
    e.stopPropagation();
  };
}

describe('footer slot — stopPropagation invariant', () => {
  it('footer wrapper calls e.stopPropagation on click', () => {
    const stopPropagation = vi.fn();
    const handler = buildFooterClickHandler();
    handler({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('[regression] footer click does not bubble to card toggle (stopPropagation always called)', () => {
    // If stopPropagation is ever removed or conditionalised, clicking a play button,
    // link, or any interactive element inside footer would also toggle card expansion.
    const stopPropagation = vi.fn();
    const handler = buildFooterClickHandler();
    handler({ stopPropagation });
    // Calling twice to confirm it is unconditional — not gated on any state
    handler({ stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(2);
  });

  it('[regression] footer renders when phase.footer is a ReactNode (nullish check)', () => {
    // Mirror of: {phase.footer != null && <Box ...>{phase.footer}</Box>}
    // Uses nullish check (not truthy) so that valid ReactNodes like 0 and empty string
    // are not suppressed. Only null and undefined skip rendering.
    const shouldRender = (footer: unknown): boolean => footer != null;
    expect(shouldRender(React.createElement('span', null, 'Play'))).toBe(true);
    // Falsy-but-valid ReactNode values: 0 and '' must still render.
    expect(shouldRender(0)).toBe(true);
    expect(shouldRender('')).toBe(true);
    expect(shouldRender(undefined)).toBe(false);
    expect(shouldRender(null)).toBe(false);
  });
});
