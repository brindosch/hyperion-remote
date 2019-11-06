import Vue from 'vue'

export const setSysInfo = (state, newState) => {
  state.sysInfo = newState
}

export const setServerInfo = (state, newState) => {
  state.serverInfo = newState
}

export const setServerSchema = (state, newState) => {
  state.serverSchema = newState
}

export const setServerConfig = (state, newState) => {
  state.serverConfig = newState
}

export const setComponentsUpdate = (state, obj) => {
  state.serverInfo.components.forEach((entry, index) => {
    if (entry.name === obj.name) {
      entry.enabled = obj.enabled
    }
  })
}

export const updateLog = (state, arr) => {
  arr.forEach((entry) => {
    state.logEntries.push(entry)
  })
}

export const updatePlugins = (state, obj) => {
  let key = Object.keys(obj)[0]
  if (obj[key].name) { Vue.set(state.serverInfo.plugins, key, obj[key]) } else if ('running' in obj[key]) { state.serverInfo.plugins[key].running = obj[key].running } else if ('removed' in obj[key]) { Vue.delete(state.serverInfo.plugins, key) }
}

export const updateInstances = (state, newState) => {
  state.serverInfo.instance = newState
}

export const updateEffects = (state, arr) => {
  state.serverInfo.effects = arr
}

export const updateAdjustment = (state, arr) => {
  state.serverInfo.adjustment = arr
}

export const setActiveLogFilters = (state, val) => {
  state.activeLogFilters = val
}

export const resetLogEntries = (state) => {
  state.logEntries = []
}

export const updateLeds = (state, val) => {
  state.serverInfo.leds = val
}

export const setBrightness = (state, val) => {
  state.serverInfo.adjustment[0].brightness = val
}

export const setAdminAuthRequired = (state, val) => {
  state.adminAuthRequired = val
}

export const setTokenAuthRequired = (state, val) => {
  state.tokenAuthRequired = val
}

export const setLoginState = (state, val) => {
  state.loggedin = val
}
