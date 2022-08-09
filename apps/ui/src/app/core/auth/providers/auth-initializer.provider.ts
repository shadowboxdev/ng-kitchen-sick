import { APP_INITIALIZER, Provider } from '@angular/core';

import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: 'keycloak-angular-sandbox',
        url: 'http://localhost:8080',
        clientId: 'keycloak-angular'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      },
      bearerExcludedUrls: ['/assets'],
      shouldUpdateToken: (request) =>
        coerceBooleanProperty(request.headers.get('token-update'))
    });
}

export const AUTH_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeKeycloak,
  deps: [KeycloakService],
  multi: true
};
