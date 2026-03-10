// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appRating: {
    iosAppStoreId: '',
    androidPackageName: 'com.practissimo.app'
  },
  legalLinks: {
    iosTermsUrl: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
    androidTermsUrl: '',
    privacyPolicyUrl: ''
  },
  revenuecat: {
    iosApiKey: 'PASTE_NEW_KEY_HERE',
    androidApiKey: 'test_VVabTqzjsbwvLeeMbxwNnxCWwwO',
    entitlementId: 'PracticeQuest Pro',
    productIds: {
      proMonthly: 'monthly',
      proYearly: 'yearly'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
