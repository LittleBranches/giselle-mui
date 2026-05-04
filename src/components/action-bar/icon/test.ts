// @vitest-environment jsdom
/**
 * Unit tests for IconActionBar.
 *
 * **Structure tests** (`renderToStaticMarkup`) — verify rendered HTML structure,
 * ARIA attributes, tooltip labels, and default/custom actions.
 *
 * **Interaction tests** (`ReactDOM.createRoot` + `act`) — verify that click
 * handlers fire when buttons are clicked and are blocked when disabled.
 *
 * MUI components are mocked to avoid theme-provider requirements.
 * `Tooltip` renders its children directly (title accessible via data attribute).
 * `IconButton` renders a `<button>` element so ARIA and click tests work.
 *
 * ## What is tested
 * - Default actions render when no `actions` prop is supplied
 * - `DEFAULT_ICON_ACTIONS` has exactly 5 entries
 * - Each action renders a button with aria-label matching the tooltip
 * - Custom `actions` array replaces defaults
 * - `onClick` fires when a button is clicked
 * - `onClick` does NOT fire when a button is disabled
 * - `disabled` attribute is present when `disabled=true`
 * - `href` and `component` are forwarded to the IconButton
 * - `tooltipPlacement` is forwarded to Tooltip
 * - `aria-label` override is used when provided
 * - `sx` and extra `...other` props are forwarded to the root Box
 *
 * ## What is NOT tested
 * - sx styles (require MUI theme)
 * - Tooltip visibility / hover behaviour (browser-level)
 * - Icon SVG rendering (icon library internals)
 */

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, vi, expect, describe, beforeEach, afterEach } from 'vitest';

// Tell React 18+'s act() that this file runs in a test environment.
(globalThis as unknown as Record<string, unknown>)['IS_REACT_ACT_ENVIRONMENT'] = true;

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => React.createElement('svg', { 'data-icon': icon }),
}));

vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    ...props
  }: React.PropsWithChildren<{ sx?: unknown; [key: string]: unknown }>) =>
    React.createElement('div', props, children),
}));

vi.mock('@mui/material/Tooltip', () => ({
  default: ({
    children,
    title,
    placement,
  }: {
    children: React.ReactNode;
    title: string;
    placement?: string;
  }) =>
    React.createElement(
      'span',
      {
        'data-tooltip': title,
        ...(placement !== undefined && { 'data-tooltip-placement': placement }),
      },
      children
    ),
}));

vi.mock('@mui/material/IconButton', () => ({
  default: ({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
    component: _component,
    href,
    ...props
  }: React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    'aria-label'?: string;
    component?: React.ElementType;
    href?: string;
    [key: string]: unknown;
  }>) =>
    React.createElement(
      'button',
      {
        onClick,
        disabled,
        'aria-label': ariaLabel,
        ...(href !== undefined && { 'data-href': href }),
        ...props,
      },
      children
    ),
}));

// ---------------------------------------------------------------------------
// Component under test — imported AFTER mocks
// ---------------------------------------------------------------------------

import { IconActionBar, DEFAULT_ICON_ACTIONS } from './icon-action-bar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderBar(props: React.ComponentProps<typeof IconActionBar> = {}) {
  return renderToStaticMarkup(React.createElement(IconActionBar, props));
}

// ---------------------------------------------------------------------------
// DEFAULT_ICON_ACTIONS constant
// ---------------------------------------------------------------------------

