import {
  ModuleWithProviders,
  NgModule,
  Optional,
  Provider,
  SkipSelf,
  Type
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
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

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}

const MAT_IMPORTS: Type<unknown>[] = [MatSnackBarModule];

// 3rd party imports
// eslint-disable-next-line @typescript-eslint/ban-types
const OTHER_IMPORTS: (Type<unknown> | ModuleWithProviders<{}>)[] = [
  NgxGoogleAnalyticsRouterModule,
  FontAwesomeModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient]
    }
  })
];

const PROVIDERS: Provider[] = [
  HTTP_ERROR_INTERCEPTOR,
  APP_ERROR_HANDLER,
  ROUTE_SERIALIZER
];

@NgModule({
  imports: [...MAT_IMPORTS, ...OTHER_IMPORTS],
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
