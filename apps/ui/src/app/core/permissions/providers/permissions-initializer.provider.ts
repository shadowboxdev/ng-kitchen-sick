import { APP_INITIALIZER, Provider } from '@angular/core';

import { NgxPermissionsService } from 'ngx-permissions';

const initializePermissions = (ps: NgxPermissionsService) => () =>
  ps.loadPermissions([]);

export const PERMISSIONS_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializePermissions,
  deps: [NgxPermissionsService],
  multi: true
};
