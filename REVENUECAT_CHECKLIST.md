# RevenueCat Quick Setup Checklist

## ✅ Already Complete
- [x] Install @revenuecat/purchases-capacitor package
- [x] Create RevenueCatService
- [x] Create PaywallModalComponent
- [x] Configure environment files with API keys
- [x] Initialize RevenueCat in app.component.ts
- [x] Link native dependencies (iOS & Android)

## 🔲 To Do

### Store Setup
- [ ] Create `pro_monthly` subscription in App Store Connect
- [ ] Create `pro_yearly` subscription in App Store Connect
- [ ] Create `pro_monthly` subscription in Google Play Console
- [ ] Create `pro_yearly` subscription in Google Play Console

### RevenueCat Dashboard
- [ ] Create/verify project in RevenueCat
- [ ] Add iOS app with bundle ID: `com.practissimo.app`
- [ ] Add Android app with package: `com.practissimo.app`
- [ ] Verify API keys match environment.prod.ts
- [ ] Create `pro` entitlement
- [ ] Add `pro_monthly` product (iOS & Android)
- [ ] Add `pro_yearly` product (iOS & Android)
- [ ] Create default offering
- [ ] Add monthly package to offering
- [ ] Add yearly package to offering
- [ ] Attach products to `pro` entitlement
- [ ] Set offering as current

### Testing
- [ ] Test on iOS device (not simulator)
- [ ] Test on Android device with signed build
- [ ] Verify paywall displays packages
- [ ] Complete test purchase
- [ ] Verify pro features unlock
- [ ] Test restore purchases
- [ ] Test subscription management link

### Before Production
- [ ] Add privacy policy URL to environment.prod.ts
- [ ] Add terms of use URLs to environment.prod.ts
- [ ] Test on multiple devices
- [ ] Verify REVENUECAT_BYPASS is false

## Quick Commands

```bash
# Build and sync for mobile
npm run build:mobile

# Android specific
npm run android:sync
npm run android:open

# iOS specific
npx cap sync ios
npx cap open ios

# Build Android release bundle
npm run android:bundle:release
```

## Need Help?

See REVENUECAT_SETUP.md for detailed instructions.
