import type { FaqSectionProps, FaqItem } from './types';

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
import { SectionTitle } from '../../layout/section/title/section-title';
import { fade } from '../../motion/fade';
import { contentBoxSx, accordionItemSx, contactSectionSx } from './faq-accordion.styles';
import { FaqMotionViewport } from './faq-motion-viewport';
import { FaqTopLines } from './faq-top-lines';
import { FaqBottomLines } from './faq-bottom-lines';

// ----------------------------------------------------------------------

// Wrap Accordion with framer-motion once at module load so the component
// type is stable across renders and accepts both AccordionProps + MotionProps.
const MotionAccordion = motion(Accordion);

/**
 * `FaqSection` renders a full FAQ section with scroll-triggered animated
 * accordions, decorative SVG elements (visible at ≥1440 px), and an optional
 * contact footer.
 *
 * Powered by `framer-motion` — import from `@alexrebula/giselle-mui/motion`.
 *
 * ## Usage
 *
 * ```tsx
 * import { FaqSection } from '@alexrebula/giselle-mui/motion';
 *
 * <FaqSection
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
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
 */
export function FaqSection({
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
}: FaqSectionProps) {
  const [expanded, setExpanded] = useState<string | false>(faqs[0]?.question ?? false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const resolvedIcon =
    typeof contactIcon === 'string' ? <GiselleIcon icon={contactIcon} /> : contactIcon;

  return (
    <Box component="section" sx={[...(Array.isArray(sx) ? sx : [sx])]} {...other}>
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
                variants={fade('inUp', { distance: 24 })}
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
              <motion.div variants={fade('in')}>
                <Typography variant="h4">{contactTitle}</Typography>
              </motion.div>

              <motion.div variants={fade('in')}>
                <Typography sx={{ mt: 2, mb: 3, color: 'text.secondary' }}>
                  {contactDescription}
                </Typography>
              </motion.div>

              <motion.div variants={fade('in')}>
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
