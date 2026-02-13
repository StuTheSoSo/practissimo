# Android Play Store Release Checklist

This project now includes a Capacitor Android app at `android/`.

## 1. Local Prerequisites

Install and configure before building:

- JDK 21 (required by Android Gradle plugin 8.x)
- Android Studio (latest stable) with Android SDK and build tools
- `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) set
- A Play Console app created for package ID `com.practissimo.app`

Verify Java:

```bash
java -version
```

If `java` is missing, Android Gradle sync/build will fail.

## 2. RevenueCat Android Key

`src/environments/environment.prod.ts` currently has:

- `revenuecat.androidApiKey: ''` (empty)

Set this to your RevenueCat Android public SDK key before release, or the in-app purchase flow will not initialize on Android.

## 3. Versioning

Update release version in `android/app/build.gradle`:

- `versionCode` must increase every upload
- `versionName` should match the user-facing release version

## 4. Signing Setup (Upload Key)

Generate upload keystore once:

```bash
keytool -genkeypair -v -keystore release-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Create `android/keystore.properties` from `android/keystore.properties.example` and fill real values.

Notes:

- `android/keystore.properties` is gitignored
- `*.jks` and `*.keystore` are gitignored
- Release signing is automatically picked up by `android/app/build.gradle` when `keystore.properties` exists

## 5. Build AAB

Use helper script:

```bash
npm run android:bundle:release
```

Output bundle:

- `android/app/build/outputs/bundle/release/app-release.aab`

## 6. Store Listing Assets (Google Play)

Prepare these in Play Console:

- App name + short and full descriptions
- Privacy policy URL
- 512x512 app icon
- Feature graphic (1024x500)
- Phone screenshots (required)
- Data safety form
- Content rating questionnaire
- Target audience and ads declaration

## 7. Upload + Rollout

In Play Console:

1. Create production release.
2. Upload `app-release.aab`.
3. Add release notes.
4. Complete pre-launch checks.
5. Start rollout (staged rollout recommended for first release).

## 8. Commands Added

In `package.json`:

- `npm run android:sync`
- `npm run android:open`
- `npm run android:bundle:release`

