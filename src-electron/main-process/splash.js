import { BrowserWindow } from 'electron'
const path = require('path')

let splash

export function createSplash (top) {
  // create a `splash` screen window
  splash = new BrowserWindow({
    width: 491,
    height: 260,
    frame: false,
    parent: top,
    modal: true,
    show: false,
    webPreferences: {
      devTools: false,
      contextIsolation: true
    }
  })

  splash.once('ready-to-show', () => {
    splash.show()
  })

  // splash.loadURL(process.env.DEV ? path.resolve(__dirname, '..', '..', 'src', 'statics', 'electron-splash.html') : path.resolve(__dirname, 'statics', 'electron-splash.html'))
  splash.loadURL(process.env.DEV ? path.resolve(__dirname, 'statics/electron-splash.html') : path.resolve(__dirname, 'electron-splash.html'))
  return splash
}

export function destroySplash () {
  splash.destroy()
}
