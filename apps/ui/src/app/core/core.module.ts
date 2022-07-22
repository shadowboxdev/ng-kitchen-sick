import { NgModule } from '@angular/core';
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule
} from 'ngx-google-analytics';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    NgxGoogleAnalyticsModule.forRoot(environment.ga),
    NgxGoogleAnalyticsRouterModule
  ],
  providers: []
})
export class CoreModule {}
