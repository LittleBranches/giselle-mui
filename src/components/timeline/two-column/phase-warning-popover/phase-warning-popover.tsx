import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import type { PhaseRange, PhaseWarningPopoverProps } from './types';
import { monthIndexToDate, resolveOverlaps } from '../utils';
import { popoverPaperSx, sliderRowHeaderSx, actionsRowSx } from './phase-warning-popover.styles';
import { MiniGanttRuler } from './mini-gantt-ruler';
import {
  parsePhaseRange,
  getConnectedOverlapGroup,
  computeAxis,
  hasRemainingOverlaps,
  applyOverrides,
  mergeIntoAll,
  resolveSliderColor,
} from './utils';

// Re-exports — keeps existing imports from './phase-warning-popover' working.
export type { PhaseRange, PhaseWarningPopoverProps } from './types';
export {
  parsePhaseRange,
  getConnectedOverlapGroup,
  computeAxis,
  hasRemainingOverlaps,
  applyOverrides,
  mergeIntoAll,
} from './utils';

// ----------------------------------------------------------------------

/**
 * Rich interactive popover for resolving phase date overlaps.
 *
 * **Design decision — `Popper` + `ClickAwayListener`, not `Tooltip`:**
 * MUI `Tooltip` is display-only — it does not support focus management inside
 * interactive children (sliders, buttons). We use `Popper` + `Paper` so the
 * popover can host the full repair UI (sliders, Gantt ruler, Apply/Cancel).
 *
 * **Opened by:** the `⚠ Date overlap` corner badge on `PhaseCard` — only when
 * `TimelineTwoColumn.onPhasesChange` is provided (controlled mode).
 * In read-only mode (no `onPhasesChange`), the badge stays a plain tooltip.
 *
 * **Conflict group:** all phases detected as overlapping by `detectPhaseOverlaps`.
 * Each gets one range slider. Sliders share a common month-index axis.
 *
 * **State lifecycle:**
 * - `overrides` re-initialises from parsed phase dates every time the popover opens.
 * - "Make sequential" runs `resolveOverlaps` on the current overrides → updates sliders → shows Apply/Cancel.
 * - "Apply" merges overrides into `allPhases` and calls `onPhasesChange`.
 * - "Cancel" resets overrides to the original parsed dates.
 *
 * This component lives in `timeline-two-column/` as an internal sub-component and is
 * not exported from the package barrel.
 */
export function PhaseWarningPopover({
  open,
  anchorEl,
  onClose,
  allPhases,
  currentPhase,
  onPhasesChange,
}: PhaseWarningPopoverProps) {
  // Compute the conflict group: only phases in the same connected overlap cluster
  // as currentPhase. This prevents the popover from showing (or allowing Apply to
  // modify) phases from unrelated overlap groups elsewhere in the timeline.
  const conflictingPhases = useMemo(
    () => getConnectedOverlapGroup(allPhases, currentPhase.key),
    [allPhases, currentPhase.key]
  );

  const [overrides, setOverrides] = useState<Map<number, PhaseRange>>(() => new Map());
  const [pendingApply, setPendingApply] = useState(false);

  // Re-initialise overrides every time the popover opens.
  useEffect(() => {
    if (!open) return;
    const initial = new Map<number, PhaseRange>();
    for (const p of conflictingPhases) {
      const range = parsePhaseRange(p);
      if (range) initial.set(p.key, range);
    }
    setOverrides(initial);
    setPendingApply(false);
  }, [open, conflictingPhases]);

  const axis = useMemo(() => computeAxis(overrides), [overrides]);
  const stillOverlapping = useMemo(() => hasRemainingOverlaps(overrides), [overrides]);

  const handleSliderChange = useCallback((phaseKey: number, value: number | number[]) => {
    if (!Array.isArray(value)) return;
    const [start, end] = value as [number, number];
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(phaseKey, { startIdx: start, endIdx: end });
      return next;
    });
    setPendingApply(false);
  }, []);

  const handleMakeSequential = useCallback(() => {
    const withOverrides = applyOverrides(conflictingPhases, overrides);
    const resolved = resolveOverlaps(withOverrides);
    const next = new Map<number, PhaseRange>();
    for (const p of resolved) {
      const range = parsePhaseRange(p);
      if (range) next.set(p.key, range);
    }
    setOverrides(next);
    setPendingApply(true);
  }, [conflictingPhases, overrides]);

  const handleApply = useCallback(() => {
    const withOverrides = applyOverrides(conflictingPhases, overrides);
    const merged = mergeIntoAll(allPhases, withOverrides);
    onPhasesChange(merged);
    onClose();
  }, [conflictingPhases, overrides, allPhases, onPhasesChange, onClose]);

  const handleCancel = useCallback(() => {
    const initial = new Map<number, PhaseRange>();
    for (const p of conflictingPhases) {
      const range = parsePhaseRange(p);
      if (range) initial.set(p.key, range);
    }
    setOverrides(initial);
    setPendingApply(false);
  }, [conflictingPhases]);

  const warningCount = conflictingPhases.length;

  if (!open || !anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
      sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper elevation={8} sx={popoverPaperSx}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="subtitle2"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              ⚠ {warningCount} date overlap{warningCount !== 1 ? 's' : ''}
            </Typography>
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Close warning panel"
              sx={{ ml: 'auto' }}
            >
              ×
            </IconButton>
          </Box>

          <Divider />

          {/* Warning list */}
          <Box>
            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 500 }}>
              {`Overlap: ${conflictingPhases.map((p) => p.shortTitle ?? p.title).join(' ↔ ')}`}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {currentPhase.shortTitle ?? currentPhase.title} — adjust sliders or use Make
              sequential.
            </Typography>
          </Box>

          <Divider />

          {/* Range sliders — one per conflicting phase */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {conflictingPhases.map((phase) => {
              const override = overrides.get(phase.key);
              if (!override) return null;
              const sliderColor = resolveSliderColor(phase.color);
              return (
                <Box key={phase.key}>
                  <Box sx={sliderRowHeaderSx}>
                    <Typography variant="caption" fontWeight={600}>
                      {phase.shortTitle ?? phase.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {monthIndexToDate(override.startIdx)} – {monthIndexToDate(override.endIdx)}
                    </Typography>
                  </Box>
                  <Slider
                    value={[override.startIdx, override.endIdx]}
                    min={axis.min}
                    max={axis.max}
                    step={1}
                    color={sliderColor}
                    disableSwap
                    size="small"
                    onChange={(_e, v) => handleSliderChange(phase.key, v)}
                    aria-label={`Date range for ${phase.shortTitle ?? phase.title}`}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Mini Gantt ruler */}
          <MiniGanttRuler axis={axis} conflictingPhases={conflictingPhases} overrides={overrides} />

          <Divider />

          {/* Actions */}
          <Box sx={actionsRowSx}>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              disabled={!stillOverlapping}
              onClick={handleMakeSequential}
            >
              Make sequential
            </Button>

            {pendingApply && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={handleApply}
                  aria-label="Apply date changes"
                >
                  Apply
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleCancel}
                  aria-label="Cancel date changes"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
