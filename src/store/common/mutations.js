
export const setDarkTheme = (state, newState) => {
  state.uiSettings.darkTheme = newState
}

export const setThemeColor = (state, newState) => {
  state.uiSettings.themeColor = newState
}

export const setBackToTop = (state, newState) => {
  state.uiSettings.backToTop = newState
}

export const setInternalLocale = (state, newState) => {
  // internal commit only, use dispatch setLocale instead
  state.uiSettings.locale = newState
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
