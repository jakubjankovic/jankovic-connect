# Jankovič Connect

A premium **native Android** networking app for **Jakub Benjamin Jankovič**, built with **React Native CLI + TypeScript**. It is your personal owner app for in-person networking events: show your QR code, write your public digital-card URL to NFC tags, and fire off quick contact/networking actions. A matching static **public landing page** (in [`/landing-page`](./landing-page)) is what other people see after scanning the QR code or tapping the NFC tag.

> This is a React Native CLI project — **not** a PWA, not a web-only app, not Expo Go, not a Kotlin/Compose-only app. It opens in Android Studio and runs on a physical phone over USB.

---

## ⚡ Quick local build (Windows / normal PowerShell)

Run these in a **regular PowerShell window** (the prerequisites in section 4 must be installed first). See [`BUILD_STATUS.md`](./BUILD_STATUS.md) for what has already been verified.

```powershell
cd "C:\Users\Jakub Jankovič\Documents\Claude VibeCode Session"
npm install
npm run typecheck
cd android
.\gradlew.bat assembleDebug
```

**APK path:**

```
android\app\build\outputs\apk\debug\app-debug.apk
```

**Install on your phone** (USB debugging on, "Allow USB debugging" accepted):

```powershell
adb devices
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

**Live development with Metro** (builds, installs, hot-reloads):

```powershell
npx react-native run-android
```

> If `npm` reports `running scripts is disabled on this system`, run PowerShell once as Administrator and execute:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` — or simply use `npm.cmd ...` instead of `npm ...`.

