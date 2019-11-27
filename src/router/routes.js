import store from '../store'
import CleanLayout from 'layouts/clean'
import DefaultLayout from 'layouts/default'

export default [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      // meta.icon and meta.title are MANDATORY for all entries (default layout header info)
      { path: '', component: () => import('pages/dashboard'), meta: { icon: 'dashboard', title: 'pages.dashboard' } },
      { path: 'control', component: () => import('pages/control'), meta: { icon: 'fas fa-gamepad', title: 'pages.control' } },
      { path: 'about', component: () => import('pages/about'), meta: { icon: 'info', title: 'pages.about' } },
      {
        path: 'settings',
        component: () => import('pages/settings/settings'),
        meta: { icon: 'settings', title: 'pages.settings' },
        children: [
          {
            path: '/',
            alias: 'app',
            component: () => import('pages/settings/App')
          },
          {
            path: 'ledlayout',
            component: () => import('pages/settings/LedLayout')
          },
          {
            path: 'instance',
            component: () => import('pages/settings/Instance')
          },
          {
            path: 'authorization',
            component: () => import('pages/settings/Authorization')
          },
          {
            path: 'leddevice',
            component: () => import('pages/settings/LedDevice')
          }
        ],
        meta: { icon: 'info', title: 'pages.config' },
        beforeEnter: (to, from, next) => {
          // if we come from login/connect, we are not allowed to navigate as non admin. '/' and '/app' are allowed targets
          if (!['/settings', '/settings/app'].includes(to.path)) {
            const notAdminNext = ['/login', '/connect'].includes(from.fullPath) ? '/' : false
            store.state.common.uiSettings.adminAppMode ? next() : next(notAdminNext)
          } else {
            next()
          }
        }
      }
    ]
  },
  { // loads clean as alternate layout if one of the childs matches
    // Pages of clean layout don't use meta object
    path: '/',
    component: CleanLayout,
    children: [
      { path: 'connect', name: 'connect', component: () => import('pages/connect'), props: true },
      { path: 'login', name: 'login', component: () => import('pages/login'), props: true }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: CleanLayout,
    children: [
      { path: '', name: '404', component: () => import('pages/404') }
    ]
  }
]
