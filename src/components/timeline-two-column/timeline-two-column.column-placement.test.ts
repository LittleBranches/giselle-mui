// @vitest-environment jsdom

/**
 * Column placement tests for milestone rows in TimelineTwoColumn.
 *
 * Invariant — milestones must always render in the OPPOSITE visual column
 * from their parent phase card, INSIDE the same TimelineItem:
 *   - Phase side='right' → phase card in LEFT column  → milestones in RIGHT column
 *   - Phase side='left'  → phase card in RIGHT column → milestones in LEFT column
 *
 * Why opposite, and inside the same row? Milestones belong to a period. Rendering
 * them as separate rows (flatMap) causes them to appear BELOW the phase card in
 * the DOM flow — outside the visual period. Putting them in the opposite column of
 * the same TimelineItem keeps them visually alongside the period card.
 *
 * DOM structure per phase (ONE <li data-testid="tl-item"> containing nested flex rows):
 *   <li data-testid="tl-item">
 *     <div>  ← phase row (flex row)
 *       <div data-col="left">    ← phase card cell
 *       <div data-col="center"> ← phase dot + spine
 *       <div data-col="right">  ← empty or phase card (side='left')
 *     <div>  ← milestone row 0 (flex row)
 *       <div data-col="left">    ← milestone card or empty
 *       <div data-col="center"> ← ms dot + spine
 *       <div data-col="right">  ← milestone card or empty
 *   </li>
 *
 * badgeColumnIndex finds [data-col] ancestor of ms-badge:
 *   data-col="left"  → 0, data-col="right" → 2
 */

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { it, vi, expect, describe, afterEach } from 'vitest';

(globalThis as unknown as Record<string, unknown>)['IS_REACT_ACT_ENVIRONMENT'] = true;

// ── Module mocks ──────────────────────────────────────────────────────────
// MUI lab layout components render children through tagged divs so DOM
// position can be tested. Box (used by TimelineColumn) renders a plain div.
// Local component deps render as null — only MilestoneBadge needs a marker.

vi.mock('@mui/lab/Timeline', async () => {
  const m = await import('react');
  return {
    default: ({ children }: { children?: React.ReactNode }) =>
      m.createElement('div', { 'data-testid': 'tl-root' }, children),
  };
});

vi.mock('@mui/material/Box', async () => {
  const m = await import('react');
  return {
    // Pass through data-testid and data-col so structural assertions work.
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

vi.mock('./phase-card', () => ({ PhaseCard: () => null }));
vi.mock('./timeline-dot', () => ({ TimelineDot: () => null }));
vi.mock('./spine-connector', () => ({ SpineConnector: () => null }));

vi.mock('./milestone-badge', async () => {
  const m = await import('react');
  return {
    MilestoneBadge: () => m.createElement('div', { 'data-testid': 'ms-badge' }),
  };
});

vi.mock('./utils', () => ({
  sortPhasesByDate: (phases: unknown[]) => phases,
  sortMilestonesAsc: (milestones: unknown[]) => milestones,
  sortMilestonesDesc: (milestones: unknown[]) => milestones,
  detectPhaseOverlaps: () => new Map(),
  parseFirstDate: () => null,
  getLastYear: () => null,
  parseLastDate: () => null,
}));

// ── Test subject + types ──────────────────────────────────────────────────

import type { ReactElement } from 'react';
import type { TimelinePhase } from './types';

import { TimelineTwoColumn } from './timeline-two-column';

// ── Helpers ───────────────────────────────────────────────────────────────

const stubIcon = React.createElement('span', null) as unknown as ReactElement<{ width?: number }>;

function makePhase(side: 'left' | 'right'): TimelinePhase {
  return {
    key: 1,
    title: 'Test Phase',
    description: '',
    date: 'Jan 2020',
    icon: stubIcon,
    side,
    milestones: [
      {
        date: 'Mar 2020',
        title: 'A Milestone',
        icon: stubIcon,
        color: 'info' as const,
      },
    ],
  };
}

const cleanups: Array<() => void> = [];

function renderAndMount(side: 'left' | 'right'): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);
  act(() => {
    root.render(React.createElement(TimelineTwoColumn, { phases: [makePhase(side)] }));
  });
  cleanups.push(() => {
    act(() => root.unmount());
    container.remove();
  });
  return container;
}

/**
 * Returns the column index of the cell containing data-testid="ms-badge".
 *   0 = LEFT (data-col="left"), 2 = RIGHT (data-col="right"), -1 = not found.
 * Uses [data-col] ancestor traversal — works for any nested DOM structure.
 */
function badgeColumnIndex(tlItem: Element): number {
  const badge = tlItem.querySelector('[data-testid="ms-badge"]');
  if (!badge) return -1;
  const cell = badge.closest('[data-col]') as HTMLElement | null;
  const col = cell?.dataset['col'];
  if (col === 'left') return 0;
  if (col === 'right') return 2;
  return 1;
}

afterEach(() => {
  for (const cleanup of cleanups) cleanup();
  cleanups.length = 0;
});

// ── Tests ─────────────────────────────────────────────────────────────────

describe('milestone opposite-column placement', () => {
  it('phase side=right → phase card in LEFT col (0) → milestone must be in RIGHT col (2)', () => {
    const container = renderAndMount('right');
    const items = container.querySelectorAll('[data-testid="tl-item"]');
    // One TimelineItem per phase — milestones are INSIDE the phase row, not separate rows.
    expect(items).toHaveLength(1);
    expect(badgeColumnIndex(items[0]!)).toBe(2);
  });

  it('phase side=left → phase card in RIGHT col (2) → milestone must be in LEFT col (0)', () => {
    const container = renderAndMount('left');
    const items = container.querySelectorAll('[data-testid="tl-item"]');
    expect(items).toHaveLength(1);
    expect(badgeColumnIndex(items[0]!)).toBe(0);
  });

  it('milestone column is never the same as its parent phase card column', () => {
    // Phase card column: side=right → col 0 (left), side=left → col 2 (right).
    const phaseCardCol: Record<'left' | 'right', number> = { right: 0, left: 2 };
    for (const side of ['left', 'right'] as const) {
      const container = renderAndMount(side);
      const items = container.querySelectorAll('[data-testid="tl-item"]');
      expect(badgeColumnIndex(items[0]!)).not.toBe(phaseCardCol[side]);
    }
  });
});
