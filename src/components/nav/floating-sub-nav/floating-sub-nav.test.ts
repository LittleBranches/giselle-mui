// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { FloatingSubNav } from './floating-sub-nav';

// framer-motion uses browser APIs — mock AnimatePresence and motion to plain wrappers
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  motion: new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...rest }: Record<string, unknown>) =>
          React.createElement(prop as string, rest, children as React.ReactNode),
    }
  ),
}));

// MUI components are mocked to avoid CssVarsProvider / theme.vars requirements
vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    ...props
  }: React.PropsWithChildren<{ sx?: unknown; [key: string]: unknown }>) =>
    React.createElement('div', props, children),
}));

vi.mock('@mui/material/Stack', () => ({
  default: ({
    children,
    sx: _sx,
    direction: _d,
    alignItems: _a,
    spacing: _s,
    component: _c,
    initial: _i,
    animate: _an,
    exit: _ex,
    transition: _tr,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement('div', props, children),
}));

vi.mock('@mui/material/Tooltip', () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) =>
    React.createElement('span', { 'data-tooltip': title }, children),
}));

vi.mock('@mui/material/ButtonBase', () => ({
  default: ({
    children,
    sx: _sx,
    disableRipple: _dr,
    ...props
  }: React.PropsWithChildren<{ sx?: unknown; [key: string]: unknown }>) =>
    React.createElement('button', props, children),
}));

// ----------------------------------------------------------------------

const items = [
  {
    id: 'about',
    label: 'About',
    icon: React.createElement('span', { 'data-testid': 'icon-about' }),
  },
  { id: 'work', label: 'Work', icon: React.createElement('span', { 'data-testid': 'icon-work' }) },
];

describe('FloatingSubNav', () => {
  it('renders nav buttons when activeId is set', () => {
    const html = renderToStaticMarkup(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('About');
    expect(html).toContain('Work');
  });

  it('renders nothing when activeId is null', () => {
    const html = renderToStaticMarkup(
      React.createElement(FloatingSubNav, {
        items,
        activeId: null,
        onSelect: vi.fn(),
      })
    );
    expect(html).not.toContain('About');
  });

  it('renders sticky variant without error', () => {
    expect(() =>
      renderToStaticMarkup(
        React.createElement(FloatingSubNav, {
          items,
          activeId: 'about',
          onSelect: vi.fn(),
          sticky: true,
        })
      )
    ).not.toThrow();
  });

  it('renders icon slot content for each item', () => {
    const html = renderToStaticMarkup(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('icon-about');
    expect(html).toContain('icon-work');
  });

  it('sets aria-pressed=true on active item', () => {
    const html = renderToStaticMarkup(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    // The active button has aria-pressed="true"
    expect(html).toContain('aria-pressed="true"');
  });
});
