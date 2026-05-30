// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  taskListBaseSx,
  taskListMilestoneSx,
  taskItemSx,
  taskCheckboxSx,
  taskCaptionSx,
} from './task-list.styles';
import type { Theme } from '@mui/material/styles';

// Minimal mock theme — only what the factory functions need.
const mockTheme = {} as unknown as Theme;

describe('taskListBaseSx', () => {
  it('is a static object (not a function)', () => {
    expect(typeof taskListBaseSx).toBe('object');
  });

  it('uses pl: 2 for phase-level indent', () => {
    const sx = taskListBaseSx as Record<string, unknown>;
    expect(sx['pl']).toBe(2);
  });

  it('hides native list markers', () => {
    const sx = taskListBaseSx as Record<string, unknown>;
    expect(sx['listStyle']).toBe('none');
  });
});

describe('taskListMilestoneSx', () => {
  it('uses pl: 3 for milestone-level indent', () => {
    const sx = taskListMilestoneSx as Record<string, unknown>;
    expect(sx['pl']).toBe(3);
  });

  it('hides native list markers', () => {
    const sx = taskListMilestoneSx as Record<string, unknown>;
    expect(sx['listStyle']).toBe('none');
  });
});

describe('taskItemSx', () => {
  it('uses flex row layout', () => {
    const sx = taskItemSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['alignItems']).toBe('center');
  });
});

describe('taskCheckboxSx', () => {
  it('has compact padding', () => {
    const sx = taskCheckboxSx as Record<string, unknown>;
    expect(sx['p']).toBe(0.5);
    expect(sx['mr']).toBe(0.5);
  });
});

describe('taskCaptionSx', () => {
  it('returns line-through when isDone=true', () => {
    const result = (taskCaptionSx(true) as (theme: Theme) => Record<string, unknown>)(mockTheme);
    expect(result['textDecoration']).toBe('line-through');
  });

  it('returns no decoration when isDone=false', () => {
    const result = (taskCaptionSx(false) as (theme: Theme) => Record<string, unknown>)(mockTheme);
    expect(result['textDecoration']).toBe('none');
  });

  it('always sets color to text.secondary', () => {
    const result = (taskCaptionSx(false) as (theme: Theme) => Record<string, unknown>)(mockTheme);
    expect(result['color']).toBe('text.secondary');
  });
});
