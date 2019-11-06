import Websocket from './ws'
import { WsEvents } from './wsEvents'

let wsEvents = new WsEvents()

// create a child class with our custom handlers
class WindowWebSocket extends Websocket {
  onopen (e) {
    this.wsEvents.dispatchEvent(e)
  }
  onclose (e) {
    this.wsEvents.dispatchEvent(e)
  }
  onerror (e) {
    // reimplement optional in child class
  }
  onmessage (e) {
    this.wsEvents.dispatchEvent(e)
  }
  storeCommit (path, val) {
    let ev = new Event('storecommit')
    ev.data = { path: path, value: val }
    this.wsEvents.dispatchEvent(ev)
  }
  router (path, val) {
    let ev = new Event('router')
    ev.data = { path: path, value: val }
    this.wsEvents.dispatchEvent(ev)
  }
  notify (type, msg, icon) {
    let ev = new Event('notify')
    ev.data = { type: type, msg: msg, icon: icon }
    this.wsEvents.dispatchEvent(ev)
  }
}

// setup WindowWebSocket
const wsconfig = { wsEvent: wsEvents, forceSSL: document.location.protocol === 'https:' }
let ws = new WindowWebSocket(wsconfig)

/*
 * Connect to Hyperion with address
 * @param newUrl The address that is used
 */
function connect (newUrl) {
  ws.connect(newUrl)
}
/*
 * Disconnect
 * @param newUrl The address that is used
 */
function disconnect () {
  ws.disconnect()
}
/*
 * Send to Hyperion, will skip the send if currently not connected
 * A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
 * @param data     JSON   The data to send
 */
function send (data) {
  ws.send(data)
}
/*
 * Listen to websocket events, included are special events (see wsWorker)
 * @param type      The event name
 * @param callback  The method to callback
 */
function addEventListener (type, callback) {
  wsEvents.addEventListener(type, callback)
}
/*
 * Unlisten to websocket events, that has been added with addEventListener()
 * @param type      The event name
 * @param callback  The method to callback
 */
function removeEventListener (type, callback) {
  wsEvents.removeEventListener(type, callback)
}

export { connect, disconnect, send, addEventListener, removeEventListener }
