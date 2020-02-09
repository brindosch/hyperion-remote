import { notify, EventBus } from '../../utils'
import { i18n } from '../../boot/i18n'

let sstore = null
let initialized = false
let ws = null
// This tan will be ignored on response success failure
const TAN_SKIP = 5

export function init (store, wsBridge) {
  // get the wsBridge interface
  ws = wsBridge

  // store access
  sstore = store
  // add event listeners
  ws.addEventListener('open', _onopen)
  ws.addEventListener('close', _onclose)
  ws.addEventListener('message', _onmessage)
  ws.addEventListener('storecommit', _onstorecommit)
  ws.addEventListener('notify', _onnotify)
}

export const connect = (url) => {
  ws.connect(url)
}

export const disconnect = () => {
  ws.disconnect()
  // we can't wait for the socket store commit
  sstore.commit('temp/setConnectedState', false)
  _softReset()
}

// Data request methods
export const getServerInfo = () => {
  send('serverinfo', undefined, { subscribe: ['components-update', 'effects-update', 'adjustment-update', 'instance-update', 'leds-update', 'token-update', 'priorities-update'] }) // "plugins-update"
}
export const getSysInfo = () => {
  send('sysinfo')
}

// get methods
export const setAdminAuthRequired = () => {
  send('authorize', 'adminRequired')
}
export const setTokenAuthRequired = () => {
  send('authorize', 'tokenRequired')
}

// set methods
export const logout = () => {
  send('authorize', 'logout')
  sstore.commit('api/setLoginState', false)
}
export const login = async (password) => {
  return sendAsync('authorize', 'login', { password, tan: TAN_SKIP })
}
export const loginToken = async (token) => {
  return sendAsync('authorize', 'login', { token, tan: TAN_SKIP })
}

export const requestToken = (comment, id) => {
  send('authorize', 'requestToken', { comment, id, tan: TAN_SKIP })
}

export const cancelRequestToken = (comment, id) => {
  send('authorize', 'requestToken', { comment, id, accept: false })
}

export const setCompState = (component, state) => {
  send('componentstate', undefined, { componentstate: { component, state } })
}
export const setColor = (c, duration) => {
  duration = (duration === undefined) ? 0 : duration
  send('color', undefined, { color: c, priority: sstore.getters['common/getPriority'], origin: sstore.getters['common/getOriginName'] })
}

export const setImage = (data, duration, name) => {
  send('image', undefined, { imagedata: data, priority: sstore.getters['common/getPriority'], duration: duration, format: 'auto', origin: sstore.getters['common/getOriginName'], name: name })
}

export const setImageRGBA = (data, duration, name) => {
  send('image', undefined, { imagedata: data.data, priority: sstore.getters['common/getPriority'], duration: duration, format: 'RGBAraw', width: data.width, height: data.height, origin: sstore.getters['common/getOriginName'], name: name })
}

export const setEffect = (effName, duration) => {
  duration = (duration === undefined) ? 0 : duration
  send('effect', undefined, { effect: { name: effName }, duration: duration, priority: sstore.getters['common/getPriority'], origin: sstore.getters['common/getOriginName'] })
}
export const setAdjustment = (id, type, value) => {
  send('adjustment', undefined, { adjustment: { [type]: value, id: id } })
}
export const setPluginState = (id, state) => {
  let subc = state ? 'start' : 'stop'
  send('plugin', subc, { id })
}
export const setClear = (priority) => {
  priority = (priority === undefined) ? sstore.getters['common/getPriority'] : priority
  send('clear', undefined, { priority })
}
export const setPriority = (priority) => {
  send('sourceselect', undefined, { priority })
}
export const setPriorityAutoSelect = (auto) => {
  send('sourceselect', undefined, { auto })
}
export const setLogEnable = (state) => {
  if (sstore.getters['api/getLoginState']) { send('logging', (state ? 'start' : 'stop')) }
}
export const setInstance = (instance) => {
  send('instance', 'switchTo', { instance, tan: TAN_SKIP })
}
export const setInstanceState = (newState, instance) => {
  const subc = newState ? 'startInstance' : 'stopInstance'
  send('instance', subc, { instance })
}
export const setLedStream = (state) => {
  if (sstore.getters['api/getLoginState']) { send('ledcolors', (state ? 'ledstream-start' : 'ledstream-stop')) }
}
export const setImageStream = (state) => {
  if (sstore.getters['api/getLoginState']) { send('ledcolors', (state ? 'imagestream-start' : 'imagestream-stop')) }
}

// ADMIN ONLY METHODS
export const getServerSchema = () => {
  send('config', 'getschema')
}
export const getServerConfig = () => {
  send('config', 'getconfig')
}
export const getTokenList = () => {
  send('authorize', 'getTokenList')
}
export const getPendingTokens = () => {
  send('authorize', 'getPendingTokenRequests')
}
export const handleTokenRequest = (id, accept) => {
  send('authorize', 'answerRequest', { id, accept })
}
export const createToken = (comment) => {
  send('authorize', 'createToken', { comment })
}
export const renameToken = (id, comment) => {
  send('authorize', 'renameToken', { id, comment })
}
export const deleteToken = (id) => {
  send('authorize', 'deleteToken', { id })
}
export const deleteInstance = (instance) => {
  send('instance', 'deleteInstance', { instance })
}
export const renameInstance = (instance, name) => {
  send('instance', 'saveName', { instance, name })
}
export const createInstance = (name) => {
  send('instance', 'createInstance', { name })
}

