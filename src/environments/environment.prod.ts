const environment = {
  production: true,
  configFile: 'assets/config/config.dev.json',
  KEYCLOAK_URL: 'http://localhost:8080',
  KEYCLOAK_REALM: 'Local-Realm',
  KEYCLOAK_CLIENT_ID: 'gummadi-local'
};

export { environment as environment }