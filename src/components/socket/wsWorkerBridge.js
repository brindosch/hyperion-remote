import Worker from './ws.worker'
import { WsEvents } from './wsEvents'

let wsWorker = new Worker()
let wsEvents = new WsEvents()

// messages from worker thread
wsWorker.addEventListener('message', function (e) {
  let ev = null
  switch (e.data.cmd) {
    case 'open':
      wsEvents.dispatchEvent(new Event('open'))
      break
    case 'close':
      wsEvents.dispatchEvent(new Event('close'))
      break
    case 'message':
      ev = new Event('message')
      ev.data = e.data.value
      wsEvents.dispatchEvent(ev)
      break
    case 'storecommit':
      ev = new Event('storecommit')
      ev.data = e.data.value
      wsEvents.dispatchEvent(ev)
      break
    case 'notify':
      ev = new Event('notify')
      ev.data = e.data.value
      wsEvents.dispatchEvent(ev)
      break

    default:
      break
  }
}, false)

// update SSL state
wsWorker.postMessage({ cmd: 'ssl', value: (document.location.protocol === 'https:') })

/*
 * Connect to Hyperion with address
 * @param newUrl The address that is used
 */
function connect (newUrl) {
  wsWorker.postMessage({ cmd: 'connect', value: newUrl })
}
/*
 * Disconnect
 * @param newUrl The address that is used
 */
function disconnect () {
  wsWorker.postMessage({ cmd: 'disconnect' })
}
/*
 * Send to Hyperion, will skip the send if currently not connected
 * A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
 * @param data     JSON   The data to send
 */
function send (data) {
  wsWorker.postMessage({ cmd: 'send', value: data })
}
/*
 * Send to Hyperion, will skip the send if currently not connected
 * A newline is appended to split the commands (e.g. send more than one cmd at a time in one websocket package)
 * @param data     JSON   The data to send
 */
async function sendAsync (data) {
  return new Promise((resolve, reject) => {
    let cmd = data.command
    let subc = data.subcommand
    if (subc)
      cmd = `${cmd}-${subc}`

    let func = (e) => {
      const rdata = JSON.parse(e.data)
      if (rdata.command == cmd) {
        removeEventListener('message', func)
        resolve(rdata)
      }
    }
    // after 5 sec we resolve false
    setTimeout(() => { resolve(false); removeEventListener('message', func) }, 5000)
    addEventListener('message', func)

    wsWorker.postMessage({ cmd: 'send', value: data })
  })
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

export { connect, disconnect, send, sendAsync, addEventListener, removeEventListener }
