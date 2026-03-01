# RevenueCat Setup Guide for Practissimo

## Current Status
✅ Code implementation complete
⚠️ Store configuration needed

## Step-by-Step Setup

### 1. App Store Connect (iOS)

1. Go to https://appstoreconnect.apple.com
2. Select your app "PracticeQuest"
3. Navigate to **Features** → **In-App Purchases**
4. Click **+** to create new subscription group (if needed)
5. Create two auto-renewable subscriptions:

   **Monthly Subscription:**
   - Reference Name: `PracticeQuest Pro Monthly`
   - Product ID: `pro_monthly`
   - Subscription Duration: 1 month
   - Price: $0.99 (or your preferred price)

   **Yearly Subscription:**
   - Reference Name: `PracticeQuest Pro Yearly`
   - Product ID: `pro_yearly`
   - Subscription Duration: 1 year
   - Price: $9.99 (or your preferred price)

6. Add localized descriptions and screenshots for each subscription
7. Submit for review

### 2. Google Play Console (Android)

1. Go to https://play.google.com/console
2. Select your app
3. Navigate to **Monetize** → **Subscriptions**
4. Click **Create subscription**
5. Create two subscriptions:

   **Monthly Subscription:**
   - Product ID: `pro_monthly`
   - Name: `PracticeQuest Pro Monthly`
   - Billing period: 1 month
   - Price: $0.99 (or your preferred price)

   **Yearly Subscription:**
   - Product ID: `pro_yearly`
   - Name: `PracticeQuest Pro Yearly`
   - Billing period: 1 year
   - Price: $9.99 (or your preferred price)

6. Activate both subscriptions

### 3. RevenueCat Dashboard Configuration

1. Go to https://app.revenuecat.com
2. Create a new project or select existing
3. **Add iOS App:**
   - Bundle ID: `com.practissimo.app`
   - App Store Connect API Key (or Shared Secret)
   - Copy the iOS API key (already in your environment.prod.ts)

4. **Add Android App:**
   - Package Name: `com.practissimo.app`
   - Google Play Service Credentials JSON
   - Copy the Android API key (already in your environment.prod.ts)

5. **Create Entitlement:**
   - Name: `pro`
   - This is already configured in your code

6. **Create Products:**
   - Go to Products tab
   - Add `pro_monthly` for both iOS and Android
   - Add `pro_yearly` for both iOS and Android

7. **Create Offering:**
   - Name: `default` (or custom name)
   - Add packages:
     - Monthly package → attach `pro_monthly`
     - Annual package → attach `pro_yearly`
   - Make this offering current

8. **Attach Products to Entitlement:**
   - Go to Entitlements
   - Select `pro` entitlement
   - Attach both `pro_monthly` and `pro_yearly` products

### 4. Testing (Sandbox Mode)

**Important:** Testing automatically uses sandbox environments - no real money is charged!

#### iOS Sandbox Testing:
```bash
# Build and sync
npm run build:mobile

# Open in Xcode
npx cap open ios
```

**Setup Sandbox Test User:**
1. Go to App Store Connect → Users and Access → Sandbox Testers
2. Create a new sandbox tester with a unique email
3. **Sign out** of your real Apple ID on the test device (Settings → App Store)
4. Run the app from Xcode
5. When prompted to sign in during purchase, use sandbox tester credentials
6. Sandbox purchases are FREE and auto-approve