export const handleInstanceUpdate = (type, data) => {
  if (type === 'update') {
    // we need to check if our current instance is affected by this update
    const inst = sstore.getters['temp/getActiveInstance']
    const upd = data.filter(entry => entry.instance === inst && entry.running)
    if (upd.length !== 1) {
      // our instance is gone or disabled, get new serverinfo
      sstore.commit('temp/setActiveInstance', 0)
      getServerInfo()
    }
    // update store
    sstore.commit('api/updateInstances', data)
  } else {
    let inst = 0
    if (data.success) {
      inst = data.info.instance
      sstore.commit('temp/setActiveInstance', inst)
      getServerInfo()
      return
    }
    // init serverinfo, update store BEFORE we update
    sstore.commit('temp/setActiveInstance', inst)
    if (!initialized) startApiInit(true)
  }
}

export const startApiInit = (authHandled) => {
  // init steps after a onopen or to re-auth-check while switching admin/remote mode
  // get current state of auth, if the auth was already handled we skip that
  let admin = sstore.getters['common/getAdminAppMode']
  if (!authHandled) {
    admin ? setAdminAuthRequired() : setTokenAuthRequired()
    return
  }

  // admin requires more data
  if (admin) {
    getTokenList()
    getPendingTokens()
    getServerSchema()
    getServerConfig()
  }
  getSysInfo()

  // recover instance if not 0 else start data retrive
  const inst = sstore.getters['temp/getActiveInstance']
  inst ? setInstance(inst) : getServerInfo()
}

// Handles the response from 'adminRequired' and (token) 'required' auth tests
export const handleAuthRequired = (required) => {
  if (!required) {
    // if no auth is required, we skip the login
    sstore.commit('api/setLoginState', true)
    startApiInit(true)
  }
  // Login is possible at this point
  sstore.commit('api/setLoginReady', true)
}

// called by onclose and disconnect() to partly reset app state
function _softReset () {
  sstore.commit('api/resetLogEntries')
  sstore.commit('api/setLoginReady', false)
  sstore.commit('api/setLoginState', false)
  initialized = false
}

function _onmessage (msg) {
  let data = null
  try {
    data = JSON.parse(msg.data)
  } catch (e) {
    console.error('Failed to parse Hyperion response json', e, msg)
    return
  }
  if (process.env.DEV || sstore.getters['common/getDebugState']) console.log('RECEIVE', data)
  // eval success
  if (typeof data.success !== 'undefined' && !data.success && data.tan !== TAN_SKIP) {
    notify.error(`${i18n.t('conn.respFailure')}: CMD:${data.command} Error:${JSON.stringify(data.error)}`, 'wifi')
    return
  }

  // Command evaluation
  switch (data.command) {
    // base commands (Initilizing data)
    case 'sysinfo': sstore.commit('api/setSysInfo', data.info); break
    case 'config-getschema': sstore.commit('api/setServerSchema', data.info); break
    case 'config-geconfig': sstore.commit('api/setServerConfig', data.info); break
    case 'serverinfo': sstore.commit('api/setServerInfo', data.info)
      // init finalized!
      initialized = true; break
    // auth commands
    case 'authorize-adminRequired': handleAuthRequired(data.info.adminRequired); break
    case 'authorize-tokenRequired': handleAuthRequired(data.info.required); break
    //case 'authorize-login': handled in Login.vue
    // admin commands
    case 'authorize-getTokenList': sstore.commit('api/setTokenList', data.info); break
    case 'token-update': sstore.commit('api/setTokenList', data.data); break
    case 'authorize-getPendingTokenRequests': sstore.dispatch('api/setPendingTokens', data.info); break
    case 'authorize-tokenRequest': sstore.dispatch('api/setPendingTokens', data.info); break
    //case 'authorize-createToken' handled in TokenHandler
    // update commands
    case 'components-update': sstore.commit('api/setComponentsUpdate', data.data); break
    case 'effects-update': sstore.commit('api/updateEffects', data.effects); break
    case 'adjustment-update': sstore.commit('api/updateAdjustment', data.data); break
    case 'leds-update': sstore.commit('api/updateLeds', data.data.leds); break
    case 'plugins-update': sstore.commit('api/updatePlugins', data.data); break
    case 'instance-update': handleInstanceUpdate('update', data.data); break
    case 'priorities-update': sstore.commit('api/updatePriorities', data.data); break
    // logging
    case 'logging-update': sstore.commit('api/updateLog', data.result.messages); break
    case 'logging-stop': sstore.commit('api/resetLogEntries'); break
    // instance switch catcher success/not
    case 'instance-switchTo': handleInstanceUpdate('not', data); break
    default:
  }

  // Event emitter for direct data delivery
  EventBus.$emit(data.command, data)
}

function _onopen () {
  startApiInit()
}

function _onclose () {
  // onclose emits when we lost connection, not if we use disconnect()
  _softReset()
}

function _onstorecommit (ev) {
  sstore.commit(ev.data.path, ev.data.value)
}

function _onnotify (ev) {
  if (ev.data.type === 'error') {
    notify.error(i18n.t(ev.data.msg), ev.data.icon)
  } else {
    notify.success(i18n.t(ev.data.msg), ev.data.icon)
  }
}

/*
 * send to WebSocket implementation
 * @param command     String            the command
 * @param subcommand  String/undefined  the subcommand !! Use undefined as type if not required
 * @param data        Object            additional data as object
 * @param tan         Integer           overwrite tan of 1
 */
export function send (command, subcommand, data, tan = 1) {
  let obj = { command, subcommand, tan }
  if (data) { Object.assign(obj, data) }

  if (process.env.DEV || sstore.getters['common/getDebugState']) console.log('SEND', obj)
  ws.send(obj)
}

export async function sendAsync (command, subcommand, data, tan = 1) {
  let obj = { command, subcommand, tan }
  if (data) { Object.assign(obj, data) }

  if (process.env.DEV || sstore.getters['common/getDebugState']) console.log('SENDAS', obj)
  return ws.sendAsync(obj)
}
