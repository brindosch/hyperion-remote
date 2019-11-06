/*
 * Preload script
 *
 * in preload scripts, we have access to node.js and electron APIs
 * the remote web app will not have access, so this is safe
 */
const { desktopCapturer, ipcRenderer } = require('electron')
const { BrowserWindow } = require('electron').remote
let currWindow = null

// ipcRenderer
const ipc = {
  sendSync (msg, arg) {
    return ipcRenderer.sendSync(msg, arg)
  },
  send (msg, arg) {
    ipcRenderer.send(msg, arg)
  },
  on (channel, cb) {
    ipcRenderer.on(channel, cb)
  },
  off (channel, cb) {
    ipcRenderer.off(channel, cb)
  }
}

// desktopCapturer
const dCapturer = {
  getSources (constrain) {
    return desktopCapturer.getSources(constrain)
  }
}

// remote module
const bwindow = {
  getFocusedWindow () {
    currWindow = BrowserWindow.getFocusedWindow()
  },
  focusLastWindow () {
    currWindow.focus()
  }
}

// add to window element
window.bwindow = bwindow
window.ipc = ipc
window.dCapturer = dCapturer
