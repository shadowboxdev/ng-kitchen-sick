import { PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';

export const environment = {
  production: false,
  auth: {
    authServerUrl: 'http://localhost:8080',
    realm: 'keycloak-angular-sandbox',
    clientId: 'nest-api',
    secret: 'qYwCJmgsUy5OT6sCm3MoUyiJEZwBMlCX',
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE, // optional
    tokenValidation: TokenValidation.ONLINE // optional
  }
};
