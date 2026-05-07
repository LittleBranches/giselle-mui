import type { ReactNode } from 'react';
import type { AccordionProps as MuiAccordionProps } from '@mui/material/Accordion';

// ----------------------------------------------------------------------

/**
 * Props for the internal {@link CheckIconButton} sub-component.
 * Not exported from the package barrel — consumers interact with the parent
 * `Accordion` props (`checkIcon`, `checkDoneIcon`, `checkHoverIcon`) instead.
 */
export type CheckIconButtonProps = {
  /** Current done state — determines which icon is shown at idle. */
  done: boolean;
  /**
   * Icon for the idle undone state (the consumer's custom icon).
   * Required — `CheckIconButton` is only rendered when this is defined.
   */
  checkIcon: ReactNode;
  /**
   * Icon shown when the item is done and not hovered/focused.
   * Default: built-in filled green check circle SVG.
   */
  checkDoneIcon?: ReactNode;
  /**
   * Icon shown on hover or keyboard focus regardless of done state.
   * Default: built-in outlined green check circle SVG.
   * Signals "click/press to toggle" to the user.
   */
  checkHoverIcon?: ReactNode;
  /** Called with the NEXT done state when the button is activated. */
  onDoneButtonClick?: (nextDone: boolean) => void;
};

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
