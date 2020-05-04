# Playground Remote
**ATTENTION: This is a playground project. It might never reach a stable state and will break regularly. Use on your own risk**

## Features
 - Remote control Hyperion
 - ~Available as Desktop App (Mac/Windows/Linux)~
 - ~As hosted version~
 - Screen/Camera capture
 - dark/light mode
 - Desktop Apps: Hyperion Server detection

## Dev/ToDo notes
- General: ~setup CI/CD for Electron Linux/Mac/Windows~
- General: Tune Packages meta and code signing
- General: deploy PWA
- General: ~Create SPA EMBED version & package~
- General: Rework undoredo https://quasar.dev/vue-directives/mutation
- General: ~Add copyToClipboard component (browser,electron)~
- General: ~Add openUrl Mixin (browser,electron))~
- General: ~Add EMBED version to Hyperion webui during builds~
- General: ~Remove connect/login page. Should be notify/connect/login on demand. Preserve current feature set~
- General: https://github.com/slackhq/csp-html-webpack-plugin ?
- General: ~app reload (electron?) (settings debug option?)~
- WebSocket: ~Add Async Await syntax electron,browser,worker~
- i18n: ~modernize loading & reusability~
- i18n: ~compatible with POEditor~
- PWA: ~offline caching,~ update dialog (TESTING REQUIRED)
- Quasar: ~V1.3 use/test dark mode plugin Add option ui in settings, logic in common/darkMode(Options)~
- Menu: Move to overlay mode?
- Router: preserve scroll position does not work
- Right side gesture: Show led visualization & other based on option
- Control
   - Tabs: touch slide gesture
   - Fix adjsutment, better visualization of color pickers?
   - Color: ~Add favourite colors palette~
   - Color: ~Add support for color pattern(!)~
   - Color: Add single Image support
   - Effect: support for favourite effects
   - Priorities: Add table component
-  Config
    - Create entire config section (admin)
-  Settings: Add disonnect timeout option
-  Settings: ~Recreate it more material like (toggle without wrapping). Move help text to an overlay help instead~
-  Settings: ~Add option to switch between dark/light mode based on current time~
-  Settings: ~Add option to switch between dark/light mode based on long/lat (gps)~
-  Theme: ios, win
-  Electron
  - ~v7 sendSync replacement~
  - 7.1 contextIsolation bridge
  - ~Builder - Add Update System~ The generic provider has no second url for latest*.yml pointing. so latest and binaries needs to point to the same directory. Workaround may be a redirect.php that transforms the urls to github releases and latest release infos directory (electron-update branch?). All ci machines need to push the latest*yml files to this specific branch. Requires server access
   - Check app icon on windows (something strange with the png -> .ico conversion). Probably test another icon-genie algo
   - ~Use native dialogs? (Create wrapper)~ Just confirm Dialog
   - Apply "debug" switch on app start? config reading
- Capacitor
   - ~Visibility Tests,~
   - ~splashscreen~
   - back button behaviour
   - Statusbar Color (android)
   - ~initTasks Origin adjustment~
   - SSDP (mixin)
   - app reload(?) for debug mode? (mixin)
   - GPS (mixin) (real device data test)
   - ~openConfirmDialog (mixin)~
   - ~copyToClipboard (mixin)~
   - ~openUrl (mixin)~
   - ScreenCapture
   - openFileDialog (json,image)
   - camera capture
   Hyperion Server
   - WebRTC as sender and receiver of image streams/led streams. Requires a server for handshake. The current implementation is resource heavy [Discuss](https://stackoverflow.com/questions/17552333/is-it-possible-to-use-webrtc-to-streaming-video-from-server-to-client)
   - Add UI settings object for admin and non admin, provide app option to disable sync/receive of them
   - Add Color pattern effect?

## Development instructions
 - [Development](./docs/DEV.md)

## Commits
We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for changelog creation.

### titles (PRs/commits)
Please follow this style for PRs and commits
 - chore: Does not match any other category
 - fix: This is a bugfix somewhere
 - feat: This is a new feature somewhere
 - docs: This is a change in the documentation
 - style: This is a visual change in ui
 - refactor: This is a internal refatoring of the code (not in changelog)
 - build: This is a change for the build system ci/cd (not in changelog)
 - test: This is a change of a code test (not in changelog)
 - commits without a prefix will be skipped too (not in changelog)
 - **Use with a scope**: chore(deps): Update dependency XY

### Message body
You can add a message body
```
fix: This bug is fixed

The bug was weird, now it's fixed;
Resolves all kind of issues.

Fixes #14
```

### Breaking change
**A breaking change should be just used, if the public API is not backwards compatible with this change**.
A breaking change is announced at the title with a `!` added to the type or scope
```
feat!: This is a breaking change
feat(core)!: This is a breaking change with scope
```
Optional: You can also add a message body with more text
```
BREAKING CHANGE: Place here your information of the break
```

## Tools
 -  [release-it](https://github.com/release-it/release-it)

### Created with
  - [Quasar Framework](https://quasar.dev)
  - Lot's of :clock8: and :hearts:
