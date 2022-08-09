import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatFabMenuModule } from '@angular-material-extensions/fab-menu';
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

import { LayoutModule } from '../../shared/layout';
import { DashboardContainer } from './containers';
import { DashboardRoutingModule } from './dashboard-routing.module';

const DECLARATIONS: Type<unknown>[] = [DashboardContainer];

const NG_IMPORTS: Type<unknown>[] = [CommonModule, FlexLayoutModule];

const SHARED_IMPORTS: Type<unknown>[] = [LayoutModule];

const OTHER_IMPORTS: Type<unknown>[] = [
  FontAwesomeModule,
  MatFabMenuModule,
  DashboardRoutingModule
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...NG_IMPORTS, ...OTHER_IMPORTS, ...SHARED_IMPORTS]
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
