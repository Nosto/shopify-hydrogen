import * as React from 'react';
import { NostoPlacement as NostoComponent } from '@nosto/nosto-react';
import type { NostoPlacementProps } from '@nosto/nosto-react';

export function NostoPlacement(props: NostoPlacementProps) {
  return <NostoComponent {...props} />;
}