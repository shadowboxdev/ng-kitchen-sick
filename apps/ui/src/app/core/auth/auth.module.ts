import { NgModule, Provider, Type } from '@angular/core';

import { KeycloakAngularModule } from 'keycloak-angular';

import { AUTH_INITIALIZER } from './providers';

const AUTH_IMPORTS: Type<unknown>[] = [KeycloakAngularModule];

const PROVIDERS: Provider[] = [AUTH_INITIALIZER];

@NgModule({
  imports: [...AUTH_IMPORTS],
  exports: [...AUTH_IMPORTS],
  providers: [...PROVIDERS]
})
export class AuthModule {}
