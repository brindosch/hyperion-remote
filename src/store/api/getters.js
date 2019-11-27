export const getSysInfo = (state) => {
  return state.sysInfo
}

export const getServerSchema = (state) => {
  return state.serverSchema
}

export const getServerConfig = (state) => {
  return state.serverConfig
}

export const getHyperionVersion = (state) => {
  return state.sysInfo.hyperion.version
}

export const getComponents = (state) => {
  return state.serverInfo.components
}

export const getHyperionEnable = (state) => {
  return state.serverInfo.components.filter(entry => entry.name === 'ALL')[0].enabled
}

export const getLog = (state) => {
  return state.logEntries
}

export const getActiveLogFilters = (state) => {
  return state.activeLogFilters
}

export const getFilteredLog = (state) => {
  // no filter - all entries
  if (state.activeLogFilters == null || state.activeLogFilters.length === 0) { return state.logEntries }
  // filter
  const filtered = state.logEntries.filter((logentry) => {
    let bool = false
    state.activeLogFilters.forEach((entry) => { if (entry.includes(logentry.loggerName)) bool = true })
    return bool
  })
  return filtered
}

export const getEffects = (state) => {
  return state.serverInfo.effects
}

export const getSelectPreparedEffects = (state) => {
  let selectArray = []
  for (let entry of state.serverInfo.effects) {
    selectArray.push({ label: entry.name, value: entry.name })
  }
  return selectArray
}

export const getSelectPreparedEffectsFiltered = (state, getters, rootState, rootGetters) => {
  // filtered against blacklist
  let selectArray = []
  for (let entry of state.serverInfo.effects) {
    if (!rootGetters['common/getEffBlacklist'].includes(entry.name)) { selectArray.push({ label: entry.name, value: entry.name }) }
  }
  return selectArray
}

export const getAdjustments = (state) => {
  return state.serverInfo.adjustment
}

export const getBrightness = (state) => {
  return state.serverInfo.adjustment[0].brightness
}

export const getPlugins = (state) => {
  return state.serverInfo.plugins
}

export const getInstances = (state) => {
  return state.serverInfo.instance
}

export const getActiveInstanceData = (state, getters, rootState, rootGetters) => {
  const currInst = rootGetters['temp/getActiveInstance']
  return state.serverInfo.instance.filter(entry => entry.instance === currInst)[0]
}

export const getLeds = (state) => {
  return state.serverInfo.leds
}

export const getAdminAuthRequired = (state) => {
  return state.adminAuthRequired
}

export const getTokenAuthRequired = (state) => {
  return state.tokenAuthRequired
}

export const getLoginState = (state) => {
  return state.loggedin
}

export const getTokenList = (state) => {
  return state.tokenList
}

export const getPendingTokens = (state) => {
  return state.pendingTokens
}