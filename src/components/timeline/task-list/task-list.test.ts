// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactDOM from 'react-dom/client';
import { act } from 'react';

import { TaskList } from './task-list';
import type { Task } from '../two-column/types';

// ----------------------------------------------------------------------

const tasks: Task[] = [
  { title: 'Write tests', done: false },
  { title: 'Ship component', done: true },
  { title: 'Update docs' },
];

describe('TaskList — read-only mode', () => {
  it('renders all task titles', () => {
    const html = renderToStaticMarkup(React.createElement(TaskList, { tasks }));
    expect(html).toContain('Write tests');
    expect(html).toContain('Ship component');
    expect(html).toContain('Update docs');
  });

  it('does not render checkboxes in read-only mode', () => {
    const html = renderToStaticMarkup(React.createElement(TaskList, { tasks }));
    expect(html).not.toContain('input');
  });

  it('renders as a <ul> list', () => {
    const html = renderToStaticMarkup(React.createElement(TaskList, { tasks }));
    expect(html).toMatch(/<ul/);
  });
});

describe('TaskList — checklist mode', () => {
  it('renders a checkbox for each task', () => {
    const html = renderToStaticMarkup(
      React.createElement(TaskList, { tasks, checklist: true, taskDoneState: [false, true, false] })
    );
    // MUI Checkbox renders an <input type="checkbox">
    const inputMatches = html.match(/<input/g);
    expect(inputMatches).toHaveLength(tasks.length);
  });

  it('sets checked=true for done tasks via taskDoneState', () => {
    const html = renderToStaticMarkup(
      React.createElement(TaskList, { tasks, checklist: true, taskDoneState: [false, true, false] })
    );
    // The second checkbox should be checked
    expect(html).toContain('checked=""');
  });

  it('falls back to task.done when taskDoneState is absent', () => {
    const html = renderToStaticMarkup(React.createElement(TaskList, { tasks, checklist: true }));
    // tasks[1].done = true → should render as checked
    expect(html).toContain('checked=""');
  });

  it('calls onToggle with the correct index on change', () => {
    const onTaskToggle = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(TaskList, {
          tasks,
          checklist: true,
          taskDoneState: [false, false, false],
          onTaskToggle,
        })
      );
    });
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    act(() => {
      (checkboxes[1] as HTMLInputElement).click();
    });
    expect(onTaskToggle).toHaveBeenCalledWith(1);
    document.body.removeChild(container);
  });
});

describe('TaskList — indent prop', () => {
  it('renders without error for indent="phase" (default)', () => {
    expect(() =>
      renderToStaticMarkup(React.createElement(TaskList, { tasks, indent: 'phase' }))
    ).not.toThrow();
  });

  it('renders without error for indent="milestone"', () => {
    expect(() =>
      renderToStaticMarkup(React.createElement(TaskList, { tasks, indent: 'milestone' }))
    ).not.toThrow();
  });
});

describe('TaskList — sx passthrough', () => {
  it('accepts sx as an array without throwing', () => {
    expect(() =>
      renderToStaticMarkup(React.createElement(TaskList, { tasks, sx: [{ mt: 1 }, { mb: 2 }] }))
    ).not.toThrow();
  });
});

describe('TaskList — empty tasks', () => {
  it('renders an empty list without throwing', () => {
    expect(() => renderToStaticMarkup(React.createElement(TaskList, { tasks: [] }))).not.toThrow();
  });
});
