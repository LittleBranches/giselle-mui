// @vitest-environment jsdom

/**
 * Integration tests for `sortOrder` prop in TimelineTwoColumn.
 *
 * These tests verify that the component **renders** milestone cards in the
 * expected order when `sortOrder` is `'asc'` or `'desc'`. This complements
 * the unit tests in `utils.test.ts` (which only test the sort helpers in
 * isolation) by locking in the component behaviour change — that the `sortOrder`
 * prop actually controls milestone render order in the DOM.
 *
 * Test strategy:
 * - MilestoneBadge is mocked to render the milestone title as visible text inside
 *   a `data-testid="ms-badge"` div. This lets us assert title order in the DOM
 *   without depending on the full MilestoneBadge implementation.
 * - The real `sortMilestonesAsc` / `sortMilestonesDesc` utilities run (no mock on
 *   `./utils`) so the integration is genuine.
 * - `createRoot` + `act` is used (consistent with other integration tests in this
 *   folder) because ResizeObserver and useEffect run in a real DOM environment.
 */

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { it, vi, expect, describe, afterEach } from 'vitest';

(globalThis as unknown as Record<string, unknown>)['IS_REACT_ACT_ENVIRONMENT'] = true;

// ── Module mocks ──────────────────────────────────────────────────────────
// MUI lab layout components render children through plain divs so DOM
// structure can be inspected. Box passes through data-col for column tests.

vi.mock('@mui/lab/Timeline', async () => {
  const m = await import('react');
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      m.createElement('div', { 'data-testid': 'tl-root' }, children),
  };
});

vi.mock('@mui/lab/TimelineItem', async () => {
  const m = await import('react');
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      m.createElement('li', { 'data-testid': 'tl-item' }, children),
  };
});

vi.mock('@mui/lab/TimelineContent', async () => {
  const m = await import('react');
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      m.createElement('div', { 'data-testid': 'tl-content' }, children),
  };
});

vi.mock('@mui/lab/TimelineSeparator', async () => {
  const m = await import('react');
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      m.createElement('div', null, children),
  };
});

vi.mock('@mui/lab/TimelineConnector', async () => {
  const m = await import('react');
  return {
    default: () => m.createElement('div', null),
  };
});

vi.mock('@mui/material/Box', async () => {
  const m = await import('react');
  return {
    default: (props: Record<string, unknown>) => {
      const attrs: Record<string, string> = {};
      if (typeof props['data-testid'] === 'string') attrs['data-testid'] = props['data-testid'];
      if (typeof props['data-col'] === 'string') attrs['data-col'] = props['data-col'];
      return m.createElement(
        'div',
        Object.keys(attrs).length > 0 ? attrs : undefined,
        props['children'] as React.ReactNode
      );
    },
  };
});

vi.mock('@mui/material/Tooltip', async () => {
  const m = await import('react');
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      m.createElement(m.Fragment, null, children),
  };
});

vi.mock('@mui/material/Typography', async () => {
  const m = await import('react');
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      m.createElement('span', null, children),
  };
});

vi.mock('./phase-card', () => ({ PhaseCard: () => null }));
vi.mock('./timeline-dot', () => ({ TimelineDot: () => null }));
vi.mock('./spine-connector', () => ({ SpineConnector: () => null }));

// MilestoneBadge renders the milestone title so we can assert ordering.
vi.mock('./milestone-badge', async () => {
  const m = await import('react');
  return {
    MilestoneBadge: ({ milestone }: { milestone: { title: string } }) =>
      m.createElement('div', { 'data-testid': 'ms-badge' }, milestone.title),
  };
});

// ── Test subject + types ──────────────────────────────────────────────────

import type { ReactElement } from 'react';
import type { TimelinePhase } from './types';

import { TimelineTwoColumn } from './timeline-two-column';

// ── Helpers ───────────────────────────────────────────────────────────────

const stubIcon = React.createElement('span', null) as unknown as ReactElement<{ width?: number }>;

/** A single phase with three milestones at different dates for sort testing. */
function makePhaseWithMilestones(): TimelinePhase {
  return {
    key: 1,
    title: 'Test Phase',
    description: '',
    date: 'Jan 2020 – Dec 2022',
    icon: stubIcon,
    side: 'right',
    milestones: [
      {
        date: 'Mar 2020',
        title: 'Earliest',
        icon: stubIcon,
        color: 'primary' as const,
      },
      {
        date: 'Aug 2021',
        title: 'Middle',
        icon: stubIcon,
        color: 'info' as const,
      },
      {
        date: 'Nov 2022',
        title: 'Latest',
        icon: stubIcon,
        color: 'success' as const,
      },
    ],
  };
}

const cleanups: Array<() => void> = [];

function renderTimeline(sortOrder: 'asc' | 'desc'): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(
      React.createElement(TimelineTwoColumn, {
        phases: [makePhaseWithMilestones()],
        sortOrder,
      })
    );
  });
  cleanups.push(() => {
    act(() => root.unmount());
    container.remove();
  });
  return container;
}

/** Returns milestone badge titles in DOM order. */
function badgeTitles(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-testid="ms-badge"]')).map(
    (el) => el.textContent ?? ''
  );
}

afterEach(() => {
  for (const cleanup of cleanups) cleanup();
  cleanups.length = 0;
});

// ── Tests ─────────────────────────────────────────────────────────────────

describe('sortOrder integration — milestone render order in DOM', () => {
  it('sortOrder="asc" renders milestones earliest-first (oldest at top)', () => {
    const container = renderTimeline('asc');
    const titles = badgeTitles(container);
    expect(titles).toEqual(['Earliest', 'Middle', 'Latest']);
  });

  it('sortOrder="desc" renders milestones latest-first (newest at top)', () => {
    const container = renderTimeline('desc');
    const titles = badgeTitles(container);
    expect(titles).toEqual(['Latest', 'Middle', 'Earliest']);
  });

  it('sortOrder="asc" vs sortOrder="desc" produce opposite milestone ordering', () => {
    const ascContainer = renderTimeline('asc');
    const descContainer = renderTimeline('desc');
    const ascTitles = badgeTitles(ascContainer);
    const descTitles = badgeTitles(descContainer);
    // Verify the two orderings are reversed — not just different.
    expect(ascTitles).toEqual([...descTitles].reverse());
  });

  it('[regression] default sort (no sortOrder prop) renders milestones latest-first', () => {
    // Default is sortOrder="desc" as declared in component props.
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    act(() => {
      root.render(
        React.createElement(TimelineTwoColumn, {
          phases: [makePhaseWithMilestones()],
          // sortOrder intentionally omitted — testing the default
        })
      );
    });
    cleanups.push(() => {
      act(() => root.unmount());
      container.remove();
    });
    const titles = badgeTitles(container);
    expect(titles).toEqual(['Latest', 'Middle', 'Earliest']);
  });
});
