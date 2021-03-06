/* eslint-disable no-template-curly-in-string */
// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (ctx) {
  return {
    bin: {
      windowsAndroidStudio: 'G:\\Programme\\AndroidStudio\\bin\\studio64.exe'
    },
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios',
      'notify-defaults',
      'capacitor',
      ctx.mode.electron ? 'socket-electron' : 'socket'
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
    build: {
      devtool: ctx.dev ? 'source-map' : '',
      scopeHoisting: true,
      vueRouterMode: 'history',
      publicPath: JSON.stringify(process.env.SPAEMBED) ? '/next/' : undefined,
      rtl: true,
      env: {
        VERSION: require('./package.json').version,
        BUILDDATE: Date.now(),
        EMBED: JSON.stringify(process.env.SPAEMBED),
        REPO_URL: 'https://github.com/brindosch/hyperion-remote/', // with trailing slash
        DOCS_URL: 'https://brindosch.github.io/', // with trailing slash
        SUPPORT_URL: 'https://github.com/brindosch/hyperion-remote/' // with trailing slash
      },
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        // Copy github.io 404html to dist
        // eslint-disable-next-line no-unused-expressions
        ctx.mode.pwa ? cfg.plugins.push(new CopyWebpackPlugin({ patterns: [{ from: './src/assets/404.html', to: '' }] })) : null
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
      importStrategy: 'auto',
      autoImportComponentCase: 'pascal', // or 'kebab' (default) or 'combined'
      // For special cases outside of where auto-import "auto" can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],
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
        'QLinearProgress',
        'QTime',
        'QPopupEdit',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QBanner'
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
      ],
      config: {
        dark: 'auto' // or Boolean true/false
      }
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
        name: 'Hyperion Remote',
        short_name: 'Hyperion-Remote',
        description: 'Remote Control for Hyperion',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },
    capacitor: {

    },
    electron: {
      nodeIntegration: false,
      bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // Copy splashscreen to dist
        cfg.plugins.push(new CopyWebpackPlugin({ patterns: [{ from: './src-electron/main-process/statics/electron-splash.html', to: '' }] }))
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'org.hyperion.project.remote',
        copyright: 'hyperion-project.org',
        productName: 'Hyperion Remote',
        artifactName: 'Hyperion-Remote-${version}-${os}-${arch}.${ext}',
        generateUpdatesFilesForAllChannels: true,
        detectUpdateChannel: true,
        electronUpdaterCompatibility: '>= 2.16',
        publish: [
          {
            provider: 'generic',
            url: 'https://github.com/brindosch/hyperion-remote/releases/download/v${version}/'
            // channel: '${channel}'// From detectUpdateChannel?
          }
        ],
        // LINUX
        linux: {
          synopsis: 'Hyperion Desktop Remote',
          category: 'Utility',
          target: ['snap', 'deb', 'rpm', 'tar.gz']
        },
        // WINDOWS
        win: {
          target: [
            {
              target: 'zip',
              arch: [
                'x64',
                'arm64'
              ]
            },
            {
              target: 'nsis',
              arch: [
                'x64'
              ]
            }
          ]
        },
        nsis: {
          artifactName: 'Hyperion-Remote-Setup-${version}-${os}.${ext}',
          oneClick: true,
          allowToChangeInstallationDirectory: false,
          deleteAppDataOnUninstall: true
        },
        // MAC
        mac: {
          category: 'public.app-category.utilities',
          type: 'distribution',
          darkModeSupport: true,
          target: ['dmg', 'mas', 'pkg', 'zip']
        }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0-beta.4'
  }
}
