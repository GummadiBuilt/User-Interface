// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const environment = {
  production: false,
  configFile: 'assets/config/config.dev.json',
  KEYCLOAK_URL: 'http://localhost:8080',
  KEYCLOAK_REALM: 'Local-Realm',
  KEYCLOAK_CLIENT_ID: 'gummadi-local',
  apiUrl: 'http://localhost:9001/api',
  updatePwdUrl: 'http://localhost:8080/realms/Local-Realm/protocol/openid-connect/auth?response_type=code&client_id=gummadi-local&redirect_uri=http://localhost:4200&kc_action=UPDATE_PASSWORD',
  redirectUrl: 'http://localhost:4200/tenders',
  locationUrl:'https://maps.google.com/maps?q=104,+eSeva+Ln,+KPHB+Phase+III,+K+P+H+B+Phase+3,+Kukatpally,+Hyderabad,+Telangana+500072,+India/@17.488021,78.3937425&t=&z=13&ie=UTF8&iwloc=&output=embed',
};

export { environment as environment }

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
