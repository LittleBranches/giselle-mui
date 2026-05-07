import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Static sx constants — created once at module load, zero render cost.
// ----------------------------------------------------------------------

/** Base list container — phase-level indentation (pl: 2). */
export const taskListBaseSx: SxProps<Theme> = {
  mt: 0,
  mb: 1.5,
  pl: 2,
  color: 'text.secondary',
  listStyle: 'none',
};

/** Milestone-level list container — extra indentation (pl: 3). */
export const taskListMilestoneSx: SxProps<Theme> = {
  mt: 0,
  mb: 1.5,
  pl: 3,
  color: 'text.secondary',
  listStyle: 'none',
};

/** Individual list item row. */
export const taskItemSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mb: 0.25,
};

/** Checkbox inside a task row — compact padding to keep rows tight. */
export const taskCheckboxSx: SxProps<Theme> = {
  p: 0.5,
  mr: 0.5,
};

// ----------------------------------------------------------------------
// Dynamic sx factories.
// ⚠️ Performance note: each call returns a new object.
// Wrap call sites in useMemo where the component re-renders frequently
// and the isDone value is stable across renders.
// ----------------------------------------------------------------------

/**
 * Task caption style.
 * - `isDone=true` → line-through to signal completion.
 * - `isDone=false` → no decoration.
 */
export const taskCaptionSx =
  (isDone: boolean): SxProps<Theme> =>
  () => ({
    color: 'text.secondary',
    textDecoration: isDone ? 'line-through' : 'none',
  });
