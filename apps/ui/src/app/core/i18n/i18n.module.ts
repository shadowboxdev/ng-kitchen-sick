import { ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { I18N_INITIALIZER } from './providers';

// eslint-disable-next-line @typescript-eslint/ban-types
const I18N_IMPORTS: (Type<unknown> | ModuleWithProviders<{}>)[] = [
  TranslateModule.forRoot({
    loader: I18N_INITIALIZER
  })
];

const PROVIDERS: Provider[] = [];

@NgModule({
  imports: [...I18N_IMPORTS],
  exports: [TranslateModule],
  providers: [...PROVIDERS]
})
export class I18nModule {
  constructor(private readonly _translate: TranslateService) {
    this._setI18n();
  }

  private _setI18n(): void {
    this._translate.addLangs(['en', 'fr']);
    this._translate.setDefaultLang('en');

    const browserLang = this._translate.getBrowserLang();
    this._translate.use(browserLang?.match(/en|fr/) ? browserLang : 'en');
  }
}
