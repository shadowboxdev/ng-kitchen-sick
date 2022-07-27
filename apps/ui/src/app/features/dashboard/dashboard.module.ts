import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { DashboardContainer } from './containers';
import { DashboardRoutingModule } from './dashboard-routing.module';

const DECLARATIONS: Type<unknown>[] = [DashboardContainer];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, DashboardRoutingModule]
})
export class DashboardModule {}
