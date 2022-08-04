import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { included, isArray } from 'ramda-adjunct';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) await this._login(state.url);

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!isArray(requiredRoles) || !requiredRoles.length) return true;

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every(included(this.roles));
  }

  private async _login(url: string): Promise<void> {
    return await this.keycloak.login({
      redirectUri: `${window.location.origin}${url}`
    });
  }
}
