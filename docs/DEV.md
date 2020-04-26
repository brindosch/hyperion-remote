## Setup Development System
How to prepare your System for development

### Linux
This is the fastest and simplest solution for Ubuntu/Debian to install a recent version of node and npm and avoiding sudo command. npm and node is installed in home directory, no global messing. nvm allows you also to switch node versions quickly if required
 - Use [NVM](https://github.com/nvm-sh/nvm) to install Node and Npm `wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
 - logout/login with user account (may be required)
 - Install node/npm latest LTS through nvm  `nvm install --lts`
 - Install Yarn as global: `npm install -g yarn`
 - Install Quasar cli as global `yarn global add @quasar/cli`
 - Go to project folder `cd hyperion-remote`
 - Install project dependencies `yarn yarn:install`
 - Setup an Editor, recommended with included workspace (settings) file: [Visual Studio Code](###VisualStudioCode)
 - Start development: [Development](##Development)

### Windows
On Windows we use also NVM to install a local node/npm version in home directory and simple version switching
 - Install [NVM Windows](https://github.com/coreybutler/nvm-windows)
 - open cmd and type `nvm list available`. Remember version string of latest LTS version
 - install node with: `nvm install 12.16.1` while writing this it was 12.16.1
 - Use the version: `nvm use 12.16.1`
 - Install Yarn as global: `npm install -g yarn`
 - Install Quasar cli as global `yarn global add @quasar/cli`
 - Go to project folder (might be a different path!) `cd hyperion-remote`
 - Install project dependencies `yarn yarn:install`
 - Setup an Editor, recommended with included workspace (settings) file: [Visual Studio Code](###VisualStudioCode)
 - Start development: [Development](##Development)

### Capacitor Android
We assume you have completed [Windows](###windows) or [Linux](###linux) instructions.

Create a development setup to work with Capacitor for Android. Tested with Windows 7 64bit (04/2020)
- Install [Android Studio](https://developer.android.com/studio) for your System (In this case version 3.6) with default path
- **Don't update Gradle when Android Studio asks for**
- Install [JDK 8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)
- Open Android Studio `Tools->Sdk Manager`.
  - `Sdk Platforms` minimum Android 5.0.
  - `Sdk Tools` tick `Android SDK Build Tools` and `Android SDK Platform Tools`
  - You can use your own device for testing or the emulator. Emulator: Install also the Android Emulator and Accelerator to test with a virtual device.
- Start development: `yarn dev:ca-android`

**Issues**
- Quasar can't find Android Studio
   - Windows: Changed paths needs to be edited in `quasar.conf.js > bin > windowsAndroidStudio`)
- JDK not found
  - Install JDK 8
  - Be sure `JAVA_HOME` points to the install path

## Development
Time for development. Navigate to project folder `cd hyperion-remote` if not already. If you use Visual Studio Code you can start all kind of tasks from `NPM SCRIPTS` list.
 - SPA development: Start with `yarn dev:spa`
 - Electron development: Start with `yarn dev:electron`
 - Capacitor Android development: `yarn dev:ca-android`
 - Cordova android development: Navigate to cordova project folder `cd hyprion-remote` and start with `quasar dev -m cordova -T android`. It might be better to start a AVD before, there seems also some bugs to refresh

## Building
To build deployable artifacts use
- For SPA: `yarn build:spa`
- For Electron: `yarn build:electron`
- For Capacitor Android `yarn build:ca-android`
- For Cordova Android: `quasar build -m cordova -T android`

### Visual Studio Code
Install Visual Studio Code and navigate to `File -> Open Workspace` and select `hyperion-remote.code-workspace` from the project folder. This workspace contains editor/extension settings and recommended extensions to install.
- The Vetur extension requires vue-language-server, install it `yarn global add vue-language-server`
- the editor will auto-format the code on save and ES-Lint rules will be applied.
- Tuned regarding Vue.js/Quasar formatting.
- Auto completion and inline help
- dependencies up-to-date checks for `package.json` and more

Start development: [Development](##Development)


### Development Helper
Tools which helps a lot
- Browser Vue extension: [Vue Dev Tools](https://github.com/vuejs/vue-devtools)
- Cordova Android: Open in Chrome the console and go to "more tools" -> "Remote devices" to get access to the app console output and a live screen mirroring
- [Quasar Icon generator](https://quasar.dev/icongenie/installation): `yarn global add @quasar/icongenie`

### Tips and Tricks
 - Show lint errors with `yarn run lint` (Ensure you are in project folder!)
 - Auto fix (fixable!) lint errors by typing `yarn run lintfix` (Ensure you are in project folder!)

### Android Cordova
Android development is done with Cordova. Requires a lot of disk space eg 10-30GB due to Android Studio and SDKS/AVD.
- Install Cordova while in project folder: `yarn install -g cordova`
- Note: Used version Cordova Android 7.0.0

#### Android Cordova Linux
Might be incomplete as i aborted due to AVD support in VMs!
 - Install Android Studio
 - Cordova might have issues to find Gradle, Add to ~.bashrc also this path `PATH=$PATH:/$HOME/android-studio/gradle/gradle-4.1/bin` (be aware of the version number and studio path!)
 - install JDK 8 if  missing for Cordova?! `sudo add-apt-repository ppa:openjdk-r/ppa && sudo apt-get update && sudo apt-get install openjdk-8-jdk`
 - AVD Can't run in virtual OSes!!!
 - Note: A AVD can't access local network addresses besides of the host system ports itself!

#### Android Cordova Windows
There are a bunch of details and flaws in between.
 - Install Android Studio
 - Setup PATH varible (`set ANDROID_HOME=C:\<installation location>\android-sdk` `set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools`) (Not Android Studio folder! Use sdk folder)
  - Just JDK 1.8 supported (no 1.9) while writing this
 - You need to Start Android Studio once and initiate a new project, as it needs to download further build tools and AVD.
 - Create a new AVD device with SDK Android 5 if you want to use the emulator.
 - Check if setup was correct: `cordova requirements android` (inside src-cordova folder)
 - Note: Crasswalk issue with Android Studio 3.0 CPU missmatch when testing against real device. [Solution] (https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview/issues/203#issuecomment-369201185)
 - Note: With crosswalk 23 (WebView 52) added; there is a error that 2 files aren't found and the build fails [Link](https://stackoverflow.com/questions/49162538/cordova-build-android-unable-to-find-attribute-androidfontvariationsettings-a). Add this at `platforms/android/build.gradle` inside allprojects{} obj
```
   configurations.all {
       resolutionStrategy {
           force 'com.android.support:support-v4:27.1.0'
       }
   }
```

#### (Cordova Android) Shipped Android WebViews per version based on Chrome version
Since 5.0 it's possible to update the WebView through Play Store but the update is often disabled by smartphone sellers. Also not Play Store licenced device will lack updates. So it's pretty relativ that the latest WebView is installed. Currently used is crosswalk as baked in webview with 52
 - 4.4 -> 30 (Introduced WebSocket support)
 - 5.0 -> 37 (Introduced WebGL, WebRTC and other support)
 - 6.0 -> 44
 - 7.0 -> 51
 - 8.0 -> 58
 - 8.1 -> 61

#### Native Web APIs support
- Android WebView 61 ([Web Api Page Visibility works for app foreground/background detection!](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)) Crosswalk (52) don't, TODO check lower native webview versions for support

#### Cordova Plugins overview
Used plugins
- Crosswalk 23 (WebView 52) for Android
- [cordova-plugin-whitelist](https://cordova.apache.org/docs/en/latest/guide/appdev/whitelist/index.html) Manages accesible urls from/to App for Android and iOS
- [cordova-plugin-splashscreen](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html) for Android, Windows 10 and iOS
- [cordova-plugin-discovery](https://www.npmjs.com/package/cordova-plugin-discovery) (SSDP one shot search) for Android and iOS
- [cordova-plugin-statusbar](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-statusbar/) (Statusbar Color! for iOS and Android)
