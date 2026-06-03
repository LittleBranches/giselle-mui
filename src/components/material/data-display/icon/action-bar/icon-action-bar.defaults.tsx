import type { IconActionItem } from './types';

import { GiselleIcon } from '../giselle';

// ----------------------------------------------------------------------

/**
 * Default actions rendered when no `actions` prop is supplied.
 *
 * Uses the same Solar icon set as the source reference (invoice toolbar):
 * Edit, View, Print, Send, Share.
 */
export const DEFAULT_ICON_ACTIONS: IconActionItem[] = [
  { tooltip: 'Edit', icon: <GiselleIcon icon="solar:pen-bold" /> },
  { tooltip: 'View', icon: <GiselleIcon icon="solar:eye-bold" /> },
  {
    tooltip: 'Print',
    icon: <GiselleIcon icon="solar:printer-minimalistic-bold" />,
  },
  { tooltip: 'Send', icon: <GiselleIcon icon="mdi:email" /> },
  { tooltip: 'Share', icon: <GiselleIcon icon="solar:share-bold" /> },
];
