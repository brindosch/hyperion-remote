import { app, BrowserWindow, ipcMain } from 'electron'
const path = require('path')
import * as ssdp from './node-ssdp'
import * as ws from './node-ws'

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = path.join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

// prevent garbage collection of mainWindow
let mainWindow

// init ssdp/websocket for main and proceed with app start
function init () {
  createSSDPHandler()
  createWebsocketHandler()
  createWindow()
}

function createWebsocketHandler () {
  // Async messages from render thread
  ipcMain.on('connect', (event, url) => {
    ws.connect(url)
  })
  ipcMain.on('disconnect', (event, arg) => {
    ws.disconnect()
  })
  ipcMain.on('send', (event, arg) => {
    ws.send(arg)
  })

  // Async messages from ws to render thread
  ws.addEventListener('open', () => mainWindow.webContents.send('open'))
  ws.addEventListener('close', () => mainWindow.webContents.send('close'))
  ws.addEventListener('message', (val) => mainWindow.webContents.send('message', val))
  ws.addEventListener('storecommit', (val) => mainWindow.webContents.send('storecommit', val))
  ws.addEventListener('router', (val) => mainWindow.webContents.send('router', val))
  ws.addEventListener('notify', (val) => mainWindow.webContents.send('notify', val))
}

function createSSDPHandler () {
  // Async messages from render thread
  ipcMain.on('ssdpstart', (event, arg) => {
    ssdp.start()
  })
  // Event handler for synchronous incoming messages
  ipcMain.on('ssdpget', (event, arg) => {
    event.returnValue = ssdp.getResults()
  })
}

function createWindow () {
  // create a `splash` screen window
  let splash = new BrowserWindow({
    width: 491,
    height: 260,
    frame: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      devTools: false
    }
  })

  splash.once('ready-to-show', () => {
    splash.show()
  })

  splash.loadURL(path.join(process.env.APP_URL, 'statics/electron-splash.html'))

  // update check
  if (process.env.PROD) {
    // checkForUpdates()
  }

  // Create mainWindow
  mainWindow = new BrowserWindow({
    minWidth: 400,
    width: 1000,
    minHeight: 400,
    height: 600,
    useContentSize: true,
    webPreferences: {
      devTools: process.env.DEV,
      nodeIntegration: true,
      preload: path.join(__statics, 'electron-preload.js')
    },
    backgroundColor: '#1e2f48',
    frame: false,
    show: false
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.once('ready-to-show', () => {
    splash.destroy()
    mainWindow.show()
  })
}
app.on('ready', init)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    init()
  }
})