**iOS Sandbox Notes:**
- Must use a real device (simulator won't show products)
- Don't sign into App Store with sandbox account - only use it when prompted during purchase
- Subscriptions renew every few minutes in sandbox for testing

#### Android Sandbox Testing:
```bash
# Build and sync
npm run android:sync

# Open in Android Studio
npx cap open android
```

**Setup Android Testing:**
1. Go to Play Console → Setup → License testing
2. Add your Gmail account as a license tester
3. Build and install a **signed** debug/release build on device
4. Purchases are FREE for license testers
5. Use "android.test.purchased" for instant test purchases

**Android Sandbox Notes:**
- Must use a signed build (not debug from Android Studio)
- Test account must be added as license tester in Play Console
- Subscriptions auto-cancel after 5 minutes in sandbox

#### Sandbox Test Checklist:
- [ ] App initializes without errors
- [ ] Paywall modal displays available packages
- [ ] Purchase flow completes (no real charge)
- [ ] Pro features unlock after purchase
- [ ] Restore purchases works
- [ ] Subscription status persists across app restarts
- [ ] Test subscription renewal (happens quickly in sandbox)
- [ ] Test with different package types (monthly/yearly)

### 5. Verify API Keys

Your current API keys in `environment.prod.ts`:
- iOS: `appl_uVkvBFJbNrIUqdEQKOCdsuAozoP`
- Android: `goog_vWKiSbXUDEZCQJNJbnFIDWzEULA`

Make sure these match your RevenueCat dashboard.

### 6. Common Issues & Solutions

**Issue: "No available packages"**
- Solution: Ensure offering is marked as "current" in RevenueCat dashboard
- Verify products are attached to the offering

**Issue: "Unable to initialize purchases"**
- Solution: Check API keys match RevenueCat dashboard
- Verify bundle ID / package name matches exactly

**Issue: Purchases not unlocking features**
- Solution: Verify entitlement ID is `pro` in RevenueCat
- Check that products are attached to the `pro` entitlement

**Issue: Testing on simulator shows no products**
- Solution: iOS requires a real device for StoreKit
- For Android, use a signed build with license tester account

**Issue: "Cannot connect to iTunes Store" in sandbox**
- Solution: Sign out of real Apple ID first
- Only enter sandbox credentials when prompted during purchase

**Issue: Android shows "Item not available"**
- Solution: Ensure you're using a signed build
- Verify your account is added as license tester in Play Console
- Products must be "Active" in Play Console

### 7. Production Checklist

Before releasing:
- [ ] Complete all sandbox testing
- [ ] Test purchases on real devices (iOS and Android)
- [ ] Verify restore purchases works
- [ ] Test subscription renewal in sandbox
- [ ] Add privacy policy URL to `environment.prod.ts`
- [ ] Add terms of use URL to `environment.prod.ts`
- [ ] Test paywall on different screen sizes
- [ ] Verify subscription management links work
- [ ] Verify `REVENUECAT_BYPASS = false` in production
- [ ] Remove any sandbox test accounts from device
- [ ] Test with real Apple ID in production (small purchase to verify)

**Production vs Sandbox:**
- Sandbox: Automatic when running from Xcode/Android Studio with test accounts
- Production: Automatic when app is downloaded from App Store/Play Store
- RevenueCat handles this automatically - no code changes needed

### 8. How to Show the Paywall

Your paywall is already integrated. To show it anywhere in your app:

```typescript
import { ModalController } from '@ionic/angular/standalone';
import { PaywallModalComponent } from './shared/components/paywall-modal.component';

// In your component:
constructor(private modalController: ModalController) {}

async showPaywall() {
  const modal = await this.modalController.create({
    component: PaywallModalComponent,
    componentProps: {
      reason: 'Unlock advanced chord library features'
    }
  });
  await modal.present();
}
```

### 9. Check Pro Status

To check if user is Pro anywhere in your app:

```typescript
import { RevenueCatService } from './core/services/revenuecat.service';

// In your component:
constructor(private revenueCat: RevenueCatService) {}

// Use the signal
isPro = this.revenueCat.isPro;

// In template:
@if (isPro()) {
  <div>Pro content here</div>
}
```

## Support Resources

- RevenueCat Docs: https://docs.revenuecat.com
- Capacitor Plugin: https://github.com/RevenueCat/purchases-capacitor
- App Store Connect: https://appstoreconnect.apple.com
- Google Play Console: https://play.google.com/console
