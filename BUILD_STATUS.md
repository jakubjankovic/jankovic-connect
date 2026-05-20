# BUILD STATUS — Jankovič Connect

_Last updated: 2026-05-20 · React Native CLI + TypeScript + native Android (architecture unchanged)._

Honest handoff for a **local Windows build**. The app could not be compiled inside the Claude automation sandbox due to a JVM/Gradle networking limitation (explained below) — not a project-code error. Everything that does not require running Gradle has been verified here.

---

## ✅ Verified in this environment

**Toolchain (installed + on PATH / persisted via setx):**
- Node.js `v24.15.0` — `C:\Program Files\nodejs`
- JDK `17.0.19 LTS` — `C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot` (`JAVA_HOME` set)
- Android SDK — `C:\Android\Sdk` (`ANDROID_HOME` / `ANDROID_SDK_ROOT` set): `platform-tools`, `platforms;android-34`, `build-tools;34.0.0`
- `adb` `1.0.41`

**Project (static verification):**
- `npm install` — 878 packages, no errors.
- `npm run typecheck` (`tsc --noEmit`) — **PASS (exit 0)**.
- Package versions aligned: `react-native@0.74.5`, `@react-native/gradle-plugin@0.74.87`, `react@18.2.0`, `react-native-nfc-manager@3.17.2`, `react-native-qrcode-svg@6.3.21`, `react-native-svg@15.15.5`, `@react-native-clipboard/clipboard@1.16.3`, `react-native-screens@3.37.0`, `react-native-safe-area-context@4.14.1`.
- Gradle wrapper complete: `gradlew`, `gradlew.bat` (official Gradle 8.6.0 scripts), `gradle-wrapper.properties` (8.6-all), `gradle-wrapper.jar` (43,462 bytes).
- Autolinking = official RN 0.74 form: `com.facebook.react.settings` plugin in `android/settings.gradle` + `autolinkLibrariesWithApp()` in `android/app/build.gradle`. `@react-native-community/cli-platform-android` present.
- Native module registered: `ContactPackage()` added in `MainApplication.kt`; `ContactModule.kt` uses `ACTION_INSERT` (no contact-write permission).
- `AndroidManifest.xml`: `android.permission.NFC` + `uses-feature android.hardware.nfc required="false"`; only other permission is `INTERNET`. No `CALL_PHONE` / `WRITE_CONTACTS` / `READ_CONTACTS`.
- Component name consistent everywhere: `app.json` name `JankovicConnect` = `MainActivity.getMainComponentName()` = `settings.gradle` rootProject.name.
- Debug signing uses AGP's auto-generated default debug keystore — no manual keystore needed.
- `android/local.properties` → `sdk.dir=C:/Android/Sdk`.
- NDK is **not required** for this app (no C++ / new architecture is off; Hermes & all libs ship as prebuilt AARs).

## ⚠️ Not verified here

- **`gradlew.bat assembleDebug` (the actual APK build).** Gradle 8.6 downloads, then fails at JVM startup with `java.io.IOException: Unable to establish loopback connection` (root: `sun.nio.ch.UnixDomainSockets.connect0` → AF_UNIX selector self-pipe blocked by the sandbox). A 2-line `Selector.open()` Java program fails identically here, while a plain 127.0.0.1 TCP socket works. This is an **OS/network limitation of the automation environment**, reproduced and ruled out as a project issue (it happens before Gradle reads `build.gradle`). It does **not** occur in a normal interactive Windows session / Android Studio.

## ▶️ Exact commands for local build (normal PowerShell)

```powershell
cd "C:\Users\Jakub Jankovič\Documents\Claude VibeCode Session"
npm install
npm run typecheck
cd android
.\gradlew.bat assembleDebug
```

If a stale Gradle daemon ever misbehaves: `.\gradlew.bat --stop` then `.\gradlew.bat clean assembleDebug`.

## 📦 APK path (debug)

```
android\app\build\outputs\apk\debug\app-debug.apk
```

(Release variant, optional, reuses debug signing: `.\gradlew.bat assembleRelease` → `android\app\build\outputs\apk\release\app-release.apk`.)

## 📲 Install on your phone

Enable Developer options → USB debugging, connect via USB, accept the prompt, then:

```powershell
adb devices
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

Live development (Metro + auto build/install): `npx react-native run-android`

## 🔑 Remaining placeholders to replace

| Placeholder | Files |
| --- | --- |
| `PUBLIC_CARD_URL_PLACEHOLDER` | `src/constants/profile.ts`, `landing-page/script.js` |
| `GOOGLE_CALENDAR_BOOKING_LINK_PLACEHOLDER` | `src/constants/profile.ts`, `landing-page/script.js` |

## 🆘 If your local build fails — what to send me

Run the build capturing full output and paste the result:

```powershell
cd "C:\Users\Jakub Jankovič\Documents\Claude VibeCode Session\android"
.\gradlew.bat assembleDebug --stacktrace --info > build-log.txt 2>&1
```

Then share **`android\build-log.txt`** (or at least the lines from the first `FAILURE:` / `* What went wrong:` to the end). Most useful specifics:
- The exact `* What went wrong:` block and the `Caused by:` lines.
- Any `> Task :app:... FAILED` line (tells which task: manifest merge, Kotlin compile, autolink, resource linking, etc.).
- First run only: confirm it had internet (Gradle downloads dependencies on first build).
- If it mentions NDK/CMake: paste that line — I'll adjust, though this app should not require NDK.
