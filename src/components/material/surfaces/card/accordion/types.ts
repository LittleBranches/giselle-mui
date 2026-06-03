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
   * When `true`, a done-toggle control appears before the title. The control is
   * **independent** from the expand/collapse trigger — activating it toggles the
   * `done` state without opening or closing the accordion.
   *
   * - Without `checkIcon`: renders a MUI `Checkbox` (default).
   * - With `checkIcon`: renders an `IconButton` with 3-state icon feedback
   *   (idle / hover+focus / done). See `checkIcon` prop for details.
   *
   * @default false
   */
  checklist?: boolean;

  /**
   * Controlled done state for the checklist toggle.
   *
   * - `true` → done
   * - `false` → pending
   *
   * Has no effect when `checklist` is `false`.
   *
   * @default false
   */
  done?: boolean;

  /**
   * Called when the done-toggle is activated.
   *
   * Receives the **next** done state — the value the control will transition
   * **to** after the interaction (the opposite of the current `done` prop).
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
   * Custom icon for the **idle undone** state of the checklist toggle.
   *
   * When provided, the MUI `Checkbox` is replaced by an `IconButton` that
   * displays three different icons depending on interaction state:
   *
   * | State                       | Icon shown                  |
   * | --------------------------- | --------------------------- |
   * | Undone + idle               | `checkIcon` (this prop)     |
   * | Hover **or** keyboard focus | `checkHoverIcon` (outlined green check) |
   * | Done + idle                 | `checkDoneIcon` (filled green check)    |
   * | Done + hover/focus          | `checkHoverIcon` (outlined check → signals "click to undo") |
   *
   * Keyboard behaviour: Tab focuses the button (showing the outlined check),
   * Space / Enter toggles the done state.
   *
   * Both hover and focus icons can be overridden via `checkHoverIcon`.
   * The done icon can be overridden via `checkDoneIcon`.
   *
   * Ignored when `checklist` is `false`.
   *
   * ```tsx
   * // Circle icon as the "not done yet" state
   * <Accordion
   *   checklist
   *   checkIcon={<svg width={20} height={20}><circle cx={12} cy={12} r={9} /></svg>}
   *   done={task.done}
   *   onDoneButtonClick={(isDone) => updateTask(task.id, { done: isDone })}
   *   title={task.title}
   * >
   *   ...
   * </Accordion>
   * ```
   */
  checkIcon?: ReactNode;

  /**
   * Icon shown when the item is done and the button is **not** hovered/focused.
   *
   * Default: built-in filled green check circle SVG.
   * Override with your own `ReactNode` to use a different done indicator.
   *
   * Only used in icon-button mode (when `checkIcon` is provided).
   */
  checkDoneIcon?: ReactNode;

  /**
   * Icon shown when the button is **hovered or keyboard-focused**, regardless of
   * done state.
   *
   * Default: built-in outlined green check circle SVG.
   * Provides visual feedback that the button is interactive and hints at the
   * "toggle" action. When the item is done, this icon also signals "click to undo".
   *
   * Only used in icon-button mode (when `checkIcon` is provided).
   */
  checkHoverIcon?: ReactNode;

  /**
   * When `true`, the `Checkbox` renders in indeterminate state — used when some
   * but not all child items are done. Has no effect in icon-button mode
   * (`checkIcon` provided) or when `checklist` is `false`.
   *
   * Wire this from a `useNestedChecklist` result: `indeterminate={indeterminate}`.
   *
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Interactive element rendered before the title — replaces `leadingIcon` when
   * the leading slot must be clickable (e.g. a phase dot in checklist mode).
   *
   * Unlike `leadingIcon` (which is wrapped in `aria-hidden`), `leadingAction`
   * is rendered as-is. The consumer is responsible for accessibility
   * (`role`, `aria-label`, `onClick`, etc.).
   *
   * Cannot be used together with `checklist` — checklist owns the leading slot.
   * If both are provided, `checklist` takes precedence.
   *
   * ```tsx
   * <Accordion
   *   leadingAction={
   *     <PhaseDot color={color} onClick={handleToggle} aria-label="Toggle phase done" />
   *   }
   *   trailingContent={<Typography variant="caption">{phase.date}</Typography>}
   *   title={phase.title}
   * >
   *   ...
   * </Accordion>
   * ```
   */
  leadingAction?: ReactNode;

  /**
   * Optional content rendered **after** the title inside the summary row
   * (e.g. a date label, a status badge).
   *
   * Rendered inside the same flex row as the title — consumers are responsible
   * for alignment (`ml: 'auto'`, `flexShrink: 0`, etc.) if needed.
   *
   * ```tsx
   * trailingContent={
   *   <Typography variant="caption" sx={{ ml: 'auto', flexShrink: 0 }}>
   *     {phase.date}
   *   </Typography>
   * }
   * ```
   */
  trailingContent?: ReactNode;

  /**
   * Optional icon rendered before the title when `checklist` is `false`.
   *
   * Pass a `ReactNode` — typically a `<GiselleIcon icon="solar:..." />`.
   * The wrapper is `aria-hidden` because the icon is decorative.
   *
   * Ignored when `checklist` is `true` (the done-toggle control replaces it).
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
