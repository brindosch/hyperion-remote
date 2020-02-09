import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import connection from './connection'
import common from './common'
import temp from './temp'
import api from './api'

Vue.use(Vuex)

let storageDriver = null
if (window && window.localStorage) {
  storageDriver = window.localStorage
  console.log('Use window.localStorage for vuex-persist')
} else { console.error('No storageDriver for vuex-persist found') }

// Async all write actions helper
// https://github.com/championswimmer/vuex-persist/issues/17#issuecomment-350825480
const requestIdleCallback = window.requestIdleCallback || (cb => {
  let start = Date.now()
  return setTimeout(() => {
    let data = {
      didTimeout: false,
      timeRemaining () {
        return Math.max(0, 50 - (Date.now() - start))
      }
    }
    cb(data)
  }, 1)
})

// create instance of vuex-persist
// config: https://www.npmjs.com/package/vuex-persist
// Modules to persist: common and connection
const vuexLocal = new VuexPersistence({
  storage: storageDriver,
  modules: ['connection', 'common'],
  saveState: (key, state, storage) => {
    // async save handler
    requestIdleCallback(() => {
      let data = JSON.stringify(state)
      /*  if (storage && storage._config && storage._config.name === 'localforage') {
        data = merge({}, state)
      }
    */
      storage.setItem(key, data)
    })
  }
})

const store = new Vuex.Store({
  modules: {
    connection,
    common,
    temp,
    api
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.DEV
})

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// gets into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./connection'], () => {
    const newConnection = require('./connection').default
    store.hotUpdate({ modules: { connection: newConnection } })
  })
  module.hot.accept(['./common'], () => {
    const newCommon = require('./common').default
    store.hotUpdate({ modules: { common: newCommon } })
  })
  module.hot.accept(['./temp'], () => {
    const newTemp = require('./temp').default
    store.hotUpdate({ modules: { temp: newTemp } })
  })
  module.hot.accept(['./api'], () => {
    const newApi = require('./api').default
    store.hotUpdate({ modules: { api: newApi } })
  })
}

export default store
