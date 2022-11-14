const environment = {
  production: true,
  configFile: 'assets/config/config.dev.json',
  KEYCLOAK_URL: 'https://gummadibuilt.com/auth',
  KEYCLOAK_REALM: 'Local-Realm',
  KEYCLOAK_CLIENT_ID: 'gummadi-local',
  apiUrl: 'https://gummadibuilt.com/api/'
};

export { environment as environment }