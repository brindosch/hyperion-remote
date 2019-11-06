// a Websocket handler as base class
// config: object: {wsEvent:HANDLER, forceSSL=false}
// wsEvent: a handler that can be passed for ws events (Implementation needs to be done in subclass!)
// forceSSL: If set to true, use always WSS

export class Websocket {
  constructor (obj) {
    this.closeRequested = false
    this.ws = null
    this.url = null
    this.ssl = false
    this.forceSSL = obj.forceSSL
    this.timeout = 3000
    this.maxRecAttempts = 3
    this.currentRecAttempts = 0
    this.lastConnectionTryTime = null
    this.wsEvents = obj.wsEvent
  }
  // A methods to disconnect requested by user
  disconnect () {
    if (this.ws != null) {
      if (this._isConnected()) { this.closeRequested = true }
      this.ws.close(1000)
      this.ws = null
      // go to connect page, disable autoConnect
      this.storeCommit('temp/setConnectedState', false)
      this.router({ name: 'connect', params: { autoConnect: false } })
    }
  }

  // Send to Hyperion, will skip the send if currently not connected
  // A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
  // @param data     JSON   The data to send
  send (data) {
    if (this.ws !== null && this._isConnected()) {
      this.ws.send(JSON.stringify(data) + '\n')
    }
  }
  connect (newUrl) {
    if (this.ws !== null) {
      if (this._isConnected()) { this.closeRequested = true }
      this.ws.close(1000)
      this.ws = null
    }

    // reconnect means undefined newUrl
    if (newUrl !== undefined) {
      // reset ssl, if the WebScoket fails with exception or without (CERT_ERR) there is no reset
      this.ssl = false
      this.url = newUrl
      this._resetRecAttempts()
      this.storeCommit('temp/setInitialConnected', false)

      // url parsing for https detection
      try {
        let turl = new URL(newUrl)
        this.ssl = (turl.protocol === 'https:')
        this.url = turl.hostname + (turl.port ? ':' + turl.port : '')
      } catch (e) {
        // failed to parse
      }

      // we might want to force ssl
      if (this.forceSSL) { this.ssl = true }
    }

    if (process.env.DEV) { console.log('Connecting to socket:', this.url) }

    try {
      this.ws = this.ssl ? new WebSocket('wss://' + this.url) : new WebSocket('ws://' + this.url)
    } catch (e) {
      // notify broken url
      this.notify('error', 'conn.invalidMsgAddress', 'wifi')
      this.ws = null
      return
    }
    // increment trys
    this.currentRecAttempts += 1

    // Listen for events
    this.ws.onopen = this._onopen
    this.ws.onclose = this._onclose
    this.ws.onerror = this._onerror
    this.ws.onmessage = this._onmessage
    setTimeout(this._abortConnectionTry, this.timeout)

    // we are connecting now
    this.storeCommit('temp/setConnectingState', true)
    this.lastConnectionTryTime = new Date().getTime()
  }
  // internal onopen handler
  _onopen = e => {
    // we are connected
    this.storeCommit('temp/setConnectedState', true)
    this._resetRecAttempts()

    // flag initial connection
    this.storeCommit('temp/setInitialConnected', true)
    // update primary address + prepend https://, if the connection was SSL
    let turl = this.ssl ? 'https://' + this.url : this.url
    this.storeCommit('connection/addSetAddress', turl)
    // dispatch the event
    this.onopen(e)
  }
  // internal onclose handler
  _onclose = e => {
    // catch requested closes
    if (this.closeRequested) {
      this.closeRequested = false
      console.log('Force disconnected')
      return
    }
    // we probably reconnect
    if (this.maxRecAttempts > this.currentRecAttempts) {
      // it may be required to delay the attempts
      const now = new Date().getTime()
      const delay = ((now - this.lastConnectionTryTime) < 1000) ? 2000 : 0
      setTimeout(this.connect.bind(this), delay)
      return
    }

    this._notifyErrorAndRelease()
    // dispatch the event
    this.onclose(e)
    // navigate back to connect page
    this.router('/connect')
  }
  // internal onerror handler
  _onerror = e => {
    this.onerror(e)
  }
  // internal onmessage handler
  _onmessage = e => {
    this.onmessage(e)
  }
  _isConnected () {
    return this.ws.readyState === WebSocket.OPEN
  }
  _resetRecAttempts () {
    this.currentRecAttempts = 0
  }
  _abortConnectionTry = e => {
    // A timeout kills long pending connection trys, emits onclose
    // Note: The custom close() codes aren't supported that great
    if (this.ws != null && this.ws.readyState === WebSocket.CONNECTING) { this.ws.close() }
  }
  _notifyErrorAndRelease () {
    this.storeCommit('temp/setConnectingState', false)
    this.notify('error', 'conn.failedMsg', 'wifi')
  }
  onopen (e) {
    // reimplement in child class
    console.error('onopen not implemented!')
  }
  onclose (e) {
    // reimplement in child class
    console.error('onclose not implemented!')
  }
  onerror (e) {
    // reimplement optional in child class
  }
  onmessage (e) {
    // reimplement in child class
    console.error('onmessage not implemented!')
  }
  storeCommit (path, val) {
    // reimplement in child class
    console.error('storeCommit not implemented!')
  }
  router (path, val) {
    // reimplement in child class
    console.error('router not implemented!')
  }
  notify (type, msg, icon) {
    // reimplement in child class
    console.error('notify not implemented!')
  }
}

export default Websocket
