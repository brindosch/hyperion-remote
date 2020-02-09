import { WsEvents } from './wsEvents'

let wsEvents = new WsEvents()

// Async messages from electron main thread
window.electron.ipc.on('open', (event, arg) => {
  wsEvents.dispatchEvent(new Event('open'))
})
window.electron.ipc.on('close', (event, arg) => {
  wsEvents.dispatchEvent(new Event('close'))
})
window.electron.ipc.on('message', (event, arg) => {
  let ev = new Event('message')
  ev.data = arg.data
  wsEvents.dispatchEvent(ev)
})
window.electron.ipc.on('storecommit', (event, arg) => {
  let ev = new Event('storecommit')
  ev.data = arg
  wsEvents.dispatchEvent(ev)
})
window.electron.ipc.on('notify', (event, arg) => {
  let ev = new Event('notify')
  ev.data = arg
  wsEvents.dispatchEvent(ev)
})

/*
 * Connect to Hyperion with address
 * @param newUrl The address that is used
 */
function connect (newUrl) {
  window.electron.ipc.send('connect', newUrl)
}
/*
 * Disconnect
 * @param newUrl The address that is used
 */
function disconnect () {
  window.electron.ipc.send('disconnect')
}
/*
 * Send to Hyperion, will skip the send if currently not connected
 * A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
 * @param data     JSON   The data to send
 */
function send (data) {
  window.electron.ipc.send('send', data)
}
/*
 * Send to Hyperion, will skip the send if currently not connected
 * A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
 * @param data     JSON   The data to send
 */
async function sendAsync (data) {
  return window.electron.ipc.invoke('sendAsync', data)
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

export { connect, disconnect, send, sendAsync, addEventListener, removeEventListener }
