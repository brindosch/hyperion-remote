import { Dark } from 'quasar'

export const setDark = (state, newState) => {
  // DANGER: just used from time eval
  Dark.set(newState)
}

export const setDarkMode = (state, newState) => {
  // based on our mode we need to tell Quasar what we should do
  switch (newState) {
    case 'platform':
      Dark.set('auto')
      break
    case 'enabled':
      Dark.set(true)
      break
    case 'disabled':
      Dark.set(false)
      break
    case 'time':
      Dark.set(false)
      break
    default:
      break
  }
  state.syncSettings.dark.mode = newState
}

export const setDarkTimespan = (state, newState) => {
  state.syncSettings.dark.startTime = newState[0]
  state.syncSettings.dark.endTime = newState[1]
}

export const setDarkStartTime = (state, newState) => {
  state.syncSettings.dark.startTime = newState
}

export const setDarkEndTime = (state, newState) => {
  state.syncSettings.dark.endTime = newState
}

export const setDarkLat = (state, newState) => {
  state.syncSettings.dark.lat = newState
}

export const setDarkLong = (state, newState) => {
  state.syncSettings.dark.long = newState
}

export const setThemeColor = (state, newState) => {
  state.uiSettings.themeColor = newState
}

export const setBackToTop = (state, newState) => {
  state.uiSettings.backToTop = newState
}

export const setLang = (state, newState) => {
  // DO NOT CALL!  Called from mixins/lang.js
  state.syncSettings.lang = newState
  if (document) { document.documentElement.lang = newState }
}

export const setOriginName = (state, newState) => {
  state.originName = newState
}

export const setPriority = (state, newState) => {
  state.priority = newState
}

export const setSelectedRemoteTab = (state, newState) => {
  state.selectedRemoteTab = newState
}

export const setEffBlacklist = (state, newState) => {
  state.effBlacklist = newState
}

export const setColor = (state, newState) => {
  state.lastColor = newState
}

export const setAdminAppMode = (state, newState) => {
  state.uiSettings.adminAppMode = newState
}

export const setDebugState = (state, newState) => {
  state.debug = newState
}
