const packageJson = require('../../package.json');

export const environment = {
  appName: 'Epsilon Event Booking',
  envName: 'PROD',
  production: true,
  test: false,
  i18nPrefix: '/epsilon-event-booking',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome:
      packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
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
