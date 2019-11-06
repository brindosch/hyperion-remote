export const addSetAddress = (state, newAddress) => {
  // check if already added
  const index = state.storedConnections.findIndex(entry => entry.address === newAddress)
  if (index > 0) {
    // move to index 0
    let value = state.storedConnections.splice(index, 1)[0]
    state.storedConnections.unshift(value[0])
  } // or prepend
  else if (index < 0) {
    state.storedConnections.unshift({ address: newAddress, password: '', token: '' })
  }

  // we keep just 3 entries (+ entry 0)
  if (state.storedConnections.length > 4) { state.storedConnections.pop() }
}

export const setLastPassword = (state, newState) => {
  state.storedConnections[0].password = newState
}

export const setLastToken = (state, newSate) => {
  state.storedConnections[0].token = newSate
}

export const resetLastPassword = (state, newState) => {
  state.storedConnections[0].password = ''
}

export const setLastCrypt = (state, { encrypted, type }) => {
  // convert ArrayBuffer to Array
  if (type === 'password') {
    state.storedConnections[0] = Object.assign({}, state.storedConnections[0], {
      password: {
        cipherText: Array.from(new Uint8Array(encrypted.cipherText)),
        iv: Array.from(encrypted.iv)
      }
    })
  } else {
    state.storedConnections[0] = Object.assign({}, state.storedConnections[0], {
      token: {
        cipherText: Array.from(new Uint8Array(encrypted.cipherText)),
        iv: Array.from(encrypted.iv)
      }
    })
  }
}

export const resetLastToken = (state, newSate) => {
  state.storedConnections[0].token = ''
}

export const setAutoConnect = (state, newState) => {
  state.autoConnect = newState
}

export const setAutoDisconnect = (state, newState) => {
  state.autoDisconnect = newState
}

export const setAutoLogin = (state, newState) => {
  state.autoLogin = newState
}

export const deleteStoredConnection = (state, newState) => {
  const index = state.storedConnections.indexOf(newState)
  state.storedConnections.splice(index, 1)
}
