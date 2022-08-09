import { NgModule, Type } from '@angular/core';

import { NotFoundContainer } from './containers/not-found.container';
import { SessionRoutingModule } from './session-routing.module';

const DECLARATIONS: Type<unknown>[] = [NotFoundContainer];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SessionRoutingModule],
  providers: []
})
export class SessionModule {}
