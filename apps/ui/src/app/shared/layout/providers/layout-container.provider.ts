import { InjectionToken } from '@angular/core';

import { LayoutContainer } from '../models';

export const LAYOUT_CONTAINER = new InjectionToken<LayoutContainer>(
  'sdw.layout.layoutContainer'
);
