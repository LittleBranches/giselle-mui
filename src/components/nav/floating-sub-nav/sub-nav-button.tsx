import { useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';

import { subNavButtonSx } from './floating-sub-nav.styles';
import type { SubNavButtonProps } from './types';

// ----------------------------------------------------------------------

export function SubNavButton({ item, isActive, onPress }: SubNavButtonProps) {
  const handleClick = useCallback(() => onPress(item.id), [onPress, item.id]);

  return (
    <Tooltip title={item.label} placement="top" arrow>
      <ButtonBase
        disableRipple
        component="button"
        type="button"
        aria-label={item.label}
        aria-pressed={isActive}
        onClick={handleClick}
        sx={subNavButtonSx(isActive)}
      >
        {item.icon}
      </ButtonBase>
    </Tooltip>
  );
}
