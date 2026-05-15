// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createElement, act } from 'react';
import ReactDOM from 'react-dom/client';
import { useLocalStorage, type UseLocalStorageReturn } from './use-local-storage';

const KEY = 'test-settings';
const DEFAULTS = { mode: 'light', fontSize: 14, version: '1' };

type Defaults = typeof DEFAULTS;

// ---------------------------------------------------------------------------
// Harness — minimal component that captures hook output
// ---------------------------------------------------------------------------

let captured: UseLocalStorageReturn<Defaults> | null = null;

function Harness({ storageKey, defaults }: { storageKey: string; defaults: Defaults }) {
  captured = useLocalStorage(storageKey, defaults);
  return null;
}

function setup(storageKey = KEY, defaults: Defaults = DEFAULTS) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  act(() => {
    root.render(createElement(Harness, { storageKey, defaults }));
  });
  return {
    cleanup: () => {
      act(() => root.unmount());
      div.remove();
    },
  };
}

// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
  captured = null;
});

describe('useLocalStorage — initial state', () => {
  it('returns defaultValue when nothing is stored', () => {
    const { cleanup } = setup();
    expect(captured!.state).toEqual(DEFAULTS);
    cleanup();
  });

  it('returns stored value when present', () => {
    localStorage.setItem(KEY, JSON.stringify({ ...DEFAULTS, mode: 'dark' }));
    const { cleanup } = setup();
    expect(captured!.state.mode).toBe('dark');
    cleanup();
  });

  it('falls back to default when stored JSON is invalid', () => {
    localStorage.setItem(KEY, 'not-json');
    const { cleanup } = setup();
    expect(captured!.state).toEqual(DEFAULTS);
    cleanup();
  });
});

describe('useLocalStorage — setState', () => {
  it('merges partial update into state', () => {
    const { cleanup } = setup();
    act(() => captured!.setState({ mode: 'dark' }));
    expect(captured!.state.mode).toBe('dark');
    expect(captured!.state.fontSize).toBe(14);
    cleanup();
  });

  it('persists update to localStorage', () => {
    const { cleanup } = setup();
    act(() => captured!.setState({ mode: 'dark' }));
    const stored = JSON.parse(localStorage.getItem(KEY)!);
    expect(stored.mode).toBe('dark');
    cleanup();
  });
});

describe('useLocalStorage — setField', () => {
  it('updates a single field by key', () => {
    const { cleanup } = setup();
    act(() => captured!.setField('fontSize', 16));
    expect(captured!.state.fontSize).toBe(16);
    expect(captured!.state.mode).toBe('light');
    cleanup();
  });

  it('persists the field update to localStorage', () => {
    const { cleanup } = setup();
    act(() => captured!.setField('fontSize', 16));
    const stored = JSON.parse(localStorage.getItem(KEY)!);
    expect(stored.fontSize).toBe(16);
    cleanup();
  });
});

describe('useLocalStorage — resetState', () => {
  it('resets state to provided defaults', () => {
    const { cleanup } = setup();
    act(() => captured!.setState({ mode: 'dark', fontSize: 18 }));
    act(() => captured!.resetState(DEFAULTS));
    expect(captured!.state).toEqual(DEFAULTS);
    cleanup();
  });

  it('removes the key from localStorage on reset', () => {
    const { cleanup } = setup();
    act(() => captured!.setState({ mode: 'dark' }));
    act(() => captured!.resetState(DEFAULTS));
    expect(localStorage.getItem(KEY)).toBeNull();
    cleanup();
  });
});
