/* eslint-disable @typescript-eslint/ban-types */
import { HttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  Optional,
  Provider,
  SkipSelf,
  Type
} from '@angular/core';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import {
  faGithub,
  faMediumM,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import {
  faCog,
  faBars,
  faRocket,
  faPowerOff,
  faUserCircle,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';

import { environment } from '../../environments/environment';
import { HTTP_ERROR_INTERCEPTOR } from './interceptors';
import { reducers, metaReducers } from './reducers';
import { ROUTE_SERIALIZER } from './routing';
import { APP_ERROR_HANDLER } from './services';

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
  FontAwesomeModule,
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
  ROUTE_SERIALIZER,
  {
    provide: APP_INITIALIZER,
    useFactory: (ps: NgxPermissionsService) => () => ps.loadPermissions([]),
    deps: [NgxPermissionsService],
    multi: true
  }
];

@NgModule({
  imports: [...MAT_IMPORTS, ...OTHER_IMPORTS, ...STATE_IMPORTS],
  providers: [...PROVIDERS]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    private readonly _faIconLibrary: FaIconLibrary,
    private readonly _translate: TranslateService
  ) {
    if (parentModule) throwAlreadyLoadedError();

    this._addFaIcons();
    this._setI18n();
  }

  private _addFaIcons(): void {
    this._faIconLibrary.addIcons(
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
