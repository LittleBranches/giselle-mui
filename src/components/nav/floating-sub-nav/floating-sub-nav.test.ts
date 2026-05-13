// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import { FloatingSubNav } from './floating-sub-nav';
import { pillVariants } from './floating-sub-nav.animations';
import { SubNavButton } from './sub-nav-button';

// framer-motion uses browser APIs — mock AnimatePresence and motion to plain wrappers
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  motion: new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...rest }: { children?: React.ReactNode; [key: string]: unknown }) =>
          React.createElement(prop, rest, children),
    }
  ),
}));

// MUI components are mocked to avoid ThemeProvider / theme.vars requirements
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

// ----------------------------------------------------------------------

describe('NavPill — animation variants', () => {
  it('renders into the DOM via FloatingSubNav without throwing', () => {
    const html = renderToStaticMarkup(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    // NavPill renders the nav landmark and all buttons
    expect(html).toContain('aria-label="Section navigation"');
  });

  it('[regression] exit y-offset (10) is smaller than enter y-offset (20)', () => {
    // Intentional design rule: the pill exits with a shorter slide than it enters.
    // Entry feels like the pill is arriving; exit feels like a collapse, not a second entrance.
    const enterY = (pillVariants.initial as { y: number }).y;
    const exitY = (pillVariants.exit as { y: number }).y;
    expect(Math.abs(exitY)).toBeLessThan(Math.abs(enterY));
  });

  it('[regression] animate state has full opacity and zero offset', () => {
    const animate = pillVariants.animate as { opacity: number; y: number };
    expect(animate.opacity).toBe(1);
    expect(animate.y).toBe(0);
  });
});

// ----------------------------------------------------------------------

describe('SubNavButton', () => {
  const item = {
    id: 'about',
    label: 'About',
    icon: React.createElement('span', { 'data-testid': 'icon-about' }),
  };

  it('renders with correct aria-label', () => {
    const html = renderToStaticMarkup(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('aria-label="About"');
  });

  it('sets aria-pressed=false when inactive', () => {
    const html = renderToStaticMarkup(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('aria-pressed="false"');
  });

  it('sets aria-pressed=true when active', () => {
    const html = renderToStaticMarkup(
      React.createElement(SubNavButton, { item, isActive: true, onPress: vi.fn() })
    );
    expect(html).toContain('aria-pressed="true"');
  });

  it('renders icon slot content', () => {
    const html = renderToStaticMarkup(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('icon-about');
  });

  it('calls onPress with item.id when clicked', () => {
    const handlePress = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    act(() => {
      root.render(
        React.createElement(SubNavButton, { item, isActive: false, onPress: handlePress })
      );
    });
    const button = container.querySelector('button');
    act(() => {
      button?.click();
    });
    expect(handlePress).toHaveBeenCalledWith('about');
    act(() => root.unmount());
    container.remove();
  });
});
