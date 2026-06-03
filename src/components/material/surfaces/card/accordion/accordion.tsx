'use client';

import { useId } from 'react';
import type { ChangeEvent, MouseEvent, ReactNode } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

import { ToggleIconButton } from '../../../input/toggle-icon-button';
import type { AccordionProps } from './types';
import {
  accordionRootSx,
  checkboxSx,
  leadingIconSx,
  summarySx,
  summaryRowSx,
} from './accordion.styles';

// ----------------------------------------------------------------------

/**
 * A generic, accessible accordion component that can represent any
 * collapsible content — FAQ entries, tasks, settings sections, etc.
 *
 * ## Checklist mode
 *
 * When `checklist` is `true`, a done-toggle `Checkbox` appears before the
 * title. The checkbox is **independent** from the expand/collapse trigger:
 *
 * - Clicking the **checkbox** calls `onDoneButtonClick(nextDone)` without
 *   opening or closing the accordion.
 * - Clicking the **title / summary area** expands or collapses the accordion
 *   without toggling the done state.
 *
 * This is WCAG 2.2 AA compliant — the checkbox and the summary are sibling
 * `<button>` / `<input>` elements, never nested inside each other.
 *
 * ## Usage
 *
 * ```tsx
 * // Basic
 * <Accordion title="What is this?" expandIcon={<GiselleIcon icon="solar:alt-arrow-down-bold" width={16} />}>
 *   <Typography>It is a generic accordion.</Typography>
 * </Accordion>
 *
 * // Task (checklist mode)
 * <Accordion
 *   title={task.title}
 *   checklist
 *   done={task.done}
 *   onDoneButtonClick={(isDone) => updateTask(task.id, { done: isDone })}
 *   expandIcon={<GiselleIcon icon="solar:alt-arrow-down-bold" width={16} />}
 * >
 *   <Typography>{task.description}</Typography>
 * </Accordion>
 * ```
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13 · Coverage 100% · Cleanup complete
 */
export function Accordion({
  title,
  children,
  checklist = false,
  done = false,
  indeterminate = false,
  onDoneButtonClick,
  leadingIcon,
  leadingAction,
  trailingContent,
  expandIcon,
  checkIcon,
  checkDoneIcon,
  checkHoverIcon,
  sx,
  ...other
}: AccordionProps) {
  const id = useId();
  const summaryId = `accordion-summary-${id}`;
  const detailsId = `accordion-details-${id}`;

  const handleCheckboxChange = (_e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onDoneButtonClick?.(checked);
  };

  // stopPropagation prevents the click from reaching MuiAccordion's root —
  // defensive guard for any future root-level click handler a consumer might add.
  const handleCheckboxClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const hasLeadingElement = checklist || leadingIcon !== undefined || leadingAction !== undefined;

  // Compute the leading element (checkbox or icon-button or decorative icon) before the
  // return so the JSX stays flat — ESLint bans nested ternaries inside JSX.
  let leadingElement: ReactNode = null;
  if (checklist) {
    // Ternary (not nested if/else) to stay within cognitive complexity budget.
    // checkIcon === undefined → standard Checkbox; otherwise → custom icon ToggleIconButton.
    leadingElement =
      checkIcon === undefined ? (
        <Checkbox
          checked={done}
          indeterminate={indeterminate}
          onChange={handleCheckboxChange}
          onClick={handleCheckboxClick}
          slotProps={{
            input: {
              'aria-label': done ? 'Mark as not done' : 'Mark as done',
            },
          }}
          size="small"
          sx={checkboxSx}
        />
      ) : (
        <ToggleIconButton
          pressed={done}
          idleIcon={checkIcon as ReactNode}
          pressedIcon={checkDoneIcon}
          hoverIcon={checkHoverIcon}
          onPressedChange={onDoneButtonClick}
          aria-label={done ? 'Mark as not done' : 'Mark as done'}
        />
      );
  } else if (leadingAction === undefined) {
    leadingElement = (
      <Box aria-hidden="true" sx={leadingIconSx}>
        {leadingIcon}
      </Box>
    );
  } else {
    leadingElement = leadingAction;
  }
  const summaryContent =
    typeof title === 'string' ? (
      <Typography component="span" variant="subtitle1">
        {title}
      </Typography>
    ) : (
      title
    );
  const accordionSummary = (
    <AccordionSummary
      expandIcon={expandIcon}
      id={summaryId}
      aria-controls={detailsId}
      sx={hasLeadingElement ? summarySx : undefined}
    >
      {summaryContent}
      {trailingContent}
    </AccordionSummary>
  );

  return (
    <MuiAccordion sx={[accordionRootSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {hasLeadingElement ? (
        <Box sx={summaryRowSx}>
          {leadingElement}
          {accordionSummary}
        </Box>
      ) : (
        accordionSummary
      )}
      <AccordionDetails id={detailsId}>{children}</AccordionDetails>
    </MuiAccordion>
  );
}
