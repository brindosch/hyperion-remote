import * as socket from 'components/socket/socket'
import * as workerWs from 'components/socket/wsWorkerBridge'
import * as windowWs from 'components/socket/wsWindowBridge'

// import Socket from 'components/socket/index'
export default ({ Vue, store, router }) => {
  // Use WebSocket threaded - ws.worker.js if supported | as fallback window websocket
  if (window.Worker) {
    console.log('Use Worker WebSocket')
    socket.init(store, router, workerWs)
  } else if (window.WebSocket) {
    console.log('Use Window WebSocket')
    socket.init(store, router, windowWs)
  } else {
    console.error('No WebSocket supported! FATAL!')
  }

  Vue.prototype.$socket = socket
}
