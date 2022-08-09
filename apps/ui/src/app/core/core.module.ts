/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient } from '@angular/common/http';
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
import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { KeycloakAngularModule } from 'keycloak-angular';
import { NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { NgxPermissionsModule } from 'ngx-permissions';

import { environment } from '../../environments/environment';
import { AuthModule } from './auth';
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
  SessionModule
];

// 3rd party imports
const OTHER_IMPORTS: (Type<unknown> | ModuleWithProviders<{}>)[] = [
  NgxGoogleAnalyticsRouterModule,
  KeycloakAngularModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient]
    }
  }),
  NgxPermissionsModule.forRoot()
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

    this._setI18n();
  }

  private _setI18n(): void {
    this._translate.addLangs(['en', 'fr']);
    this._translate.setDefaultLang('en');

    const browserLang = this._translate.getBrowserLang();
    this._translate.use(browserLang?.match(/en|fr/) ? browserLang : 'en');
  }
}

function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}

function throwAlreadyLoadedError(): void {
  throw new Error('CoreModule is already loaded. Import only in AppModule');
}
