import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Styles for the `PhaseCard` component.
 *
 * This file is the beginning of the full sx extraction (roadmap R1). The immediate
 * need is the `photos` render block added in the `feature/photos-array-slot` PR.
 * Remaining inline sx blocks will be extracted in the R1 refactor pass.
 *
 * Static constants are created once at module load — zero per-render allocation.
 * Dynamic factories (`(arg) => SxProps<Theme>`) create a new object on every call.
 * ⚠️ Performance note: if a dynamic factory is called inside a `.map()` that runs
 * on every render, wrap the call site in `useMemo` if the phase array is stable.
 */

/**
 * Photo `<img>` element inside a phase card.
 *
 * The top margin differs between the first photo and subsequent ones:
 * - First photo: `mt: 2` — extra breathing room after the description.
 * - Additional photos: `mt: 1` — tighter gap within the photo strip.
 *
 * ⚠️ Performance note: this factory creates a new object on every call.
 * It is called inside `.map()` — keep it cheap (no heavy derivations).
 *
 * @param isFirst - True for the first photo in the array (`i === 0`).
 */
export const photoImgSx = (isFirst: boolean): SxProps<Theme> => ({
  mt: isFirst ? 2 : 1,
  width: '100%',
  maxWidth: 200,
  aspectRatio: '4/3',
  objectFit: 'cover',
  borderRadius: 1.5,
  border: '2px solid',
  borderColor: 'divider',
  display: 'block',
});
