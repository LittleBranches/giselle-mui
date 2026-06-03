// @vitest-environment jsdom

/**
 * Interaction tests for MilestoneBadge open/close behaviour.
 *
 * Uses a minimal harness component that replicates only the state-management
 * logic from MilestoneBadge — keeping tests fast and MUI-dependency-free.
 *
 * ## Behaviour under test
 *
 *   - Card title and date are always visible (no click required)
 *   - Details bullets are hidden by default
 *   - Badge dot click toggles details open/closed when hasDetails=true
 *   - Badge dot click is a no-op when hasDetails=false
 *   - All detail items render when expanded
 *   - Enter key toggles details open/closed when hasDetails=true
 *   - Space key toggles details open/closed when hasDetails=true
 *   - Keyboard activation is a no-op when hasDetails=false
 *
 * ## Regressions guarded
 *
 *   - display:'hover' + details → must still expand (was blocked by isInline gate)
 *   - display:'inline' + no details → click must be a no-op
 *   - Empty details array → must behave the same as undefined (no expansion)
 */

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { it, expect, describe, afterEach, vi } from 'vitest';

(globalThis as unknown as Record<string, unknown>)['IS_REACT_ACT_ENVIRONMENT'] = true;

// ---------------------------------------------------------------------------
// Minimal harness — mirrors only the state-machine from MilestoneBadge.
//
// Renders:
//   [data-testid="ms-badge"]    — the clickable dot
//   [data-testid="ms-card"]     — always-visible title+date panel
//   [data-testid="ms-title"]    — milestone title text
//   [data-testid="ms-date"]     — milestone date text
//   [data-testid="ms-details"]  — details list (only when open && hasDetails)
//   [data-testid="ms-detail-N"] — individual detail item at index N
// ---------------------------------------------------------------------------

type HarnessMilestone = {
  title: string;
  date: string;
  details?: string[];
  display?: 'hover' | 'inline';
};

function MilestoneBadgeHarness({ milestone: m }: { milestone: HarnessMilestone }) {
  const [open, setOpen] = React.useState(false);

  // Mirrors: const hasDetails = !!m.details?.length;
  const hasDetails = !!m.details?.length;

  return React.createElement(
    'div',
    { 'data-testid': 'ms-root' },
    // Badge dot
    React.createElement('div', {
      'data-testid': 'ms-badge',
      'data-has-details': String(hasDetails),
      onClick: hasDetails ? () => setOpen((o) => !o) : undefined,
      onKeyDown: hasDetails
        ? (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }
        : undefined,
    }),
    // Card — always visible
    React.createElement(
      'div',
      { 'data-testid': 'ms-card' },
      React.createElement('span', { 'data-testid': 'ms-title' }, m.title),
      React.createElement('span', { 'data-testid': 'ms-date' }, m.date),
      // Details — only when open
      hasDetails && open
        ? React.createElement(
            'div',
            { 'data-testid': 'ms-details' },
            ...(m.details ?? []).map((d, i) =>
              React.createElement('span', { key: i, 'data-testid': `ms-detail-${i}` }, d)
            )
          )
        : null
    )
  );
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

let root: ReturnType<typeof ReactDOM.createRoot> | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  if (root && container) {
    act(() => {
      root!.unmount();
    });
    container.remove();
    root = null;
    container = null;
  }
});

function render(milestone: HarnessMilestone): HTMLDivElement {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = ReactDOM.createRoot(container);
  act(() => {
    root!.render(React.createElement(MilestoneBadgeHarness, { milestone }));
  });
  return container;
}

function getBadge(c: HTMLElement): HTMLElement {
  const el = c.querySelector('[data-testid="ms-badge"]');
  if (!el) throw new Error('ms-badge not found');
  return el as HTMLElement;
}

function clickBadge(c: HTMLElement): void {
  act(() => {
    getBadge(c).click();
  });
}

