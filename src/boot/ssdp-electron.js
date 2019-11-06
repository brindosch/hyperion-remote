class SsdpWrapper {
  constructor (ipcRender) {
    this.ipc = ipcRender
  }
  getResults () {
    // render thread blocker
    return this.ipc.sendSync('ssdpget')
  }
  search () {
    return this.ipc.send('ssdpstart')
  }
}

export default ({ Vue, store, router }) => {
  Vue.prototype.$ssdpClient = new SsdpWrapper(window.ipc)
}
