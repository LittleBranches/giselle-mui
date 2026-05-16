'use client';

import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, quota exceeded)
  }
}

function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Storage may be unavailable
  }
}

// ----------------------------------------------------------------------

export type UseLocalStorageReturn<T> = {
  state: T;
  setState: (partial: Partial<T>) => void;
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  resetState: (defaults: T) => void;
};

/**
 * SSR-safe React hook for persisting state in `localStorage`.
 *
 * - Reads from storage on mount; falls back to `initialValue` when nothing is stored.
 * - Writes to storage on every state change.
 * - Provides `setState` (partial merge), `setField` (single typed key), and `resetState`.
 * - Safe to call in a Next.js RSC tree — `window` access is guarded server-side.
 */
export function useLocalStorage<T extends object>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [state, setStateInternal] = useState<T>(initialValue);

  // Sync with storage on mount (handles SSR hydration gap)
  useEffect(() => {
    const stored = readFromStorage(key, initialValue);
    setStateInternal(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setState = useCallback(
    (partial: Partial<T>) => {
      setStateInternal((prev) => {
        const next = { ...prev, ...partial };
        writeToStorage(key, next);
        return next;
      });
    },
    [key]
  );

  const setField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setStateInternal((prev) => {
        const next = { ...prev, [field]: value };
        writeToStorage(key, next);
        return next;
      });
    },
    [key]
  );

  const resetState = useCallback(
    (defaults: T) => {
      removeFromStorage(key);
      setStateInternal(defaults);
    },
    [key]
  );

  return { state, setState, setField, resetState };
}
