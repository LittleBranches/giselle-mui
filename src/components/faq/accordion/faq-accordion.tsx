import type { FaqAccordionProps, FaqItem } from './types';

import { useState } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { GiselleIcon } from '../../icon/giselle';
import { SectionTitle } from '../../layout/section-title';
import { varFade } from './utils';
import {
  contentBoxSx,
  accordionItemSx,
  contactSectionSx,
  topTriangleStackSx,
  smallTriangleSx,
} from './faq-accordion.styles';
import { FaqFloatLine, FaqFloatPlusIcon, FaqFloatTriangleDownIcon } from './faq-accordion-svg';
import { FaqMotionViewport } from './faq-motion-viewport';
import { FAQ_FLOAT_LINE_LEFT, FAQ_PLUS_ICON_LEFT } from './faq-accordion.const';

// ----------------------------------------------------------------------

// Wrap Accordion with framer-motion once at module load so the component
// type is stable across renders and accepts both AccordionProps + MotionProps.
const MotionAccordion = motion(Accordion);

/**
 * `FaqAccordion` renders a full FAQ section with scroll-triggered animated
 * accordions, decorative SVG elements (visible at ≥1440 px), and an optional
 * contact footer.
 *
 * Powered by `framer-motion` — import from `@alexrebula/giselle-mui/motion`.
 *
 * ## Usage
 *
 * ```tsx
 * import { FaqAccordion } from '@alexrebula/giselle-mui/motion';
 *
 * <FaqAccordion
 *   caption="Support"
 *   title="Frequently Asked"
 *   txtGradient="Questions"
 *   faqs={[
 *     { question: 'How do I get started?', answer: <p>Create an account…</p> },
 *   ]}
 *   contactHref="/contact"
 *   contactLabel="Send a message"
 *   contactIcon="solar:letter-bold"
 * />
 * ```
 *
 * ## Contact footer
 * The footer is hidden unless `contactHref` is provided.
 *
 * ## Icon
 * Pass a Giselle icon string (e.g. `'solar:letter-bold'`) to `contactIcon`
 * and `GiselleIcon` renders it automatically. Pass a `ReactNode` to supply
 * any custom icon element instead.
 */
export function FaqAccordion({
  caption = 'FAQs',
  title = 'Frequently Asked',
  txtGradient = 'Questions',
  faqs,
  contactTitle = 'Still have questions?',
  contactDescription = 'Reach out directly — we respond within one business day.',
  contactHref,
  contactLabel = 'Contact us',
  contactIcon,
  sx,
  ...other
}: FaqAccordionProps) {
  const [expanded, setExpanded] = useState<string | false>(faqs[0]?.question ?? false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const resolvedIcon =
    typeof contactIcon === 'string' ? <GiselleIcon icon={contactIcon} /> : contactIcon;

  return (
    <Box component="section" sx={sx} {...other}>
      <FaqMotionViewport sx={{ pt: 10, position: 'relative' }}>
        <FaqTopLines />

        <Container>
          <SectionTitle
            caption={caption}
            title={title}
            txtGradient={txtGradient}
            sx={{ textAlign: 'center' }}
          />

          <Box sx={contentBoxSx}>
            {faqs.map((item: FaqItem, index: number) => (
              <MotionAccordion
                key={item.question}
                disableGutters
                variants={varFade('inUp', 24)}
                expanded={expanded === item.question}
                onChange={handleChange(item.question)}
                sx={accordionItemSx}
              >
                <AccordionSummary
                  id={`faq-panel${index}-header`}
                  aria-controls={`faq-panel${index}-content`}
                >
                  <Typography component="span" variant="h6">
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>{item.answer}</AccordionDetails>
              </MotionAccordion>
            ))}
          </Box>
        </Container>

        <Stack sx={{ position: 'relative' }}>
          <FaqBottomLines />

          {contactHref && (
            <Box sx={contactSectionSx}>
              <motion.div variants={varFade('in')}>
                <Typography variant="h4">{contactTitle}</Typography>
              </motion.div>

              <motion.div variants={varFade('in')}>
                <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
                  {contactDescription}
                </Typography>
              </motion.div>

              <motion.div variants={varFade('in')}>
                <Button
                  color="inherit"
                  variant="contained"
                  href={contactHref}
                  startIcon={resolvedIcon}
                >
                  {contactLabel}
                </Button>
              </motion.div>
            </Box>
          )}
        </Stack>
      </FaqMotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function FaqTopLines() {
  return (
    <>
      <Stack spacing={8} alignItems="center" sx={topTriangleStackSx}>
        <FaqFloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
        <FaqFloatTriangleDownIcon sx={smallTriangleSx} />
      </Stack>

      <FaqFloatLine vertical sx={{ top: 0, left: FAQ_FLOAT_LINE_LEFT }} />
    </>
  );
}

function FaqBottomLines() {
  return (
    <>
      <FaqFloatLine sx={{ top: 0, left: 0 }} />
      <FaqFloatLine sx={{ bottom: 0, left: 0 }} />
      <FaqFloatPlusIcon sx={{ top: -8, left: FAQ_PLUS_ICON_LEFT }} />
      <FaqFloatPlusIcon sx={{ bottom: -8, left: FAQ_PLUS_ICON_LEFT }} />
    </>
  );
}
