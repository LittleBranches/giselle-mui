'use client';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ChevronDownIcon } from './chevron-down-icon';
import {
  accordionDetailsSx,
  accordionRootSx,
  accordionSummarySx,
  dateSx,
  descriptionSx,
  milestoneDotSx,
  milestoneRowSx,
  milestonesListSx,
  phaseDotSx,
  phaseIconWrapperSx,
  phaseTitleSx,
} from './compact.styles';
import type { TimelineCompactProps } from './types';
import { resolveCompactColor } from './utils';

// ----------------------------------------------------------------------

/**
 * `TimelineCompact` renders a `TimelinePhase[]` as a single-column list of
 * expandable accordion items — the lightweight mobile companion to `TimelineTwoColumn`.
 *
 * Accepts the **same `phases` data** as `TimelineTwoColumn`, so consumers can swap
 * components at a breakpoint without changing the data layer:
 *
 * ```tsx
 * {isMobile
 *   ? <TimelineCompact phases={phases} />
 *   : <TimelineTwoColumn phases={phases} columnLabels={labels} sidebar={sidebar} />
 * }
 * ```
 *
 * Each phase renders as an accordion row:
 * - **Summary (collapsed):** coloured dot (with phase icon inside) + title + date
 * - **Details (expanded):** description paragraph + milestone list
 *
 * Done phases (`done: true`) render with a green dot and reduced opacity —
 * matching the `TimelineTwoColumn` done-state convention.
 */
export function TimelineCompact({ phases, sx, ...other }: TimelineCompactProps) {
  return (
    <Box sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {phases.map((phase) => {
        const effectiveColor = resolveCompactColor(phase.color, phase.done);
        const hasMilestones = (phase.milestones?.length ?? 0) > 0;
        const hasDetails = Boolean(phase.description) || hasMilestones;

        return (
          <Accordion
            key={phase.key}
            disableGutters
            elevation={0}
            sx={accordionRootSx(phase.done ?? false)}
          >
            <AccordionSummary
              expandIcon={hasDetails ? <ChevronDownIcon /> : null}
              sx={accordionSummarySx}
              aria-label={phase.shortTitle ?? phase.title}
            >
              <Box sx={phaseDotSx(effectiveColor)} aria-hidden="true">
                <Box sx={phaseIconWrapperSx}>{phase.icon}</Box>
              </Box>
              <Typography variant="subtitle2" sx={phaseTitleSx}>
                {phase.shortTitle ?? phase.title}
              </Typography>
              <Typography variant="caption" sx={dateSx}>
                {phase.date}
              </Typography>
            </AccordionSummary>

            {hasDetails && (
              <AccordionDetails sx={accordionDetailsSx}>
                {phase.description && (
                  <Box sx={{ mb: hasMilestones ? 1.5 : 0 }}>
                    <Typography variant="body2" sx={descriptionSx}>
                      {phase.description}
                    </Typography>
                  </Box>
                )}

                {hasMilestones && (
                  <Stack sx={milestonesListSx} spacing={0}>
                    {phase.milestones!.map((ms, idx) => {
                      const msColor = resolveCompactColor(ms.color, ms.done);
                      return (
                        <Box key={`${phase.key}-ms-${idx}`} sx={milestoneRowSx}>
                          <Box sx={milestoneDotSx(msColor)} aria-hidden="true" />
                          <Typography variant="caption" sx={phaseTitleSx}>
                            {ms.shortTitle ?? ms.title}
                          </Typography>
                          <Typography variant="caption" sx={dateSx}>
                            {ms.date}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </AccordionDetails>
            )}
          </Accordion>
        );
      })}
    </Box>
  );
}
