export const getConnectedState = (state) => {
  return state.connected
}

export const getConnectingState = (state) => {
  return state.connecting
}

export const getSupportedLocales = (state) => {
  return state.supportedLocales
}

export const getAvailThemeColors = (state) => {
  return state.availThemeColors
}

export const getAvailPages = (state) => {
  return state.availPages
}

export const getLastPage = (state, getters, rootState, rootGetters) => {
  if (state.lastPage == null) { return rootGetters['common/getStartPage'] } else { return state.lastPage }
}

export const getLogFilterOptions = (state) => {
  return state.logFilterOptions
}

export const getActiveInstance = (state) => {
  return state.activeInstance
}

export const getLastLedColors = (state) => {
  return state.lastLedColors
}

export const getPreventAutoDisconnect = (state) => {
  return state.preventAutoDisconnect
}
