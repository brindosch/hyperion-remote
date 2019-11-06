import { WsEvents } from './wsEvents'

let wsEvents = new WsEvents()

// Async messages from electron main thread
window.ipc.on('open', (event, arg) => {
  wsEvents.dispatchEvent(new Event('open'))
})
window.ipc.on('close', (event, arg) => {
  wsEvents.dispatchEvent(new Event('close'))
})
window.ipc.on('message', (event, arg) => {
  let ev = new Event('message')
  ev.data = arg.data
  wsEvents.dispatchEvent(ev)
})
window.ipc.on('storecommit', (event, arg) => {
  let ev = new Event('storecommit')
  ev.data = arg
  wsEvents.dispatchEvent(ev)
})
window.ipc.on('router', (event, arg) => {
  let ev = new Event('router')
  ev.data = arg
  wsEvents.dispatchEvent(ev)
})
window.ipc.on('notify', (event, arg) => {
  let ev = new Event('notify')
  ev.data = arg
  wsEvents.dispatchEvent(ev)
})

/*
 * Connect to Hyperion with address
 * @param newUrl The address that is used
 */
function connect (newUrl) {
  window.ipc.send('connect', newUrl)
}
/*
 * Disconnect
 * @param newUrl The address that is used
 */
function disconnect () {
  window.ipc.send('disconnect')
}
/*
 * Send to Hyperion, will skip the send if currently not connected
 * A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
 * @param data     JSON   The data to send
 */
function send (data) {
  window.ipc.send('send', data)
}
/*
 * Listen to websocket events, included are special events (see window.ipc)
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
