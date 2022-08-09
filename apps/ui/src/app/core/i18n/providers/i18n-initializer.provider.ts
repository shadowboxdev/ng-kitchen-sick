import { HttpClient } from '@angular/common/http';
import { Provider } from '@angular/core';

import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../../../../environments/environment';

function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}

export const I18N_INITIALIZER: Provider = {
  provide: TranslateLoader,
  useFactory: httpLoaderFactory,
  deps: [HttpClient]
};
