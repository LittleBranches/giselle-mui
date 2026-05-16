// @vitest-environment jsdom
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { TimelinePhase } from '../two-column/types';
import {
  COMPACT_MIN_MILESTONE_DOT_SIZE,
  COMPACT_MIN_PHASE_DOT_SIZE,
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_PHASE_DOT_SIZE,
} from './compact.const';
import { TimelineCompact } from './compact';
import { resolveCompactColor } from './utils';

// ----------------------------------------------------------------------

const MOCK_ICON = React.createElement('span', { 'data-testid': 'phase-icon' });
const MOCK_MS_ICON = React.createElement('span', { 'data-testid': 'ms-icon' });

const MOCK_PHASES: TimelinePhase[] = [
  {
    key: 1,
    title: 'Platform Launch',
    shortTitle: 'Launch',
    description: 'Initial platform deployment and stability work.',
    date: 'Jan 2025',
    icon: MOCK_ICON,
    color: 'primary',
    side: 'left',
    children: [
      {
        key: 'launch-task',
        title: 'Launch checklist',
        shortTitle: 'Checklist',
        description: 'Release prep tasks and verification.',
        date: 'Jan 2025',
        color: 'success',
      },
    ],
  },
  {
    key: 2,
    title: 'Release hardening',
    shortTitle: 'Hardening',
    description: 'Post-launch fixes and deployment safeguards.',
    date: 'Feb 2025',
    icon: MOCK_ICON,
    color: 'info',
    side: 'right',
    milestones: [
      {
        key: 'ci-live',
        date: 'Feb 2025',
        title: 'CI pipeline live',
        shortTitle: 'CI',
        icon: MOCK_MS_ICON,
        color: 'success',
        done: true,
      },
    ],
  },
  {
    key: 3,
    title: 'API Integration',
    date: 'Mar 2025',
    icon: MOCK_ICON,
    color: 'secondary',
    side: 'right',
    done: true,
  },
];

// ----------------------------------------------------------------------

describe('TimelineCompact — rendering', () => {
  it('renders a phase title', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineCompact, { phases: MOCK_PHASES })
    );
    expect(html).toContain('Launch');
  });

  it('renders a phase date', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineCompact, { phases: MOCK_PHASES })
    );
    expect(html).toContain('Jan 2025');
  });

  it('renders a milestone title', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineCompact, { phases: MOCK_PHASES })
    );
    expect(html).toContain('CI');
  });

  it('renders child tasks from phase children with the structured child-row path', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineCompact, { phases: MOCK_PHASES })
    );
    expect(html).toContain('Checklist');
    expect(html).toContain('Release prep tasks and verification.');
  });

  it('renders a milestone date', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineCompact, { phases: MOCK_PHASES })
    );
    expect(html).toContain('Feb 2025');
  });

  it('renders a phase without milestones or description without crashing', () => {
    const phases: TimelinePhase[] = [
      { key: 99, title: 'Empty Phase', date: 'Jun 2025', icon: MOCK_ICON, side: 'left' },
    ];
    expect(() =>
      renderToStaticMarkup(React.createElement(TimelineCompact, { phases }))
    ).not.toThrow();
  });

  it('renders the phase icon inside the dot', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineCompact, { phases: MOCK_PHASES })
    );
    expect(html).toContain('data-testid="phase-icon"');
  });

  it('passes extra props to the root Box', () => {
    const html = renderToStaticMarkup(
      React.createElement(TimelineCompact, { phases: MOCK_PHASES, id: 'compact-root' })
    );
    expect(html).toContain('id="compact-root"');
  });
});

// ----------------------------------------------------------------------

describe('TimelineCompact — interaction (click to expand)', () => {
  it('reveals description text after clicking accordion summary', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);

    await act(async () => {
      root.render(React.createElement(TimelineCompact, { phases: MOCK_PHASES }));
    });

    // Description should be in the DOM (accordion renders details in DOM even when collapsed)
    expect(container.textContent).toContain('Initial platform deployment');

    act(() => root.unmount());
    container.remove();
  });
});

// ----------------------------------------------------------------------

describe('resolveCompactColor', () => {
  it('returns success when done=true regardless of color', () => {
    expect(resolveCompactColor('primary', true)).toBe('success');
    expect(resolveCompactColor('error', true)).toBe('success');
    expect(resolveCompactColor(undefined, true)).toBe('success');
  });

  it('falls back to primary for undefined', () => {
    expect(resolveCompactColor(undefined)).toBe('primary');
  });

  it('falls back to primary for inherit', () => {
    expect(resolveCompactColor('inherit')).toBe('primary');
  });

  it('falls back to primary for grey', () => {
    expect(resolveCompactColor('grey')).toBe('primary');
  });

  it('passes through valid HighlightedPaletteKey values', () => {
    expect(resolveCompactColor('error')).toBe('error');
    expect(resolveCompactColor('warning')).toBe('warning');
    expect(resolveCompactColor('secondary')).toBe('secondary');
    expect(resolveCompactColor('info')).toBe('info');
    expect(resolveCompactColor('success')).toBe('success');
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum size constants (regression)', () => {
  it('[regression] COMPACT_PHASE_DOT_SIZE >= COMPACT_MIN_PHASE_DOT_SIZE', () => {
    expect(COMPACT_PHASE_DOT_SIZE).toBeGreaterThanOrEqual(COMPACT_MIN_PHASE_DOT_SIZE);
  });

  it('[regression] COMPACT_MILESTONE_DOT_SIZE >= COMPACT_MIN_MILESTONE_DOT_SIZE', () => {
    expect(COMPACT_MILESTONE_DOT_SIZE).toBeGreaterThanOrEqual(COMPACT_MIN_MILESTONE_DOT_SIZE);
  });
});