See the [Troubleshooting](#troubleshooting) section at the bottom for common errors.

---

## 1. What Jankovič Connect is

- A personal Android app that helps people connect with you in seconds via: QR code, NFC card/tag/sticker, save contact, LinkedIn, email (open + copy), call, Facebook, and **Book a Meeting** with real-time Google Calendar availability.
- A built-in **Follow-up Helper** that generates a warm, professional Slovak follow-up message you can copy into LinkedIn or email.
- A static **public landing page** that mirrors the app's visual identity and lets visitors save your contact (`.vcf`), reach you, and book a meeting — no login, no data collection.

## 2. Why it is a React Native CLI native Android app

- **Native APIs**: NFC writing (`react-native-nfc-manager`), native Android *insert contact* intent (custom Kotlin module), dialer/email/browser intents — these need a real native app, not a web page.
- **React Native CLI** (not Expo Go) so the project includes the full native `android/` project, can use any native module, and produces an installable APK.
- **TypeScript** for safety and clarity across screens, components, and utilities.

## 3. How the Android app works

Four screens (React Navigation native stack):

| Screen | What it does |
| --- | --- |
| **Home** | Hero + all quick actions (Save Contact, LinkedIn, Email, Copy Email, Call, Book a Meeting, Facebook) and navigation to the tools below. |
| **Share My Card** | Large QR code pointing to your public card URL, Copy Link, Save Contact, LinkedIn, Book a Meeting. |
| **NFC Setup** | Detects NFC support/enabled state and writes an NDEF URI record (your public card URL) to a physical tag. Clear states: available / not available / disabled / ready / writing / success / failed. |
| **Follow-up Helper** | Inputs (name, place, topic, next step) → generates a Slovak follow-up message → Copy Message. |

Key source files:

- App entry + navigation: [`App.tsx`](./App.tsx)
- Screens: [`src/screens`](./src/screens)
- Reusable UI: [`src/components`](./src/components)
- Contact / link / clipboard actions: [`src/utils/actions.ts`](./src/utils/actions.ts)
- Follow-up generator: [`src/utils/followUp.ts`](./src/utils/followUp.ts)
- **Profile data + the two placeholders**: [`src/constants/profile.ts`](./src/constants/profile.ts)
- Native contact-insert module: [`android/app/src/main/java/com/jankovicconnect/ContactModule.kt`](./android/app/src/main/java/com/jankovicconnect/ContactModule.kt)

## 4. Install prerequisites

You need a working React Native Android environment:

1. **Node.js** 18+ — <https://nodejs.org> (LTS).
2. **Java JDK 17** — required by Android Gradle Plugin 8.x. Easiest: install the JDK bundled with Android Studio, or Temurin 17.
3. **Android Studio** (latest) — <https://developer.android.com/studio>. During setup install:
   - **Android SDK Platform 34**
   - **Android SDK Build-Tools 34.0.0**
   - **Android SDK Platform-Tools** (gives you `adb`)
   - **Android Emulator** (optional) and an **NDK 26.1.x** if prompted.
4. **Android SDK environment variables** (so the CLI finds the SDK):
   - Windows (PowerShell, set permanently via System settings or):
     ```powershell
     setx ANDROID_HOME "$env:LOCALAPPDATA\Android\Sdk"
     ```
     Then add `%ANDROID_HOME%\platform-tools` to your `Path`.

Verify:

```powershell
node -v
java -version
adb --version
```

> Official, always-current setup guide: <https://reactnative.dev/docs/set-up-your-environment> (choose **React Native CLI Quickstart → Android**).

### First-time project setup (two generated files)

Two **binary** files are intentionally not committed and must be generated once on your machine:

1. **Gradle wrapper jar** — from the `android/` folder run:
   ```powershell
   cd android
   gradle wrapper --gradle-version 8.6
   cd ..
   ```
   (If you don't have a system `gradle`, open the project in Android Studio once — it generates the wrapper automatically. See section 5.)
2. **Debug keystore** — used to sign debug/sideload builds:
   ```powershell
   keytool -genkeypair -v -storetype PKCS12 -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
   ```

Then install JS dependencies:

```powershell
npm install
```

## 5. Open the project in Android Studio

1. Launch Android Studio → **Open** → select the **`android`** folder of this project (not the repo root).
2. Let Gradle sync finish (it downloads the Gradle distribution and dependencies, and generates the wrapper if missing).
3. If prompted, install any missing SDK/NDK components.

## 6. Run it on an Android phone (USB debugging)

1. On the phone: **Settings → About phone → tap Build number 7×** to unlock Developer options.
2. **Settings → Developer options → enable USB debugging.**
3. Connect the phone via USB and accept the "Allow USB debugging?" prompt. Confirm it's seen:
   ```powershell
   adb devices
   ```
4. Start Metro and build/install in one step (from the repo root):
   ```powershell
   npm run android
   ```
   or press **Run ▶** in Android Studio with the device selected.

The app installs and launches. Metro serves the JS bundle; keep that terminal open while developing.

## 7. Build a debug APK (for sideloading)

```powershell
cd android
.\gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`. Copy it to the phone and tap to install (allow "install from unknown sources"), or:

```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

## 8. Build a release APK (optional, for personal sideloading)

This project's `release` build type reuses the debug signing config so you can produce an installable release APK without extra setup:

```powershell
cd android
.\gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`.

For a *dedicated* release keystore (recommended if you share the APK):

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/jankovic-release.keystore -alias jankovic -keyalg RSA -keysize 2048 -validity 10000
```

Then point the `release` `signingConfig` in [`android/app/build.gradle`](./android/app/build.gradle) at that keystore (store its passwords outside version control). **You do not need Google Play for personal installation** — see section 16.

## 9. How to replace the placeholders

There are exactly **two** placeholders, used in both the app and the landing page.

**App** — edit [`src/constants/profile.ts`](./src/constants/profile.ts):

```ts
export const PUBLIC_CARD_URL = 'https://your-real-landing-page-url';
export const BOOKING_LINK = 'https://calendar.app.google/your-real-booking-link';
```

**Landing page** — edit [`landing-page/script.js`](./landing-page/script.js):

```js
var PUBLIC_CARD_URL = 'https://your-real-landing-page-url';
var BOOKING_LINK = 'https://calendar.app.google/your-real-booking-link';
```

`PUBLIC_CARD_URL` is the deployed URL of the `/landing-page` site (section 12). The QR code and NFC tag both point to it.

## 10. How to create a Google Calendar Appointment Schedule booking link

1. Open **Google Calendar** on the web (a personal Gmail account works).
2. Click **Create → Appointment schedule** (the "real-time" booking feature).
3. Set your availability rules, meeting length, buffer times, and how far ahead people can book.
4. Save, then click **Share → Open booking page** and copy the public booking page URL (looks like `https://calendar.app.google/...`).
5. Paste it into both files in section 9 as `BOOKING_LINK`.

## 11. How real-time Google Calendar synchronization works

The **Book a Meeting** button simply opens your Google Calendar **Appointment Schedule booking page** in the browser. That page is hosted by Google and reads your live calendar:

- Times you're already busy are hidden automatically.
- When someone books, the event is created on your calendar instantly and both parties get the invite.
- No backend, no OAuth in this app, and **no fake/hardcoded time slots** — availability is always whatever your real calendar says right now.

## 12. Deploy the `/landing-page` folder

It's a plain static site (`index.html`, `styles.css`, `script.js`) — host it free anywhere:

- **GitHub Pages**: push the repo, then **Settings → Pages**, source = your branch, folder = `/landing-page` (or move the files to `/docs`). Your URL: `https://<user>.github.io/<repo>/`.
- **Netlify**: drag-and-drop the `landing-page` folder at <https://app.netlify.com/drop>, or connect the repo and set **Publish directory = `landing-page`**.
- **Vercel**: import the repo, set the **Root Directory = `landing-page`**, framework preset = *Other*.

After deploying, copy the final URL into `PUBLIC_CARD_URL` (section 9), then regenerate the QR / rewrite NFC tags so they point to it.

## 13. Using the QR code at events

- Open **Share My Card** in the app — it renders the QR for `PUBLIC_CARD_URL` on screen.
- Let people scan it with their phone camera; it opens your public landing page.
- Tip: turn screen brightness up, and use **Copy Link** to paste the URL into chats when scanning isn't convenient. The QR is always a reliable backup to NFC.

## 14. Writing the public URL to an NFC card/tag/sticker

1. Buy blank **NTAG213/215/216** NFC tags/cards/stickers (cheap, widely available).
2. In the app open **NFC Setup**. Make sure NFC is enabled on the phone (the screen tells you the state).
3. Tap **Write URL to NFC Tag**, then hold a tag to the back of the phone until you see **Zápis úspešný ✓**.
4. Test it: lock-screen-tap the tag with any NFC phone — it should open your landing page.
   - This writes a single **NDEF URI record** containing `PUBLIC_CARD_URL`. It is **write-only to physical tags** — no phone-to-phone, no Host Card Emulation.

## 15. Safety note

This is a **personal** networking card. Do **not** add or display: client data, bank-internal information, financial advice, account numbers, contracts, or any sensitive information. The app and landing page must not look like an official bank service and carry this disclaimer everywhere:

> *Toto je osobná digitálna vizitka. Nejde o oficiálnu stránku banky ani o individuálne finančné poradenstvo.*

No bank branding, no logos, no SLSP or other bank identity, no collection of visitor data.

## 16. Personal installation — no Play Store needed

For installing on **your own** Android phone you do **not** need Google Play publishing or any paid service:

- Run via USB with `npm run android` (section 6), **or**
- Build a debug/release APK (sections 7–8) and sideload it with `adb install` or by copying the APK to the phone.

Everything here runs with free, local React Native CLI tooling.

---

## Project structure

```
.
├── App.tsx                     # Navigation + theme
├── index.js                    # RN entry
├── app.json
├── package.json
├── tsconfig.json / babel.config.js / metro.config.js
├── src/
│   ├── components/             # ActionButton, Card, Hero, SectionTitle, Disclaimer
│   ├── constants/              # profile.ts (PLACEHOLDERS here), theme.ts
│   ├── screens/                # Home, ShareCard, NfcSetup, FollowUpHelper
│   ├── types/                  # navigation types
│   └── utils/                  # actions.ts, followUp.ts
├── android/                    # Native Android project (Kotlin, Gradle)
│   └── app/src/main/java/com/jankovicconnect/
│       ├── MainActivity.kt
│       ├── MainApplication.kt
│       ├── ContactModule.kt    # Native ACTION_INSERT contact module
│       └── ContactPackage.kt
└── landing-page/               # Static public site (index.html, styles.css, script.js)
```

## Tech stack

React Native CLI · TypeScript · React Navigation (native stack) · react-native-nfc-manager · react-native-qrcode-svg · react-native-svg · @react-native-clipboard/clipboard · custom Kotlin native module for the Android contact-insert intent.

---

## Troubleshooting

<a id="troubleshooting"></a>

**`node` is not recognized**
Node.js isn't installed or not on PATH. Install the LTS from <https://nodejs.org> (or `winget install OpenJS.NodeJS.LTS`), then open a **new** terminal so PATH refreshes. Verify: `node --version`.

**`java` is not recognized / wrong Java version**
Install JDK 17 (`winget install Microsoft.OpenJDK.17`). Android Gradle Plugin 8.x requires **JDK 17**. Set it:
```powershell
setx JAVA_HOME "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
```
Open a new terminal and verify: `java -version` (should say 17.x).

**`adb` is not recognized**
`adb` lives in the SDK platform-tools. Add it to PATH and reopen the terminal:
```powershell
setx ANDROID_HOME "C:\Android\Sdk"
$p=[Environment]::GetEnvironmentVariable("Path","User"); [Environment]::SetEnvironmentVariable("Path","$p;C:\Android\Sdk\platform-tools","User")
```
Verify: `adb version`.

**`ANDROID_HOME` missing / `SDK location not found`**
Gradle can't find the SDK. Either set `ANDROID_HOME` (above) **or** ensure `android/local.properties` contains:
```
sdk.dir=C:/Android/Sdk
```
(Use forward slashes or escaped backslashes. This file is machine-specific and not committed.)

**Gradle daemon / "Unable to establish loopback connection"**
This was the **sandbox-only** issue documented in [`BUILD_STATUS.md`](./BUILD_STATUS.md); it does not occur in a normal Windows session. If you ever hit a stuck daemon, run `cd android; .\gradlew.bat --stop`, then rebuild. A clean rebuild: `.\gradlew.bat clean assembleDebug`.

**NFC library build issue**
`react-native-nfc-manager` autolinks; no manual native steps are needed on RN 0.74. If a build cache is stale: `cd android; .\gradlew.bat clean`, delete `android\app\build`, then rebuild. NFC only works on a **physical** phone (emulators have no NFC hardware) and requires NFC enabled in Android settings.

**Android phone not detected (`adb devices` shows nothing / "unauthorized")**
- Use a data-capable USB cable (not charge-only).
- On the phone, accept the **"Allow USB debugging?"** prompt (tick "always allow").
- `unauthorized` → revoke and re-accept: phone **Developer options → Revoke USB debugging authorizations**, replug.
- Try `adb kill-server; adb start-server; adb devices`.
- Some phones need the USB mode set to **File Transfer (MTP)** rather than "Charge only".

**USB debugging not enabled**
On the phone: **Settings → About phone → tap "Build number" 7 times** to unlock Developer options, then **Settings → System → Developer options → enable "USB debugging"**.

**Metro bundler port already in use / stale cache**
`npx react-native start --reset-cache` in one terminal, then `npx react-native run-android` in another.
