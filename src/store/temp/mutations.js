import enums from './enums'

export const setConnectedState = (state, newState) => {
  state.connectState = newState ? enums.conState.CONNECTED : enums.conState.DISCONNECTED
}

export const setConnectingState = (state, newState) => {
  state.connectState = newState ? enums.conState.CONNECTING : enums.conState.DISCONNECTED
}

export const setInitialConnected = (state, newState) => {
  state.initialConnected = newState
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

export const openLoginDialog = (state, newState) => {
  state.openLoginDialog = newState
}

export const openConnectDialog = (state, newState) => {
  state.openConnectDialog = newState
}

export const openTokenHandler = (state, newState) => {
  state.openTokenHandler = newState
}

export const setBtnMoreEntries = (state, newState) => {
  state.btnMoreEntries = newState
}

export const ledStreamRequest = (state, newState) => {
  if (newState.state && !state.ledStreamRequest.includes(newState.uuid))
    state.ledStreamRequest.push(newState.uuid)
  else if (!newState.state && state.ledStreamRequest.includes(newState.uuid))
    state.ledStreamRequest.splice(state.ledStreamRequest.indexOf(newState.uuid), 1)
}

export const imageStreamRequest = (state, newState) => {
  if (newState.state && !state.imageStreamRequest.includes(newState.uuid))
    state.imageStreamRequest.push(newState.uuid)
  else if (!newState.state && state.imageStreamRequest.includes(newState.uuid))
    state.imageStreamRequest.splice(state.imageStreamRequest.indexOf(newState.uuid), 1)
}

