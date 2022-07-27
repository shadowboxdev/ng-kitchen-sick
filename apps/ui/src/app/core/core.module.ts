/* eslint-disable @typescript-eslint/ban-types */
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  Provider,
  SkipSelf,
  Type
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import {
  faCog,
  faBars,
  faRocket,
  faPowerOff,
  faUserCircle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faMediumM,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

import { APP_ERROR_HANDLER } from './services';
import { ROUTE_SERIALIZER } from './routing';
import { HTTP_ERROR_INTERCEPTOR } from './interceptors';

import { environment } from '../../environments/environment';
import { reducers, metaReducers } from './reducers';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function httpLoaderFactory(http: HttpClient) {
  console.log('here');
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}

// state imports
const STATE_IMPORTS: (Type<unknown> | ModuleWithProviders<{}> | never[])[] = [
  StoreModule.forRoot(reducers, { metaReducers }),
  StoreRouterConnectingModule.forRoot(),
  !environment.production ? StoreDevtoolsModule.instrument() : []
];

const MAT_IMPORTS: Type<unknown>[] = [MatSnackBarModule];

// 3rd party imports
const OTHER_IMPORTS: (Type<unknown> | ModuleWithProviders<{}>)[] = [
  NgxGoogleAnalyticsRouterModule,
  FontAwesomeModule
];

const PROVIDERS: Provider[] = [
  HTTP_ERROR_INTERCEPTOR,
  APP_ERROR_HANDLER,
  ROUTE_SERIALIZER
];

@NgModule({
  imports: [
    ...MAT_IMPORTS,
    ...OTHER_IMPORTS,
    ...STATE_IMPORTS,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [...PROVIDERS]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    faIconLibrary: FaIconLibrary
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }

    faIconLibrary.addIcons(
      faCog,
      faBars,
      faRocket,
      faPowerOff,
      faUserCircle,
      faPlayCircle,
      faGithub,
      faMediumM,
      faTwitter,
      faInstagram,
      faYoutube
    );
  }
}
