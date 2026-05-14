import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TECH_ICON_STRIP_LABEL_FONT_SIZE } from './tech-icon-strip.const';
import { iconSlotSx, itemSx, stripWrapperSx, titleSx } from './tech-icon-strip.styles';
import type { TechIconStripProps } from './types';

// ----------------------------------------------------------------------

/**
 * Horizontal strip of icon + label pairs.
 *
 * Use for "Technologies used", "Built with", or any icon-labelled collection.
 * The strip wraps automatically when the container is too narrow.
 *
 * @example
 * ```tsx
 * <TechIconStrip
 *   title="Technologies"
 *   items={[
 *     { icon: <GiselleIcon icon="solar:code-bold" width={32} />, label: 'TypeScript' },
 *     { icon: <GiselleIcon icon="solar:database-bold" width={32} />, label: 'PostgreSQL' },
 *   ]}
 * />
 * ```
 */
export function TechIconStrip({
  items,
  title,
  centeredWrap = false,
  sx,
  ...other
}: TechIconStripProps) {
  return (
    <Box sx={[...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {title && (
        <Typography component="span" sx={titleSx} variant="overline">
          {title}
        </Typography>
      )}

      <Box sx={stripWrapperSx(centeredWrap)}>
        {items.map((item) => (
          <Box key={item.label} sx={itemSx}>
            <Box aria-hidden sx={iconSlotSx}>
              {item.icon}
            </Box>

            <Typography sx={{ fontSize: TECH_ICON_STRIP_LABEL_FONT_SIZE }} variant="caption">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
