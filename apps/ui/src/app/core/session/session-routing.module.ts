import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundContainer } from './containers/not-found.container';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'not-found',
        component: NotFoundContainer,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionRoutingModule {}
