/* eslint-disable no-template-curly-in-string */
// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'notify-defaults',
      'vue-draggable-resizable',
      'vuedraggable',
      ctx.mode.electron ? 'socket-electron' : 'socket',
      ctx.mode.electron ? 'ssdp-electron' : ''
    ],
    css: [
      'app.styl',
      ctx.mode.electron ? 'electron.css' : ''
    ],
    extras: [
      'material-icons',
      'fontawesome-v5',
      'roboto-font'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      rtl: true,
      env: {
        VERSION: JSON.stringify(require('./package.json').version),
        BUILDDATE: JSON.stringify(new Date().toUTCString())
      },
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        /* Disable linter
          cfg.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules|quasar)/
          })
        */
        // dedicated worker support for webpack during dev / cfg.output is a workaround
        // Issue: https://github.com/webpack-contrib/worker-loader/issues/166
        // eslint-disable-next-line no-unused-expressions
        ctx.dev ? (cfg.output = { globalObject: 'this' }) : ''
        cfg.module.rules.push({
          test: /\.worker\.js$/,
          exclude: /(node_modules|quasar)/,
          use: { loader: 'worker-loader' }
        })
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language
      // framework: 'all' --- includes everything; for dev only!
      components: [
        'QPageScroller',
        'QBtn',
        'QBtnGroup',
        'QBtnDropdown',
        'QBar',
        'QSpace',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QSeparator',
        'QExpansionItem',
        'QColor',
        'QInput',
        'QField',
        'QIcon',
        'QItem',
        'QItemLabel',
        'QItemSection',
        'QLayout',
        'QPageContainer',
        'QPage',
        'QDrawer',
        'QHeader',
        'QList',
        'QMenu',
        'QResizeObserver',
        'QSelect',
        'QSlider',
        'QTab',
        'QTabs',
        'QTabPanels',
        'QTabPanel',
        'QToggle',
        'QRadio',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
        'QPopupProxy',
        'QDialog',
        'QImg',
        'QLinearProgress'
      ],
      directives: [
        'ClosePopup',
        'Ripple',
        'TouchSwipe'
      ],
      plugins: [
        'Notify',
        'AddressbarColor',
        'AppVisibility',
        'Dialog',
        'Loading',
        'AppFullscreen'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      id: 'org.hyperion.project.remote'
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },
    electron: {
      bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'org.hyperion.project.remote',
        copyright: 'hyperion-project.org',
        productName: 'Hyperion Remote',
        linux: {
          synopsis: 'Hyperion Desktop Remote',
          category: 'Utility',
          target: ['snap', 'deb', 'rpm', 'tar.gz']
        },
        win: {
          target: [
            {
              target: 'zip',
              arch: [
                'x64',
                'ia32'
              ],
              artifactName: '${productName}-${version}-${arch}-win.${ext}'
            },
            {
              target: 'nsis',
              arch: [
                'x64',
                'ia32'
              ],
              artifactName: '${productName}-Setup-${version}.${ext}',
              oneClick: true,
              allowToChangeInstallationDirectory: false,
              deleteAppDataOnUninstall: true
            }
          ]
        },
        mac: {
          category: 'public.app-category.utilities',
          type: 'distribution',
          darkModeSupport: true,
          target: ['dmg', 'mas', 'pkg', 'tar.gz']
        }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0-beta.4'
  }
}
