const environment = {
  production: true,
  configFile: 'assets/config/config.dev.json',
  KEYCLOAK_URL: 'https://gummadibuilt.com/auth',
  KEYCLOAK_REALM: 'Local-Realm',
  KEYCLOAK_CLIENT_ID: 'gummadi-local',
  apiUrl: 'https://gummadibuilt.com/api/',
  updatePwdUrl: 'https://gummadibuilt.com/auth/realms/Local-Realm/protocol/openid-connect/auth?response_type=code&client_id=gummadi-local&redirect_uri=https://gummadibuilt.com&kc_action=UPDATE_PASSWORD',
  redirectUrl: 'https://gummadibuilt.com/tenders'
};

export { environment as environment }