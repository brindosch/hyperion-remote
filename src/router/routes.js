import store from '../store'
import DefaultLayout from 'layouts/default'

export default [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      // meta.icon and meta.title are MANDATORY for all entries (default layout header info)
      { path: '/', alias: '/control', component: () => import('pages/control'), meta: { icon: 'fas fa-gamepad', title: 'pages.control' } },
      { path: 'dashboard', component: () => import('pages/dashboard'), meta: { icon: 'dashboard', title: 'pages.dashboard' } },
      { path: 'about', component: () => import('pages/about'), meta: { icon: 'info', title: 'pages.about' } },
      { path: 'test', component: () => import('pages/test'), meta: { icon: 'info', title: 'pages.about' } },
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
        beforeEnter: (to, from, next) => {
          // prevent navigation to routes that are just for admin app mode
          if (!['/settings', '/settings/app'].includes(to.path)) {
            store.state.common.uiSettings.adminAppMode ? next() : next('/')
          } else {
            next()
          }
        }
      }
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
