import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faChartBar,
  faChartPie,
  faPercent,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

import { DashboardContainer } from './containers';
import { DashboardRoutingModule } from './dashboard-routing.module';

const DECLARATIONS: Type<unknown>[] = [DashboardContainer];

const NG_IMPORTS: Type<unknown>[] = [CommonModule];

const OTHER_IMPORTS: Type<unknown>[] = [FontAwesomeModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...NG_IMPORTS, ...OTHER_IMPORTS, DashboardRoutingModule]
})
export class DashboardModule {
  constructor(_faIconLibrary: FaIconLibrary) {
    _faIconLibrary.addIcons(
      faArrowUp,
      faArrowDown,
      faPercent,
      faUsers,
      faChartBar,
      faChartPie
    );
  }
}
