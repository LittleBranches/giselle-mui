// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { TaskDetailsRenderer } from './task-details-renderer';

describe('TaskDetailsRenderer', () => {
  it('renders description, rich content, and nested tasks from TaskDetails', () => {
    const html = renderToStaticMarkup(
      React.createElement(TaskDetailsRenderer, {
        task: {
          key: 'task-1',
          title: 'Accordion',
          description: 'Generic WCAG 2.2 AA accordion with done-toggle support.',
          details: {
            content: React.createElement(
              'ul',
              null,
              React.createElement('li', null, 'Leading icon slot'),
              React.createElement('li', null, 'Action slot')
            ),
            tasks: [
              { key: 'task-1-a', title: 'Desktop dialog path' },
              { key: 'task-1-b', title: 'Mobile full-screen path' },
            ],
          },
        },
      })
    );

    expect(html).toContain('Generic WCAG 2.2 AA accordion with done-toggle support.');
    expect(html).toContain('Leading icon slot');
    expect(html).toContain('Desktop dialog path');
    expect(html).toContain('Mobile full-screen path');
  });
});
