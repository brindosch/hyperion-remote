import Vue from 'vue'
import VueRouter from 'vue-router'
import { Loading, QSpinnerGears } from 'quasar'
import store from '../store'

import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  // preserve scrolling positions if available
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

Router.beforeEach((to, from, next) => {
  // reset top bar "BtnMore" menu
  store.commit('temp/setBtnMoreEntries', [])

  Loading.show({
    spinner: QSpinnerGears,
    spinnerSize: 150
  })

  // route change allowed at this point
  next()
})

Router.afterEach((to, from, next) => {
  Loading.hide()
})

export default Router
