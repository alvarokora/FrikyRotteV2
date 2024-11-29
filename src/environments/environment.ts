// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDPEsc6ozT78v5iHGVcU92uewzrBf85WhU",
    authDomain: "frikyrottev2.firebaseapp.com",
    projectId: "frikyrottev2",
    storageBucket: "frikyrottev2.firebasestorage.app",
    messagingSenderId: "653590668033",
    appId: "1:653590668033:web:04601d040ef191a4e6b100",
    measurementId: "G-6Y74XB6HY4"
  },
  tmdb: {
    apiKey: '7193c40a0550f4af72011ea24f8b7777',
    baseUrl: 'https://api.themoviedb.org/3'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
