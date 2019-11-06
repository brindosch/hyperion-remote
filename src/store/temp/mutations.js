export const setConnectedState = (state, newState) => {
  state.connected = newState
  // if connected, we are no longer in connecting state
  if (newState) { state.connecting = false }
}

export const setConnectingState = (state, newState) => {
  state.connecting = newState
  // if we are connecting, we aren't connected
  if (newState) { state.connected = false }
}

export const setInitialConnected = (state, newState) => {
  state.initialConnected = newState
}

export const setLastPage = (state, newState) => {
  state.lastPage = newState
}

export const resetLastPage = (state, newState) => {
  state.lastPage = null
}

export const setActiveInstance = (state, newState) => {
  state.activeInstance = newState
}

export const setLastLedColors = (state, newState) => {
  state.lastLedColors = newState
}

export const setPreventAutoDisconnect = (state, newState) => {
  state.preventAutoDisconnect = newState
}
