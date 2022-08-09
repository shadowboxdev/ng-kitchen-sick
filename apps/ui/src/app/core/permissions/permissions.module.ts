import { ModuleWithProviders, NgModule, Provider, Type } from '@angular/core';

import { NgxPermissionsModule } from 'ngx-permissions';

import { PERMISSIONS_INITIALIZER } from './providers';

// eslint-disable-next-line @typescript-eslint/ban-types
const PERMISSIONS_IMPORTS: (Type<unknown> | ModuleWithProviders<{}>)[] = [
  NgxPermissionsModule.forRoot()
];

const PROVIDERS: Provider[] = [PERMISSIONS_INITIALIZER];

@NgModule({
  imports: [...PERMISSIONS_IMPORTS],
  exports: [NgxPermissionsModule],
  providers: [...PROVIDERS]
})
export class PermissionsModule {}
