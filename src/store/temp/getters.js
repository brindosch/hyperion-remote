import enums from './enums'

export const isConnected = (state) => {
  return state.connectState == enums.conState.CONNECTED
}

export const getConnectingState = (state) => {
  return state.connectState == enums.conState.CONNECTING
}

export const getConnectState = (state) => {
  return state.connectState
}

export const getAvailThemeColors = (state) => {
  return state.availThemeColors
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

export const isEmbed = (state) => {
  return process.env.EMBED
}

export const getBtnMoreEntries = (state) => {
  return state.btnMoreEntries
}
