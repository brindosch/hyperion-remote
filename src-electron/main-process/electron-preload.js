/*
 * Preload script
 *
 * in preload scripts, we have access to node.js and electron APIs
 * the remote web app will not have access, so this is safe
 * contextIsolation bridge: https://electronjs.org/docs/api/context-bridge
 */
const { desktopCapturer, ipcRenderer, clipboard, shell } = require('electron')
const { dialog, BrowserWindow } = require('electron').remote
const log = require('electron-log')
const fs = require('fs').promises
const path = require('path')
let LAST_PATH

let currWindow = null

// override logger of render thread
Object.assign(console, log.functions)

window.electron = {
  getFocusedWindow () {
    currWindow = BrowserWindow.getFocusedWindow()
  },
  focusLastWindow () {
    currWindow.focus()
  },
  getSources (constrain) {
    return desktopCapturer.getSources(constrain)
  },
  restartApp () {
    ipcRenderer.send('restart')
  },
  openUrl (url) {
    shell.openExternal(url)
  },
  copyToClipboard (string) {
    clipboard.writeText(string)
  },
  async openConfirmDialog ({ title, msg, cancelLabel, okLabel }) {
    // https://electronjs.org/docs/api/dialog#dialogshowmessageboxbrowserwindow-options
    return dialog.showMessageBox(BrowserWindow.getFocusedWindow(), { title, message: msg, type: 'question', buttons: [cancelLabel, okLabel] })
  },
  async openFileDialog ({ files, filter, multiple }) {
    // https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options
    const props = ['openFile']
    // filter based on type
    let type
    if (filter.includes('png')) { type = 'image' } else if (filter.includes('json')) { type = 'json' } else if (filter.includes('zip')) { type = 'zip' }

    switch (type) {
      case 'image':
        filter = [{ name: 'Images', extensions: filter }]
        break
      case 'json':
        filter = [{ name: 'JSON', extensions: filter }]
        break
      case 'zip':
        filter = [{ name: 'Zip', extensions: filter }]
        break
      default:
        break
    }
    // handle multi selection
    if (multiple) { props.push('multiSelections') }
    // show dialog
    const result = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      filters: filter,
      properties: props,
      defaultPath: LAST_PATH || process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
    })

    if (result.canceled) { return [] }

    // transform images to base64 string
    for (const file of result.filePaths) {
      let preview, data
      const buffer = await fs.readFile(file)
      const size = buffer.byteLength
      const extensionName = path.extname(file)
      const name = path.basename(file)
      LAST_PATH = file
      if (type === 'image') {
        // convert image file to base64-encoded string
        const base64Image = buffer.toString('base64')

        // combine all strings
        data = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`
        preview = data
      } else if (type === 'json') {
        data = buffer.toString('utf8')
        data = JSON.parse(data)
      } else {
        throw new TypeError(`Electron: File type ${type} not implemented`)
      }
      // detect same file
      if (!files.find((el) => el.name === name && el.size === size)) {
        if (multiple) { files.push({ data, preview, name, size }) } else { files.splice(0, 1, { data, preview, name, size }) }
      }
    }
  },
  minimize () {
    BrowserWindow.getFocusedWindow().minimize()
  },
  maximize () {
    BrowserWindow.getFocusedWindow().maximize()
  },
  unmaximize () {
    BrowserWindow.getFocusedWindow().unmaximize()
  },
  isMaximized () {
    return BrowserWindow.getFocusedWindow().isMaximized()
  },
  close () {
    BrowserWindow.getFocusedWindow().close()
  },
  ipc: {
    invoke (channel, ...args) {
      return ipcRenderer.invoke(channel, ...args)
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
}
