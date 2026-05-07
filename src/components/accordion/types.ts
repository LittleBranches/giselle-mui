import type { ReactNode } from 'react';
import type { AccordionProps as MuiAccordionProps } from '@mui/material/Accordion';

// ----------------------------------------------------------------------

/**
 * Props for the {@link Accordion} component.
 *
 * Extends MUI `AccordionProps` — all expand/collapse controls (`expanded`,
 * `onChange`, `defaultExpanded`, `TransitionComponent`, etc.) are forwarded
 * to the underlying MUI Accordion unchanged.
 */
export type AccordionProps = Omit<MuiAccordionProps, 'children' | 'title'> & {
  /** Content displayed in the accordion summary row (the always-visible part). */
  title: ReactNode;

  /** Content revealed inside the accordion when it is expanded. */
  children?: ReactNode;

  /**
   * Enables checklist mode.
   *
   * When `true`, a MUI `Checkbox` appears before the title. The checkbox is
   * **independent** from the expand/collapse trigger — clicking it toggles the
   * `done` state without opening or closing the accordion.
   *
   * The checkbox carries `aria-label` describing its current state and uses
   * `role="checkbox"` (via the native `<input type="checkbox">`), making it
   * fully WCAG 2.2 AA accessible with proper keyboard support.
   *
   * @default false
   */
  checklist?: boolean;

  /**
   * Controlled done state for the checklist toggle.
   *
   * - `true` → checkbox is checked (task done)
   * - `false` → checkbox is unchecked (task pending)
   *
   * Has no effect when `checklist` is `false`.
   *
   * @default false
   */
  done?: boolean;

  /**
   * Called when the done-toggle checkbox is clicked.
   *
   * Receives the **next** done state — the value the checkbox will transition
   * **to** after the click, i.e. the opposite of the current `done` prop.
   *
   * Has no effect when `checklist` is `false`.
   *
   * ```tsx
   * <Accordion
   *   checklist
   *   done={task.done}
   *   onDoneButtonClick={(isDone) => updateTask(task.id, { done: isDone })}
   *   title={task.title}
   * >
   *   <Typography>{task.description}</Typography>
   * </Accordion>
   * ```
   */
  onDoneButtonClick?: (nextDone: boolean) => void;

  /**
   * Optional icon rendered before the title when `checklist` is `false`.
   *
   * Pass a `ReactNode` — typically a `<GiselleIcon icon="solar:..." />`.
   * The wrapper is `aria-hidden` because the icon is decorative.
   *
   * Ignored when `checklist` is `true` (the done-toggle checkbox replaces it).
   */
  leadingIcon?: ReactNode;

  /**
   * The expand/collapse indicator icon on the right side of the summary row.
   *
   * Passed directly to MUI `AccordionSummary`'s `expandIcon` prop.
   * Typical usage:
   * ```tsx
   * expandIcon={<GiselleIcon icon="solar:alt-arrow-down-bold" width={16} />}
   * ```
   */
  expandIcon?: ReactNode;
};