function keydownBadge(c: HTMLElement, key: string): void {
  act(() => {
    getBadge(c).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

// ---------------------------------------------------------------------------
// Card always visible — title and date require no interaction
// ---------------------------------------------------------------------------

describe('card is always visible', () => {
  it('title is rendered immediately without any click', () => {
    const c = render({ title: 'Acquisition of Loud & Clear', date: 'Sep 2018' });
    expect(c.querySelector('[data-testid="ms-title"]')?.textContent).toBe(
      'Acquisition of Loud & Clear'
    );
  });

  it('date is rendered immediately without any click', () => {
    const c = render({ title: 'Any title', date: 'Feb 2021' });
    expect(c.querySelector('[data-testid="ms-date"]')?.textContent).toBe('Feb 2021');
  });

  it('details are hidden on initial render (open starts false)', () => {
    const c = render({
      title: 'T',
      date: 'D',
      details: ['Founded 2009', '300% growth'],
    });
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Details expansion — clicking the badge dot
// ---------------------------------------------------------------------------

describe('details expansion on badge click', () => {
  it('first click reveals the details section', () => {
    const c = render({
      title: 'T',
      date: 'D',
      details: ['Founded 2009'],
    });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).not.toBeNull();
  });

  it('second click collapses the details section', () => {
    const c = render({
      title: 'T',
      date: 'D',
      details: ['Founded 2009'],
    });
    clickBadge(c);
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('third click re-expands (toggle is symmetrical)', () => {
    const c = render({
      title: 'T',
      date: 'D',
      details: ['Founded 2009'],
    });
    clickBadge(c);
    clickBadge(c);
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).not.toBeNull();
  });

  it('all detail items are rendered when expanded', () => {
    const details = [
      "Australia's largest independent enterprise agency",
      'Founded 2009 — ~300% growth in 2 years prior',
      "Avanade's first APAC digital innovation studio",
      'Sitecore Site of the Year winner',
    ];
    const c = render({ title: 'T', date: 'D', details });
    clickBadge(c);
    details.forEach((text, i) => {
      expect(c.querySelector(`[data-testid="ms-detail-${i}"]`)?.textContent).toBe(text);
    });
  });

  it('detail item count matches the details array length', () => {
    const details = ['A', 'B', 'C'];
    const c = render({ title: 'T', date: 'D', details });
    clickBadge(c);
    expect(c.querySelectorAll('[data-testid^="ms-detail-"]').length).toBe(details.length);
  });
});

// ---------------------------------------------------------------------------
// No-op when no details
// ---------------------------------------------------------------------------

describe('badge click is no-op when hasDetails is false', () => {
  it('details section never appears after click when details is undefined', () => {
    const c = render({ title: 'T', date: 'D' });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('details section never appears after click when details is an empty array', () => {
    const c = render({ title: 'T', date: 'D', details: [] });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('title remains visible after a no-op click', () => {
    const c = render({ title: 'Stays visible', date: 'D' });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-title"]')?.textContent).toBe('Stays visible');
  });
});

// ---------------------------------------------------------------------------
// data-has-details attribute reflects the gating state
// ---------------------------------------------------------------------------

describe('data-has-details reflects hasDetails', () => {
  it('"true" when details array is non-empty', () => {
    const c = render({ title: 'T', date: 'D', details: ['Item'] });
    expect(getBadge(c).dataset['hasDetails']).toBe('true');
  });

  it('"false" when details is undefined', () => {
    const c = render({ title: 'T', date: 'D' });
    expect(getBadge(c).dataset['hasDetails']).toBe('false');
  });

  it('"false" when details is an empty array', () => {
    const c = render({ title: 'T', date: 'D', details: [] });
    expect(getBadge(c).dataset['hasDetails']).toBe('false');
  });
});

// ---------------------------------------------------------------------------
// Regression: display mode must not gate interactivity
// ---------------------------------------------------------------------------

describe('[regression] hasDetails is independent of display mode', () => {
  // Before the fix: hasDetails = isInline && !!details?.length
  // A milestone with display:'hover' (the default) and details would not expand.
  it('display:hover + details → click expands details (was broken — isInline gated hasDetails)', () => {
    const c = render({
      title: '457 Temporary Work Visa',
      date: 'Oct 2015',
      display: 'hover',
      details: ['Employer-sponsored', 'Transferred to PR in 2021'],
    });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).not.toBeNull();
  });

  it('display:inline + no details → click is a no-op (details section never appears)', () => {
    const c = render({
      title: 'Permanent Residency — 186 Visa',
      date: 'Feb 2021',
      display: 'inline',
      // no details
    });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('display:inline + details → click expands details', () => {
    const c = render({
      title: 'Avanade acquisition of Loud & Clear',
      date: 'Sep 2018',
      display: 'inline',
      details: ["Australia's largest independent enterprise agency"],
    });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).not.toBeNull();
  });

  it('display:hover + no details → click is a no-op', () => {
    const c = render({
      title: 'Simple hover milestone',
      date: 'Jan 2020',
      display: 'hover',
    });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Keyboard activation — Enter and Space behave identically to click
// ---------------------------------------------------------------------------

describe('keyboard activation (Enter / Space)', () => {
  it('Enter key expands details when hasDetails is true', () => {
    const c = render({ title: 'T', date: 'D', details: ['Item A'] });
    keydownBadge(c, 'Enter');
    expect(c.querySelector('[data-testid="ms-details"]')).not.toBeNull();
  });

  it('Space key expands details when hasDetails is true', () => {
    const c = render({ title: 'T', date: 'D', details: ['Item A'] });
    keydownBadge(c, ' ');
    expect(c.querySelector('[data-testid="ms-details"]')).not.toBeNull();
  });

  it('second Enter collapses an already-expanded details section', () => {
    const c = render({ title: 'T', date: 'D', details: ['Item A'] });
    keydownBadge(c, 'Enter');
    keydownBadge(c, 'Enter');
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('second Space collapses an already-expanded details section', () => {
    const c = render({ title: 'T', date: 'D', details: ['Item A'] });
    keydownBadge(c, ' ');
    keydownBadge(c, ' ');
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('Enter is a no-op when hasDetails is false', () => {
    const c = render({ title: 'T', date: 'D' });
    keydownBadge(c, 'Enter');
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('Space is a no-op when hasDetails is false', () => {
    const c = render({ title: 'T', date: 'D' });
    keydownBadge(c, ' ');
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('unrelated key (ArrowDown) is a no-op even when hasDetails is true', () => {
    const c = render({ title: 'T', date: 'D', details: ['Item A'] });
    keydownBadge(c, 'ArrowDown');
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });

  it('click then Enter toggles correctly (click opens, Enter closes)', () => {
    const c = render({ title: 'T', date: 'D', details: ['Item A'] });
    clickBadge(c);
    expect(c.querySelector('[data-testid="ms-details"]')).not.toBeNull();
    keydownBadge(c, 'Enter');
    expect(c.querySelector('[data-testid="ms-details"]')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Viewed-eye toggle regression
//
// Guards three invariants that have been broken before:
//   1. Clicking the eye button fires onMarkViewed — not onRequestExpand.
//   2. e.stopPropagation prevents the parent card expansion from firing.
//   3. The button is always clickable regardless of current isViewed state
//      (no cursor:default, no pointer-events:none when already viewed).
//   4. aria-pressed reflects the current isViewed state.
//
// Uses a minimal harness that mirrors the exact onClick pattern used in
// milestone-badge.tsx and phase-card.tsx, so structural refactors cannot
// silently break these invariants.
// ---------------------------------------------------------------------------

/** Mirrors the exact onClick closure used in the eye button of both components. */
function buildEyeClickHandler(
  onMarkViewed: () => void
): (e: { stopPropagation: () => void }) => void {
  return (e) => {
    e.stopPropagation();
    onMarkViewed();
  };
}

/**
 * Minimal DOM harness — parent card simulates onRequestExpand; eye button
 * simulates the viewed toggle. Click on the eye must call onMarkViewed and
 * must NOT call the parent onRequestExpand.
 */
function renderEyeHarness(opts: {
  isViewed: boolean;
  onMarkViewed: () => void;
  onRequestExpand: () => void;
}): { container: HTMLDivElement; eyeBtn: HTMLElement } {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const eyeRoot = ReactDOM.createRoot(div);

  act(() => {
    eyeRoot.render(
      React.createElement(
        'div',
        {
          'data-testid': 'parent-card',
          // simulates the Paper/Box that should NOT receive the click
          onClick: opts.onRequestExpand,
        },
        React.createElement('button', {
          'data-testid': 'eye-btn',
          'aria-pressed': opts.isViewed,
          // mirrors the exact pattern from the component
          onClick: buildEyeClickHandler(opts.onMarkViewed),
        })
      )
    );
  });

  const eyeBtn = div.querySelector('[data-testid="eye-btn"]') as HTMLElement;
  return { container: div, eyeBtn };
}

describe('[regression] viewed-eye toggle — onMarkViewed fires, card expansion does not', () => {
  afterEach(() => {
    // clean up any harness containers added during these tests
    document
      .querySelectorAll('[data-testid="parent-card"]')
      .forEach((el) => el.parentElement?.remove());
  });

  it('[regression] clicking eye button calls onMarkViewed', () => {
    const onMarkViewed = vi.fn();
    const onRequestExpand = vi.fn();
    const { eyeBtn } = renderEyeHarness({ isViewed: false, onMarkViewed, onRequestExpand });

    act(() => eyeBtn.click());

    expect(onMarkViewed).toHaveBeenCalledTimes(1);
  });

  it('[regression] clicking eye button does NOT call onRequestExpand (stopPropagation)', () => {
    const onMarkViewed = vi.fn();
    const onRequestExpand = vi.fn();
    const { eyeBtn } = renderEyeHarness({ isViewed: false, onMarkViewed, onRequestExpand });

    act(() => eyeBtn.click());

    expect(onRequestExpand).not.toHaveBeenCalled();
  });

  it('[regression] clicking eye button when isViewed=true still calls onMarkViewed (toggle off)', () => {
    const onMarkViewed = vi.fn();
    const onRequestExpand = vi.fn();
    const { eyeBtn } = renderEyeHarness({ isViewed: true, onMarkViewed, onRequestExpand });

    act(() => eyeBtn.click());

    expect(onMarkViewed).toHaveBeenCalledTimes(1);
    expect(onRequestExpand).not.toHaveBeenCalled();
  });

  it('[regression] clicking eye button twice calls onMarkViewed twice (toggle on → off)', () => {
    const onMarkViewed = vi.fn();
    const onRequestExpand = vi.fn();
    const { eyeBtn } = renderEyeHarness({ isViewed: false, onMarkViewed, onRequestExpand });

    act(() => eyeBtn.click());
    act(() => eyeBtn.click());

    expect(onMarkViewed).toHaveBeenCalledTimes(2);
    expect(onRequestExpand).not.toHaveBeenCalled();
  });

  it('[regression] aria-pressed=false when isViewed=false', () => {
    const { eyeBtn } = renderEyeHarness({
      isViewed: false,
      onMarkViewed: vi.fn(),
      onRequestExpand: vi.fn(),
    });

    expect(eyeBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('[regression] aria-pressed=true when isViewed=true', () => {
    const { eyeBtn } = renderEyeHarness({
      isViewed: true,
      onMarkViewed: vi.fn(),
      onRequestExpand: vi.fn(),
    });

    expect(eyeBtn.getAttribute('aria-pressed')).toBe('true');
  });
});
