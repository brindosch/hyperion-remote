import store from '../store'

export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      // meta.icon and meta.title are MANDATORY for all entries (default layout header info)
      { path: '', component: () => import('pages/index'), meta: { icon: 'dashboard', title: 'pages.dashboard' } },
      { path: 'control', component: () => import('pages/control'), meta: { icon: 'fas fa-gamepad', title: 'pages.control' } },
      { path: 'settings', component: () => import('pages/settings'), meta: { icon: 'settings', title: 'pages.settings' } },
      { path: 'about', component: () => import('pages/about'), meta: { icon: 'info', title: 'pages.about' } },
      {
        path: 'config',
        component: () => import('pages/config/config'),
        children: [
          {
            path: '/',
            alias: 'ledlayout',
            component: () => import('pages/config/LedLayout')
          },
          {
            path: 'leddevice',
            component: () => import('pages/config/LedDevice')
          }
        ],
        meta: { icon: 'info', title: 'pages.config' },
        beforeEnter: (to, from, next) => {
          // if we come from login/connect, we are not allowed to navigate as non admin
          const notAdminNext = ['/login', '/connect'].includes(from.fullPath) ? '/' : false
          store.state.common.uiSettings.adminAppMode ? next() : next(notAdminNext)
        }
      }
    ]
  },
  { // loads clean as alternate layout if one of the childs matches
    // Pages of clean layout don't use meta object
    path: '/',
    component: () => import('layouts/clean'),
    children: [
      { path: 'connect', name: 'connect', component: () => import('pages/connect'), props: true },
      { path: 'login', name: 'login', component: () => import('pages/login'), props: true }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('layouts/clean'),
    children: [
      { path: '', name: '404', component: () => import('pages/404') }
    ]
  }
]
