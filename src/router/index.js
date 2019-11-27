import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { Loading, QSpinnerGears } from 'quasar'

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
  // update last page, this captures also if you open the page with a sub-page like /log. So it's possible to overwrite the navigation on demand
  if (to.path !== '/connect' && to.path !== '/login') {
    store.commit('temp/setLastPage', to.path)
  }

  if (store.state.temp.connected) {
    // do not visit '/connect' when connected
    if (to.path === '/connect') {
      next(false)
      return
    }

    // when we are connected, we might need to authorize us
    if (store.state.api.loggedin) {
      // do not visit '/login' when loggedin
      if (to.path === '/login') {
        next(false)
        return
      }
    } else {
      // visit /login when not loggedin
      if (to.path !== '/login') {
        next('/login')
        return
      }
    }
  } else {
    // visit /connect when not connected
    // Note: Should be skipped when embedded
    if (to.path !== '/connect') {
      next('/connect')
      return
    }
  }
  // independent of the connected state, you shouldn't visit login
  if (store.state.api.loggedin) {
    // do not visit '/login' when connected
    if (to.path === '/login') {
      next(false)
      return
    }
  }

  Loading.show({
    delay: 300,
    spinner: QSpinnerGears,
    spinnerSize: 150,
    spinnerColor: 'white',
    customClass: 'bg-hyperion'
  })

  // route change allowed at this point
  next()
})

Router.afterEach((to, from, next) => {
  Loading.hide()
})

export default Router
