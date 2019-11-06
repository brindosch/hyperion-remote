export const getCurrentLocale = (state) => {
  return state.uiSettings.locale
}

export const isDarkTheme = (state) => {
  return state.uiSettings.darkTheme
}

export const getThemeColor = (state) => {
  return state.uiSettings.themeColor
}

export const isBacktoTop = (state) => {
  return state.uiSettings.backToTop
}

export const getStartPage = (state, getters, rootState, rootGetters) => {
  // check if the page of the user option still exists
  if (rootGetters['temp/getAvailPages'].filter(entry => entry.path === state.uiSettings.startPage).length > 0) { return state.uiSettings.startPage } else state.uiSettings.startPage = '/'
  return '/'
}

export const getOriginName = (state) => {
  return state.originName
}

export const getPriority = (state) => {
  return state.priority
}

export const getSelectedRemoteTab = (state) => {
  return state.selectedRemoteTab
}

export const getEffBlacklist = (state) => {
  return state.effBlacklist
}

export const getColor = (state) => {
  return state.lastColor
}

export const getStreamQuality = (state) => {
  return state.lastStreamQuality
}

export const getAdminAppMode = (state) => {
  return state.uiSettings.adminAppMode
}
