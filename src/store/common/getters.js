
export const getLang = (state) => {
  return state.syncSettings.lang
}

export const isDarkTheme = (state) => {
  return state.uiSettings.darkTheme
}

export const getDarkMode = (state) => {
  return state.syncSettings.darkMode
}

export const getDarkModeOptions = (state) => {
  return ['platform', 'time', 'enabled', 'disabled']
}

export const getDarkTimespan = (state) => {
  return state.syncSettings.darkTimespan
}

export const getDarkStartTime = (state) => {
  return state.syncSettings.darkTimespan[0]
}

export const getDarkEndTime = (state) => {
  return state.syncSettings.darkTimespan[1]
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

export const getFavColors = (state) => {
  return state.syncSettings.favColors
}

export const getDebugState = (state) => {
  return state.debug
}
