import { PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';

export const environment = {
  production: true,
  auth: {
    authServerUrl: '',
    realm: '',
    clientId: '',
    secret: '',
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    tokenValidation: TokenValidation.ONLINE
  }
};
