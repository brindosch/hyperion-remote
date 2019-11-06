const WebSocket = require('ws')
const EventEmitter = require('events')

// import { Loading, QSpinnerGears } from 'quasar'

// A websocket eventListener bridge between nativ websocket and app listeners
// As a websocket object is always new constructed (reconnect) we can't bind directly EventListeners
class WsEmitter extends EventEmitter { }

let closeRequested = false
let ws = null
let url = null
let ssl = false
let timeout = 3000
let maxRecAttempts = 3
let currentRecAttempts = 0
let lastConnectionTryTime = null
const wsEmitter = new WsEmitter()

// A methods to disconnect requested by user
function disconnect () {
  if (ws != null) {
    if (isConnected()) { closeRequested = true }
    ws.close(1000)
    ws = null
    // go to connect page, disable autoConnect
    storeCommit('temp/setConnectedState', false)
    router({ name: 'connect', params: { autoConnect: false } })
  }
}

//
// Send to Hyperion, will skip the send if currently not connected
// A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
// @param data     JSON   The data to send
//
function send (data) {
  if (ws !== null && isConnected()) {
    ws.send(JSON.stringify(data) + '\n')
  }
}

function connect (newUrl) {
  if (ws !== null) {
    if (isConnected()) { closeRequested = true }
    ws.close(1000)
    ws = null
  }

  // reconnect means undefined newUrl
  if (newUrl !== undefined) {
    // reset ssl, if the WebScoket fails with exception or without (CERT_ERR) there is no reset
    ssl = false
    url = newUrl
    _resetRecAttempts()
    storeCommit('temp/setInitialConnected', false)

    // url parsing for https detection
    try {
      let turl = new URL(newUrl)
      ssl = (turl.protocol === 'https:')
      url = turl.hostname + (turl.port ? ':' + turl.port : '')
    } catch (e) {
      // failed to parse
    }

    // if we are on https, we need to use https
    // if (document.location.protocol == 'https:') { ssl = true }
  }

  if (process.env.DEV) { console.log('Connecting to socket:', url) }

  try {
    ws = ssl ? new WebSocket('wss://' + url) : new WebSocket('ws://' + url)
  } catch (e) {
    console.error('Websocket', e)
    // notify broken url
    notify('error', 'conn.invalidMsgAddress', 'wifi')
    ws = null
    return
  }
  // increment trys
  currentRecAttempts += 1

  // Listen for events
  ws.onopen = _onopen
  ws.onclose = _onclose
  ws.onerror = _onerror
  ws.onmessage = _onmessage
  setTimeout(_abortConnectionTry, timeout, ws)

  // we are connecting now
  storeCommit('temp/setConnectingState', true)
  lastConnectionTryTime = new Date().getTime()
}

function isConnected () {
  return ws.readyState === WebSocket.OPEN
}

// listen to websocket event (just final events e.g. no reconnect close)
// one of 'open', 'close', 'message'
function addEventListener (type, callback) {
  wsEmitter.addListener(type, callback)
}
// unlisten to websocket event
function removeEventListener (type, callback) {
  wsEmitter.removeListener(type, callback)
}

function _onopen (event) {
  _notifySuccessAndRelease()

  // flag initial connection
  storeCommit('temp/setInitialConnected', true)
  // update primary address + prepend https://, if the connection was SSL
  let turl = ssl ? 'https://' + url : url
  storeCommit('connection/addSetAddress', turl)
  // show loading animation, as we get now server data first!
  // dispatch the event
  wsEmitter.emit('open', event)
}
function _onclose (event) {
  // catch requested closes
  if (closeRequested) {
    closeRequested = false
    console.log('Force disconnected')
    return
  }
  // we probably reconnect
  if (maxRecAttempts > currentRecAttempts) {
    // it may be required to delay the attempts
    let now = new Date().getTime()
    let delay = ((now - lastConnectionTryTime) < 1000) ? 2000 : 0
    setTimeout(connect, delay)
    return
  }
  _notifyErrorAndRelease()
  // _logCloseCode(event)

  // dispatch the event
  wsEmitter.emit('close', event)
  // navigate back to connect page
  router('/connect')
}
function _onerror (event) {
  // emits all day long with close
}
function _onmessage (event) {
  // dispatch the event
  wsEmitter.emit('message', event)
}

function storeCommit (path, val) {
  wsEmitter.emit('storecommit', { path: path, value: val })
}

function router (path, val) {
  wsEmitter.emit('router', { path: path, value: val })
}
function notify (type, msg, icon) {
  wsEmitter.emit('notify', { type: type, msg: msg, icon: icon })
}

function _abortConnectionTry (ws) {
  // A timeout kills long pending connection trys, emits onclose
  // Note: The custom close() codes aren't supported that great
  if (ws != null && ws.readyState === WebSocket.CONNECTING) { ws.close() }
}

function _notifyErrorAndRelease () {
  storeCommit('temp/setConnectingState', false)
  notify('error', 'conn.failedMsg', 'wifi')
}

function _notifySuccessAndRelease () {
  storeCommit('temp/setConnectedState', true)
  _resetRecAttempts()
}

function _resetRecAttempts () {
  currentRecAttempts = 0
}

export { connect, disconnect, send, addEventListener, removeEventListener }

/*
ISSUE: The new WebSocket statement does not work inside class. How can this be added?

// eslint-disable-next-line no-unused-vars
const WebSocket = require('ws')
import { Websocket } from '../../src/components/socket/ws.js'
const EventEmitter = require('events')

// A websocket eventListener bridge between nativ websocket and app listeners
// As a websocket object is always new constructed (reconnect) we can't bind directly EventListeners
class WsEmitter extends EventEmitter { }
const wsEmitter = new WsEmitter()

// create a child class with our custom handlers
export class NodeWebSocket extends Websocket {
  onopen (e) {
    this.wsEvents.emit('open', event)
  }
  onclose (e) {
    this.wsEvents.emit('close', e)
  }
  onerror (e) {
    // reimplement optional in child class
  }
  onmessage (e) {
    this.wsEvents.emit('message', e)
  }
  storeCommit (path, val) {
    this.wsEvents.emit('storecommit', { path: path, value: val })
  }
  router (path, val) {
    this.wsEvents.emit('router', { path: path, value: val })
  }
  notify (type, msg, icon) {
    this.wsEvents.emit('notify', { type: type, msg: msg, icon: icon })
  }
  addEventListener (type, callback) {
    this.wsEvents.addListener(type, callback)
  }
  removeEventListener (type, callback) {
    this.wsEvents.removeListener(type, callback)
  }
}

export function wsInit () {
  // setup WindowWebSocket
  const wsconfig = { wsEvent: wsEmitter, forceSSL: false }
  return new NodeWebSocket(wsconfig)
}

*/
