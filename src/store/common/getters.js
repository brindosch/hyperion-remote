
export const getLang = (state) => {
  return state.syncSettings.lang
}

export const getDarkMode = (state) => {
  return state.syncSettings.dark.mode
}

export const getDarkModeOptions = (state) => {
  return ['platform', 'time', 'gps', 'enabled', 'disabled']
}

export const getDarkTimespan = (state) => {
  return [state.syncSettings.dark.startTime, state.syncSettings.dark.endTime]
}

export const getDarkStartTime = (state) => {
  return state.syncSettings.dark.startTime
}

export const getDarkEndTime = (state) => {
  return state.syncSettings.dark.endTime
}

export const getDarkLat = (state) => {
  return state.syncSettings.dark.lat
}

export const getDarkLong = (state) => {
  return state.syncSettings.dark.long
}

export const getThemeColor = (state) => {
  return state.uiSettings.themeColor
}

export const isBacktoTop = (state) => {
  return state.uiSettings.backToTop
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

export const getAdminAppMode = (state) => {
  return state.uiSettings.adminAppMode
}

export const getFavColors = (state) => {
  return state.syncSettings.favColors
}

export const getDebugState = (state) => {
  return state.debug
}
