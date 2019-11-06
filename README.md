# Playground Remote
**ATTENTION: This is a playground project. It might never reach a stable state and will break regularly. Use on your own risk**

## Features
 - Remote control Hyperion
 - ~Available as Desktop App (Mac/Windows/Linux)~
 - ~As hosted version~
 - Screencapture
 - Color theming, day/night mode
 - Desktop App: Hyperion Server detection, ~auto updates~

## Dev/ToDo notes
 - General: https://www.npmjs.com/package/conventional-github-releaser
 - General: setup CI/CD for Electron Linux/Mac/Windows
 - Electron: v7 sendSync replacement
 - Electron: Packager - Add Update System
 - Electron: Check app icon on windows (low res?!)
 - Electron: Use native dialogs? (Create wrapper)
 - Quasar: V1.3 use/test dark mode plugin
 - Menu: Move to overlay mode?
 - Router: Cache pages on visit
 - Router: preserve scroll position does not work
 - Left sidebar: Add touch gesture for open close
 - Right side gesture: Show panel/led visualization & other based on option
 - Control
 -  - Tabs: touch slide gesture
 -  - Fix adjsutment, better visualization of color pickers?
 -  - Add Priority selection
 -  - Color: Add favourite colors palette
 -  - Color: Add support for color pattern(!)
 -  - Color: Add single Image support
 -  Config
 -  - Create entire config section (admin)
 -  Settings: Recreate it more material like (toggle without wrapping). Move help text to an overlay help instead
 -  Settings: Add option to switch between dark/light mode based on current time
 -  Server: Add UI settings object, provide app option to disable sync/receive of them
 -  Theme: ios 

## Development instructions
 - [Development](./.github/DEV.md)

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
You can add a message body like to
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
 -  Changelog creator: [standard-version](https://github.com/conventional-changelog/standard-version)

### Created with
  - [Quasar Framework](https://quasar.dev)
  - Lot's of :clock8: and :hearts:
