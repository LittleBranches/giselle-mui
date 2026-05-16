// @vitest-environment jsdom

/**
 * Unit tests for TimelineDot.
 *
 * ## Strategy
 *
 * TimelineDot uses `theme.vars.palette.*` inside its sx callbacks, so both Box
 * instances are mocked to render plain divs. renderToStaticMarkup is used for
 * structure and attribute assertions; ReactDOM.createRoot + act is used for
 * interaction tests.
 *
 * ## Behaviour under test
 *
 *   - Renders without crashing for all size and state combinations
 *   - data-active="true" is present on the root element when active=true and size='phase'
 *   - data-active is absent when active=false (phase size)
 *   - data-active is absent when active=true but size='milestone' (milestones never pulse)
 *   - Done state renders a checkmark polyline, not the icon
 *   - onClick fires when the dot is clicked
 *   - onKeyDown fires on Enter / Space
 */

import React from 'react';
import { it, vi, expect, describe } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { act } from 'react';
import ReactDOM from 'react-dom/client';

// ---------------------------------------------------------------------------
// Minimal MUI mocks — render plain HTML so renderToStaticMarkup works
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    component: _component,
    viewBox: _viewBox,
    fill: _fill,
    stroke: _stroke,
    strokeWidth: _sw,
    strokeLinecap: _slc,
    strokeLinejoin: _slj,
    ...rest
  }: {
    children?: unknown;
    sx?: unknown;
    component?: string;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    [key: string]: unknown;
  }) => React.createElement('div', rest as Record<string, unknown>, children as React.ReactNode),
}));

// Import AFTER mocks are registered.
import { TimelineDot, resolveEffectiveColor } from './timeline-dot';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function render(props: Parameters<typeof TimelineDot>[0]): string {
  return renderToStaticMarkup(React.createElement(TimelineDot, props));
}

// ---------------------------------------------------------------------------
// Rendering — smoke tests
// ---------------------------------------------------------------------------

describe('TimelineDot — rendering', () => {
  it('renders without crashing with defaults', () => {
    expect(() => render({})).not.toThrow();
  });

  it('renders without crashing for each palette color', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const color of colors) {
      expect(() => render({ color })).not.toThrow();
    }
  });

  it('renders without crashing for milestone size', () => {
    expect(() => render({ size: 'milestone' })).not.toThrow();
  });

  it('renders without crashing in done state', () => {
    expect(() => render({ done: true })).not.toThrow();
  });

  it('renders without crashing in active state', () => {
    expect(() => render({ active: true })).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// data-active attribute — pulsing ring indicator
// ---------------------------------------------------------------------------

describe('TimelineDot — data-active attribute', () => {
  it('sets data-active="true" on root when active=true and size=phase (default)', () => {
    const html = render({ active: true });
    expect(html).toContain('data-active="true"');
  });

  it('does not set data-active when active=false (default)', () => {
    const html = render({ active: false });
    expect(html).not.toContain('data-active');
  });

  it('does not set data-active when active=true but size=milestone', () => {
    // Milestone dots never show a pulsing ring — the ring would be visually
    // inappropriate at that scale, and the invariant is: ring = phase dots only.
    const html = render({ active: true, size: 'milestone' });
    expect(html).not.toContain('data-active');
  });

  it('does not set data-active when active is undefined', () => {
    const html = render({});
    expect(html).not.toContain('data-active');
  });
});

// ---------------------------------------------------------------------------
// Done state — checkmark
// ---------------------------------------------------------------------------

describe('TimelineDot — done state', () => {
  it('renders a checkmark polyline when done=true', () => {
    const html = render({ done: true });
    expect(html).toContain('points="20 6 9 17 4 12"');
  });

  it('does not render checkmark polyline when done=false', () => {
    const html = render({ done: false });
    expect(html).not.toContain('points="20 6 9 17 4 12"');
  });
});

// ---------------------------------------------------------------------------
// Interaction — onClick and onKeyDown
// ---------------------------------------------------------------------------

describe('TimelineDot — interaction', () => {
  it('fires onClick when the root element is clicked', () => {
    const onClick = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);

    act(() => {
      root.render(React.createElement(TimelineDot, { onClick }));
    });

    const div = container.querySelector('div');
    act(() => {
      div?.click();
    });

    expect(onClick).toHaveBeenCalledOnce();

    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
  });

  it('fires onKeyDown when a key is pressed on the root element', () => {
    const onKeyDown = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);

    act(() => {
      root.render(React.createElement(TimelineDot, { onKeyDown, tabIndex: 0 }));
    });

    const div = container.querySelector('div');
    act(() => {
      div?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    expect(onKeyDown).toHaveBeenCalledOnce();

    act(() => {
      root.unmount();
    });
    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------
// resolveEffectiveColor — done-dot color enforcement (regression)
// ---------------------------------------------------------------------------

describe('resolveEffectiveColor — done-dot color enforcement (regression)', () => {
  // Regression: done phase and milestone dots were grayed out instead of green
  // because the parent applied grayscale AND the color prop was not forced to
  // 'success' when done=true. This describe block ensures the contract is never
  // silently broken again.

  it('[regression] done=true always returns success regardless of the color prop', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const color of colors) {
      expect(resolveEffectiveColor(color, true)).toBe('success');
    }
  });

  it('[regression] done=false returns the passed color unchanged', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const color of colors) {
      expect(resolveEffectiveColor(color, false)).toBe(color);
    }
  });

  it('[regression] done=true with color=error still returns success (overdue done dots must be green)', () => {
    // An overdue item that was also marked done should show a green checkmark,
    // not a red dot — the done state always wins.
    expect(resolveEffectiveColor('error', true)).toBe('success');
  });

  it('[regression] done=true renders a checkmark regardless of the color prop (behavior)', () => {
    // Regardless of what color the data specifies, done=true must always
    // render the checkmark SVG — not the icon supplied by the data.
    const html = render({ done: true, color: 'error' });
    expect(html).toContain('points="20 6 9 17 4 12"');
  });
});
