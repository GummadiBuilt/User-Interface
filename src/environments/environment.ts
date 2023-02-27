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
  locationUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237.9281874335002!2d78.44329757027158!3d17.41893684138086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb973185347091%3A0xeb526c517189dfc1!2s8-2-548%2F24%2C%20Rd%20Number%207%2C%20Vimal%20Nagar%2C%20Zahara%20Nagar%2C%20Banjara%20Hills%2C%20Hyderabad%2C%20Telangana%20500873!5e0!3m2!1sen!2sin!4v1676985389277!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
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
