import { Dark } from 'quasar'

export const setDark = (state, newState) => {
  // DANGER: just used from time eval
  state.uiSettings.darkTheme = newState
  Dark.set(newState)
}

export const setDarkMode = (state, newState) => {
  // based on our mode we need to tell Quasar what we should do
  switch (newState) {
    case 'platform':
      Dark.set('auto')
      state.uiSettings.darkTheme = Dark.isActive
      break
    case 'enabled':
      Dark.set(true)
      state.uiSettings.darkTheme = true
      break
    case 'disabled':
      Dark.set(false)
      state.uiSettings.darkTheme = false
      break
    case 'time':
      Dark.set(false)
      state.uiSettings.darkTheme = false
      break
    default:
      break
  }
  state.syncSettings.darkMode = newState
}

export const setDarkTimespan = (state, newState) => {
  state.syncSettings.darkTimespan = newState
}

export const setDarkStartTime = (state, newState) => {
  state.syncSettings.darkTimespan.splice(0, 1, newState)
}

export const setDarkEndTime = (state, newState) => {
  state.syncSettings.darkTimespan.splice(1, 1, newState)
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

export const setStartPage = (state, newState) => {
  state.uiSettings.startPage = newState
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

export const setStreamQuality = (state, newState) => {
  state.lastStreamQuality = newState
}

export const setAdminAppMode = (state, newState) => {
  state.uiSettings.adminAppMode = newState
}

export const setDebugState = (state, newState) => {
  state.debug = newState
}
