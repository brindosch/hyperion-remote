
export const getStoredConnections = (state) => {
  return state.storedConnections
}

export const getLastAddress = (state) => {
  // might be empty
  return state.storedConnections.length ? state.storedConnections[0].address : ''
}

export const getLastPassword = (state) => {
  // might be empty
  return state.storedConnections.length ? state.storedConnections[0].password : ''
}

export const getLastCrypt = (state) => (type) => {
  if (state.storedConnections.length) {
    if (type === 'password') { return state.storedConnections[0].password } else { return state.storedConnections[0].token }
  }
  return undefined
}

export const getLastToken = (state) => {
  // might be empty
  return state.storedConnections.length ? state.storedConnections[0].token : ''
}

export const getAutoDisconnect = (state) => {
  return state.autoDisconnect
}
