// @vitest-environment jsdom
/**
 * Regression tests for CheckIconButton's pointer-vs-keyboard focus discrimination.
 *
 * Root cause of bug: browsers fire `focus` on a button immediately after `pointerdown`
 * (before `click`). Without pointer tracking, `handleFocus` sets `isFocused=true` on
 * every mouse click → `isHighlighted=true` → `checkHoverIcon` is shown indefinitely
 * after the click, hiding the `checkDoneIcon` that signals the action succeeded.
 *
 * Fix: track `isPointerDown` via `onPointerDown` / `onPointerUp`. `handleFocus` reads
 * the ref and skips setting `isFocused` when focus came from a pointer click. Only
 * keyboard-originated focus (Tab) triggers `isFocused=true`.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { createElement, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { CheckIconButton } from './check-icon-button';

// ---------------------------------------------------------------------------
// jsdom polyfill — PointerEvent is not available in all jsdom versions
// ---------------------------------------------------------------------------

beforeAll(() => {
  if (typeof global.PointerEvent === 'undefined') {
    class PointerEventPolyfill extends MouseEvent {
      constructor(type: string, params: MouseEventInit = {}) {
        super(type, params);
      }
    }
    Object.defineProperty(global, 'PointerEvent', {
      value: PointerEventPolyfill,
      configurable: true,
      writable: true,
    });
  }
});

// Distinct test icons with data-testid so each can be identified in the DOM.
const IDLE_ICON = createElement('svg', { 'data-testid': 'idle-icon' });
const DONE_ICON = createElement('svg', { 'data-testid': 'done-icon' });
const HOVER_ICON = createElement('svg', { 'data-testid': 'hover-icon' });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setup() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  return {
    div,
    root,
    cleanup: () => {
      root.unmount();
      div.remove();
    },
  };
}

/** Controlled wrapper so `done` prop updates flow from the click handler. */
function ControlledWrapper() {
  const [done, setDone] = useState(false);
  return createElement(CheckIconButton, {
    done,
    checkIcon: IDLE_ICON,
    checkDoneIcon: DONE_ICON,
    checkHoverIcon: HOVER_ICON,
    onDoneButtonClick: setDone,
  });
}

/**
 * Simulates the event sequence a browser fires on a mouse click:
 * pointerdown → focus (via element.focus()) → click → pointerup.
 */
async function simulatePointerClick(button: HTMLElement) {
  await act(async () => {
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    button.focus(); // fires the native focus event — React onFocus captures it
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
  });
}

// ---------------------------------------------------------------------------
// Regression: pointer click must not trap icon on checkHoverIcon
// ---------------------------------------------------------------------------

describe('CheckIconButton — pointer-click icon regression', () => {
  it('[regression] shows idle icon before any interaction', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(createElement(ControlledWrapper, null));
    });

    expect(div.querySelector('[data-testid="idle-icon"]')).not.toBeNull();
    expect(div.querySelector('[data-testid="done-icon"]')).toBeNull();
    expect(div.querySelector('[data-testid="hover-icon"]')).toBeNull();

    cleanup();
  });

  it('[regression] shows checkDoneIcon (not checkHoverIcon) after a pointer click', async () => {
    // Bug: clicking fires onFocus (button gets focus after click) → isFocused=true
    // → isHighlighted=true → checkHoverIcon shown instead of checkDoneIcon.
    // The done icon is never visible — icon appears stuck on hover state.
    // Fix: isPointerDownRef suppresses isFocused when focus came from pointer.
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(createElement(ControlledWrapper, null));
    });

    expect(div.querySelector('[data-testid="idle-icon"]')).not.toBeNull();

    const button = div.querySelector('button')!;
    await simulatePointerClick(button);

    // After pointer click, done=true and isFocused must be false.
    // → done icon shown, NOT hover icon.
    expect(div.querySelector('[data-testid="done-icon"]')).not.toBeNull();
    expect(div.querySelector('[data-testid="hover-icon"]')).toBeNull();
    expect(div.querySelector('[data-testid="idle-icon"]')).toBeNull();

    cleanup();
  });

  it('[regression] shows idle icon after second pointer click (toggle back to undone)', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(createElement(ControlledWrapper, null));
    });

    const button = div.querySelector('button')!;

    // First click: undone → done
    await simulatePointerClick(button);
    expect(div.querySelector('[data-testid="done-icon"]')).not.toBeNull();

    // Second click: done → undone
    await simulatePointerClick(button);

    // done=false, isFocused=false (pointer click suppressed) → idle icon
    expect(div.querySelector('[data-testid="idle-icon"]')).not.toBeNull();
    expect(div.querySelector('[data-testid="done-icon"]')).toBeNull();
    expect(div.querySelector('[data-testid="hover-icon"]')).toBeNull();

    cleanup();
  });
});

// ---------------------------------------------------------------------------
// Keyboard focus still shows checkHoverIcon (the `:focus-visible` behaviour)
// ---------------------------------------------------------------------------

describe('CheckIconButton — keyboard focus icon', () => {
  it('shows checkHoverIcon when focused via keyboard (Tab — no preceding pointerdown)', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(CheckIconButton, {
          done: false,
          checkIcon: IDLE_ICON,
          checkDoneIcon: DONE_ICON,
          checkHoverIcon: HOVER_ICON,
          onDoneButtonClick: undefined,
        })
      );
    });

    const button = div.querySelector('button')!;

    // Keyboard focus: element.focus() without preceding pointerdown
    await act(async () => {
      button.focus();
    });

    // isFocused=true → isHighlighted=true → hover icon shown
    expect(div.querySelector('[data-testid="hover-icon"]')).not.toBeNull();
    expect(div.querySelector('[data-testid="idle-icon"]')).toBeNull();

    // Blur restores idle icon
    await act(async () => {
      button.blur();
    });

    expect(div.querySelector('[data-testid="idle-icon"]')).not.toBeNull();
    expect(div.querySelector('[data-testid="hover-icon"]')).toBeNull();

    cleanup();
  });
});
