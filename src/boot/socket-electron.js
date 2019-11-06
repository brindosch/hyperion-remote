import * as socket from 'components/socket/socket'
import * as electronWs from 'components/socket/wsElectronBridge'

// import Socket from 'components/socket/index'
export default ({ Vue, store, router }) => {
  // Use node.js WebSocket implementation for electron (see file node-ws)
  console.log('Use Electron WebSocket')
  socket.init(store, router, electronWs)

  Vue.prototype.$socket = socket
}
