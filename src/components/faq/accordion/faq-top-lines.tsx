import Stack from '@mui/material/Stack';

import { topTriangleStackSx, smallTriangleSx } from './faq-accordion.styles';
import { FaqFloatTriangleDownIcon, FaqFloatLine } from './faq-accordion-svg';
import { FAQ_FLOAT_LINE_LEFT } from './faq-accordion.const';

// ----------------------------------------------------------------------

/**
 * Decorative top-edge elements for `FaqAccordion`.
 * Renders stacked triangle icons and a vertical float line on the left edge.
 *
 * @internal — used by `FaqAccordion` only.
 */
export function FaqTopLines() {
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
