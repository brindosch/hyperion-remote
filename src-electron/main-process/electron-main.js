import { app, BrowserWindow, ipcMain } from 'electron'
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const path = require('path')
import { createSplash, destroySplash } from './splash'
import * as ssdp from './node-ssdp'
import * as ws from './node-ws'

// https://electronjs.org/docs/api/chrome-command-line-switches
app.commandLine.appendSwitch('disable-renderer-backgrounding')

// prepare logger
log.catchErrors()

// prepare autoUpdater
log.transports.file.level = 'debug'
autoUpdater.logger = log
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.allowDowngrade = true
// channel getter/setter one of 'latest' 'beta' 'alpha'
autoUpdater.channel = 'latest'

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
  log.info('Hyperion Remote starting...')
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
  // Async await through ipc
  ipcMain.handle('sendAsync', async (event, ...args) => {
    const result = await ws.sendAsync(...args)
    return result
  })

  // Async messages from ws to render thread
  ws.addEventListener('open', () => mainWindow.webContents.send('open'))
  ws.addEventListener('close', () => mainWindow.webContents.send('close'))
  ws.addEventListener('message', (val) => mainWindow.webContents.send('message', val))
  ws.addEventListener('storecommit', (val) => mainWindow.webContents.send('storecommit', val))
  ws.addEventListener('notify', (val) => mainWindow.webContents.send('notify', val))
}

function createSSDPHandler () {
  // Async await through ipc
  ipcMain.handle('ssdpget', async (event, ...args) => {
    const result = await ssdp.getResults()
    return result
  })
}

function sendStatusToWindow (msg) {
  log.info(msg)
  // mainWindow.webContents.send('message', msg);
}

function createWindow () {
  // Create mainWindow
  mainWindow = new BrowserWindow({
    minWidth: 500,
    width: 1035,
    minHeight: 600,
    height: 900,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: QUASAR_NODE_INTEGRATION,
      preload: path.resolve(__dirname, 'electron-preload.js'),
      // preload: process.env.DEV ? path.resolve(__dirname, '..', '..', 'src', 'statics', 'electron-preload.js') : path.resolve(__dirname, 'statics', 'electron-preload.js'),
      // preload: path.resolve(__dirname, 'electron-preload.js')
      devTools: process.env.DEV,
      contextIsolation: false
    },
    frame: false,
    show: false
  })

  // create a `splash` screen window
  createSplash(mainWindow)
  ipcMain.on('hidesplash', (event, arg) => { destroySplash(); mainWindow.show() })

  // update check
  // if (process.env.PROD) {
  autoUpdater.on('error', (error) => {
    sendStatusToWindow('Error' + error)
  })
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
  })
  autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow('Update available.')
  })
  autoUpdater.on('update-not-available', (ev, info) => {
    sendStatusToWindow('Update not available.')
  })
  autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow('Error in auto-updater.')
  })
  autoUpdater.on('download-progress', (ev, progressObj) => {
    sendStatusToWindow('Download progress...')
  })
  autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow('Update downloaded; will install in 5 seconds')
  })
  // autoUpdater.checkForUpdatesAndNotify()
  // }

  // load window
  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
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

// restart handler
ipcMain.on('restart', (event, arg) => { app.relaunch(); app.quit() })
