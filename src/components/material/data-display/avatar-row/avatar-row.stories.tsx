import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AvatarRow } from './avatar-row';
import type { AvatarItem } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof AvatarRow> = {
  title: 'Material/Data Display/Avatar Row',
  component: AvatarRow,
  parameters: { layout: 'padded' },
  argTypes: {
    sx: { control: false },
    onSelect: { action: 'selected' },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarRow>;

// ----------------------------------------------------------------------

const PEOPLE: AvatarItem[] = [
  { id: 'alice', name: 'Alice Johnson', avatarSrc: 'https://i.pravatar.cc/40?u=alice' },
  { id: 'bob', name: 'Bob Smith' },
  { id: 'carol', name: 'Carol Danes', avatarSrc: 'https://i.pravatar.cc/40?u=carol' },
  { id: 'dave', name: 'Dave Wu' },
];

// ----------------------------------------------------------------------

/**
 * **Default state — no selection.**
 *
 * When `activeId` is not set, no avatar receives a ring. This is the
 * correct initial state for an uncontrolled participant picker — the
 * consumer controls selection externally via `activeId`.
 */
export const Default: Story = {
  args: {
    items: PEOPLE,
  },
};

/**
 * **Active ring indicator.**
 *
 * The avatar whose `id` matches `activeId` receives a primary-colour
 * outline ring. The ring is implemented via CSS `outline` (not a border)
 * so it does not shift the avatar's layout or affect neighbouring items.
 *
 * Only one avatar can be active at a time — this is enforced by the
 * single `activeId` prop rather than a per-item flag, which prevents
 * accidental multi-selection states.
 */
export const WithActiveSelection: Story = {
  args: {
    items: PEOPLE,
    activeId: 'bob',
  },
};

/**
 * **Initials fallback.**
 *
 * When `avatarSrc` is absent the component derives two-letter initials
 * from `name`. The first letter of each whitespace-delimited word is
 * used, up to a maximum of two characters, both uppercased.
 *
 * A single-word name ("Carol") produces a single initial ("C").
 * This matches the MUI Avatar default behaviour for the `children` prop.
 */
export const InitialsFallback: Story = {
  args: {
    items: [
      { id: '1', name: 'Alice Johnson' },
      { id: '2', name: 'Bob Smith' },
      { id: '3', name: 'Carol' },
      { id: '4', name: 'Dave Wu' },
    ],
  },
};

/**
 * **Single-item row.**
 *
 * The component handles a one-item list correctly. The active ring works
 * identically regardless of row length. This scenario covers assignee
 * pickers that start with one pre-assigned participant.
 */
export const SingleItem: Story = {
  args: {
    items: [{ id: 'solo', name: 'Solo User', avatarSrc: 'https://i.pravatar.cc/40?u=solo' }],
    activeId: 'solo',
  },
};

// ---------------------------------------------------------------------------
// Interactive story — named component so React hooks rules are satisfied.
// ---------------------------------------------------------------------------

function InteractiveDemo({ items }: { items: AvatarItem[] }) {
  const [activeId, setActiveId] = React.useState<string | undefined>(undefined);
  return (
    <Box>
      <AvatarRow items={items} activeId={activeId} onSelect={setActiveId} />
      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
        Selected: {activeId ?? '(none)'}
      </Typography>
    </Box>
  );
}

/**
 * **Interactive selection demo.**
 *
 * Click any avatar to fire `onSelect`. The selected `id` is shown below the
 * row. This story illustrates the uncontrolled usage pattern — the consumer
 * lifts selection state and passes `activeId` back down.
 */
export const Interactive: Story = {
  render: (args) => <InteractiveDemo items={args.items ?? PEOPLE} />,
  args: { items: PEOPLE },
};