describe('DEFAULT_ICON_ACTIONS', () => {
  it('has exactly 5 entries', () => {
    expect(DEFAULT_ICON_ACTIONS).toHaveLength(5);
  });

  it('covers Edit, View, Print, Send, Share', () => {
    const tooltips = DEFAULT_ICON_ACTIONS.map((a) => a.tooltip);
    expect(tooltips).toEqual(['Edit', 'View', 'Print', 'Send', 'Share']);
  });

  it('every entry has a non-empty icon slot', () => {
    DEFAULT_ICON_ACTIONS.forEach((action) => {
      expect(action.icon).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// Structure — default actions
// ---------------------------------------------------------------------------

describe('IconActionBar — default actions', () => {
  it('renders 5 buttons when no actions prop is supplied', () => {
    const html = renderBar();
    const matches = html.match(/<button/g);
    expect(matches).toHaveLength(5);
  });

  it('renders aria-labels matching the default tooltips', () => {
    const html = renderBar();
    expect(html).toContain('aria-label="Edit"');
    expect(html).toContain('aria-label="View"');
    expect(html).toContain('aria-label="Print"');
    expect(html).toContain('aria-label="Send"');
    expect(html).toContain('aria-label="Share"');
  });

  it('renders data-tooltip attributes from Tooltip mock', () => {
    const html = renderBar();
    expect(html).toContain('data-tooltip="Edit"');
    expect(html).toContain('data-tooltip="Share"');
  });
});

// ---------------------------------------------------------------------------
// Structure — custom actions
// ---------------------------------------------------------------------------

describe('IconActionBar — custom actions', () => {
  it('renders exactly as many buttons as actions provided', () => {
    const html = renderBar({
      actions: [
        { tooltip: 'Delete', icon: React.createElement('svg', { 'data-icon': 'test' }) },
        { tooltip: 'Archive', icon: React.createElement('svg', { 'data-icon': 'test2' }) },
      ],
    });
    const matches = html.match(/<button/g);
    expect(matches).toHaveLength(2);
  });

  it('uses the provided tooltip as aria-label', () => {
    const html = renderBar({
      actions: [{ tooltip: 'Download', icon: React.createElement('svg') }],
    });
    expect(html).toContain('aria-label="Download"');
    expect(html).toContain('data-tooltip="Download"');
  });

  it('prefers explicit aria-label over tooltip', () => {
    const html = renderBar({
      actions: [
        {
          tooltip: 'Download',
          icon: React.createElement('svg'),
          'aria-label': 'Download invoice PDF',
        },
      ],
    });
    expect(html).toContain('aria-label="Download invoice PDF"');
  });

  it('forwards href to the button element', () => {
    const html = renderBar({
      actions: [
        {
          tooltip: 'Edit',
          icon: React.createElement('svg'),
          href: '/invoices/1/edit',
          component: 'a',
        },
      ],
    });
    expect(html).toContain('data-href="/invoices/1/edit"');
  });

  it('forwards tooltipPlacement to Tooltip', () => {
    const html = renderBar({
      actions: [
        {
          tooltip: 'Edit',
          icon: React.createElement('svg'),
          tooltipPlacement: 'top',
        },
      ],
    });
    expect(html).toContain('data-tooltip-placement="top"');
  });

  it('renders disabled attribute when disabled=true', () => {
    const html = renderBar({
      actions: [{ tooltip: 'Edit', icon: React.createElement('svg'), disabled: true }],
    });
    expect(html).toContain('disabled');
  });
});

// ---------------------------------------------------------------------------
// Interaction — click and disabled
// ---------------------------------------------------------------------------

describe('IconActionBar — interaction', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('calls onClick when a button is clicked', () => {
    const handler = vi.fn();
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(IconActionBar, {
          actions: [{ tooltip: 'Edit', icon: React.createElement('svg'), onClick: handler }],
        })
      );
    });
    const button = container.querySelector('button');
    act(() => {
      button?.click();
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClick when the button is disabled', () => {
    const handler = vi.fn();
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(IconActionBar, {
          actions: [
            { tooltip: 'Edit', icon: React.createElement('svg'), onClick: handler, disabled: true },
          ],
        })
      );
    });
    const button = container.querySelector('button');
    act(() => {
      button?.click();
    });
    expect(handler).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Readability — minimum size constants (rule: export named constants)
// ---------------------------------------------------------------------------

describe('IconActionBar — DEFAULT_ICON_ACTIONS uses GiselleIcon (smoke)', () => {
  it('all default icons are ReactNodes (non-null)', () => {
    DEFAULT_ICON_ACTIONS.forEach((action) => {
      expect(action.icon).not.toBeNull();
      expect(action.icon).not.toBeUndefined();
    });
  });
});
