// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  ganttTrackSx,
  popoverPaperSx,
  sliderRowHeaderSx,
  actionsRowSx,
} from './styles';

// ----------------------------------------------------------------------

describe('ganttTrackSx', () => {
  it('is relatively positioned with a subtle background', () => {
    expect(ganttTrackSx).toMatchObject({
      position: 'relative',
      bgcolor: 'action.hover',
    });
  });
});

describe('popoverPaperSx', () => {
  it('uses fixed 340px width column layout', () => {
    expect(popoverPaperSx).toMatchObject({
      width: 340,
      display: 'flex',
      flexDirection: 'column',
    });
  });
});

describe('sliderRowHeaderSx', () => {
  it('aligns title and date range on opposite ends', () => {
    expect(sliderRowHeaderSx).toMatchObject({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });
  });
});

describe('actionsRowSx', () => {
  it('wraps to prevent overflow on narrow popovers', () => {
    expect(actionsRowSx).toMatchObject({
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    });
  });
});
