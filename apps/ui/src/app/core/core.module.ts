/* eslint-disable @typescript-eslint/ban-types */
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  Provider,
  SkipSelf,
  Type
} from '@angular/core';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateService } from '@ngx-translate/core';
import { NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { environment } from '../../environments/environment';
import { AuthModule } from './auth';
import { I18nModule } from './i18n';
import { HTTP_ERROR_INTERCEPTOR } from './interceptors';
import { PermissionsModule } from './permissions';
import { reducers, metaReducers } from './reducers';
import { ROUTE_SERIALIZER } from './routing';
import { APP_ERROR_HANDLER } from './services';
import { SessionModule } from './session';

// state imports
const STATE_IMPORTS: (Type<unknown> | ModuleWithProviders<{}> | never[])[] = [
  StoreModule.forRoot(reducers, { metaReducers }),
  StoreRouterConnectingModule.forRoot(),
  !environment.production ? StoreDevtoolsModule.instrument() : []
];

const MAT_IMPORTS: Type<unknown>[] = [MatSnackBarModule];

const CORE_IMPORTS: Type<unknown>[] = [
  AuthModule,
  PermissionsModule,
  I18nModule,
  SessionModule
];

// 3rd party imports
const OTHER_IMPORTS: (Type<unknown> | ModuleWithProviders<{}>)[] = [
  NgxGoogleAnalyticsRouterModule
];

const PROVIDERS: Provider[] = [
  HTTP_ERROR_INTERCEPTOR,
  APP_ERROR_HANDLER,
  ROUTE_SERIALIZER
];

@NgModule({
  imports: [
    ...MAT_IMPORTS,
    ...CORE_IMPORTS,
    ...OTHER_IMPORTS,
    ...STATE_IMPORTS
  ],
  providers: [...PROVIDERS]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    private readonly _translate: TranslateService
  ) {
    if (parentModule) throwAlreadyLoadedError();
  }
}

function throwAlreadyLoadedError(): void {
  throw new Error('CoreModule is already loaded. Import only in AppModule');
}
