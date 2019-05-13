// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const packageJson = require('../../package.json');

export const environment = {
  appName: 'Epsilon Event Booking',
  envName: 'DEV',
  production: false,
  test: false,
  i18nPrefix: '',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome: packageJson.dependencies['@fortawesome/fontawesome-free'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  },
  firebaseConfig: {
    apiKey: 'AIzaSyCSLk6i8ZOc83lxXZr5moCpM2UX-281Ryo',
    authDomain: 'eventbooking-2318c.firebaseapp.com',
    databaseURL: 'https://eventbooking-2318c.firebaseio.com',
    projectId: 'eventbooking-2318c',
    storageBucket: 'eventbooking-2318c.appspot.com',
    messagingSenderId: '850821356098',
    appId: '1:850821356098:web:2a2d19015b804331'
  }
};
