import { Websocket } from './ws'

// create a child class with our custom handlers
class WorkerWebSocket extends Websocket {
  postMessageToMain (cmd, value) {
    postMessage({ cmd: cmd, value: value })
  }
  onopen (e) {
    this.postMessageToMain('open')
  }
  onclose (e) {
    this.postMessageToMain('close')
  }
  onerror (e) {
    // reimplement optional in child class
  }
  onmessage (e) {
    this.postMessageToMain('message', e.data)
  }
  storeCommit (path, val) {
    this.postMessageToMain('storecommit', { path: path, value: val })
  }
  router (path, val) {
    this.postMessageToMain('router', { path: path, value: val })
  }
  notify (type, msg, icon) {
    this.postMessageToMain('notify', { type: type, msg: msg, icon: icon })
  }
  setForceSSL (v) {
    this.forceSSL = v
  }
}

// setup WorkerWebSocket
const wsconfig = { wsEvent: null, forceSSL: false }
let ws = new WorkerWebSocket(wsconfig)

// message from render thread
onmessage = function (e) {
  switch (e.data.cmd) {
    case 'send':
      ws.send(e.data.value)
      break
    case 'connect':
      ws.connect(e.data.value)
      break
    case 'disconnect':
      ws.disconnect()
      break
    case 'ssl':
      ws.setForceSSL(e.data.value)
      break

    default:
      console.error('message cmd not implemented', e.data)
      break
  }
}
