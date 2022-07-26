import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardContainer } from './containers';

export const routes: Routes = [
  {
    path: '',
    component: DashboardContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DashboardRoutingModule {}
