import { FaqFloatLine, FaqFloatPlusIcon } from './faq-accordion-svg';
import { FAQ_PLUS_ICON_LEFT } from './faq-accordion.const';

// ----------------------------------------------------------------------

/**
 * Decorative bottom-edge elements for `FaqAccordion`.
 * Renders horizontal float lines and plus icons that frame the contact footer.
 *
 * @internal — used by `FaqAccordion` only.
 */
export function FaqBottomLines() {
  return (
    <>
      <FaqFloatLine sx={{ top: 0, left: 0 }} />
      <FaqFloatLine sx={{ bottom: 0, left: 0 }} />
      <FaqFloatPlusIcon sx={{ top: -8, left: FAQ_PLUS_ICON_LEFT }} />
      <FaqFloatPlusIcon sx={{ bottom: -8, left: FAQ_PLUS_ICON_LEFT }} />
    </>
  );
}
