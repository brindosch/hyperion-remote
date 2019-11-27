
import { qcolor } from '../utils'
import { colors } from 'quasar'
import { langMixin } from 'components/mixins'

export default {
  name: 'init',
  mixins: [langMixin],
  data () {
    return {
      disconnectTimerId: null,
      reconnect: false,
      backButtonTimer: null,
      darkModeTimer: null
    }
  },
  created () {
    // setup theme color
    colors.setBrand('primary', qcolor.toHex(this.$store.getters['common/getThemeColor']))

    // disable context menu in prod mode
    document.addEventListener('contextmenu', e => {
      if (process.env.PROD && !this.$store.getters['common/getDebugState']) {
        e.preventDefault()
      }
    })
  },
  watch: {
    '$q.dark.isActive' (val) {
      // Watch for platform based dark/light changes, apply if we are in the correct mode
      // TODO: Test if this.$q.dark.set(true/false) have an impact on the AUTO functionality
      if (this.$store.getters['common/getDarkMode'] === 'platform') {
        this.$store.commit('common/setDarkTheme', val)
        console.log(val ? 'Dark Watch: On dark mode' : 'Dark Watch: On light mode')
      }
    },
    '$store.state.common.syncSettings.darkMode' (val) {
      clearInterval(this.darkModeTimer)
      if (val === 'time') {
        this.updateDarkMode()
        this.darkModeTimer = setInterval(this.updateDarkMode, 1000 * 60)
      }
    },
    '$store.state.common.syncSettings.darkTimespan' (val) {
      if (this.$store.getters['common/getDarkMode'] === 'time') {
        this.updateDarkMode()
      }
    }
  },
  mounted () {
    this.setAppLang(this.$store.getters['common/getLang'])

    // if we are in EMBED mode, force adminMode and autoConnect
    if (process.env.EMBED) { this.$store.commit('common/setAdminAppMode', true); this.$store.commit('connection/setAutoConnect', true) }

    // make sure Quasar dark plugin is properly set based on user setting
    this.$store.commit('common/setDarkMode', this.$store.getters['common/getDarkMode'])
    // handle darkMode switch if time mode
    if (this.$store.getters['common/getDarkMode'] === 'time') {
      this.updateDarkMode()
      this.darkModeTimer = setInterval(this.updateDarkMode, 1000 * 60)
    }

    this.__handleOriginName()
    this.__handleVisibility()
    this.__handleCordovaOnly()
  },
  beforeDestroy () {
    document.removeEventListener('pause', this.onInvisible, false)
    document.removeEventListener('resume', this.onVisible, false)
  },
  methods: {
    onVisible () {
      // app visible
      this.stopTimer()
      // check if reconnect required
      if (this.reconnect) {
        this.$socket.connect()
        this.reconnect = false
      }
      // start darkModeTimer if time mode
      if (this.$store.getters['common/getDarkMode'] === 'time') {
        this.darkModeTimer = setInterval(this.updateDarkMode, 1000 * 60)
      }
    },
    onInvisible () {
      // app not visible
      const autoDisconnect = this.$store.getters['connection/getAutoDisconnect']
      const connected = this.$store.getters['temp/getConnectedState']
      const prevDisconnect = this.$store.getters['temp/getPreventAutoDisconnect']
      // reset timer if possible and start new one if time is > 0 AND we are currently connected
      if (!prevDisconnect && autoDisconnect && connected) {
        this.stopTimer()
        // 10 seconds delay before disconnect
        this.disconnectTimerId = setTimeout(this.disconnect, 10 * 1000)
      }
      // stop darkModeTimer
      clearInterval(this.darkModeTimer)
    },
    disconnect (context) {
      this.$socket.disconnect()
      this.reconnect = true
    },
    stopTimer () {
      if (this.disconnectTimerId) {
        clearTimeout(this.disconnectTimerId)
        this.disconnectTimerId = null
      }
    },
    onBackKeyDown () {
      // cordova back key exit, if pressed 2 times within 400ms we exit
      if (this.backButtonTimer === null) {
        this.backButtonTimer = setTimeout(() => {
          this.backButtonTimer = null
        }, 400)
      } else {
        navigator.app.exitApp()
      }
    },
    __handleOriginName () {
      // Determine the originName (App Name) based on current env if null
      if (this.$store.getters['common/getOriginName'] === null) {
        let origin = ''

        if (this.$q.platform.is.cordova) {
          if (cordova.platformId === 'android') {
            origin = 'Android App'
          } else if (cordova.platformId === 'ios') {
            origin = 'iOS App'
          } else {
            console.error('setOriginName in initTasks has no value for this cordova platform', cordova.platformId)
          }
        } else if (this.$q.platform.is.electron) {
          origin = 'Desktop App'
        } else if (process.env.MODE === 'pwa') {
          origin = 'Web App'
        } else if (process.env.MODE === 'spa' && process.env.EMBED) {
          origin = 'Web Config'
        } else {
          origin = 'Browser App'
        }
        this.$store.commit('common/setOriginName', origin)
      }
    },
    __handleVisibility () {
      // Visible / Invisible listeners
      if (this.$q.platform.is.cordova) {
        // Cordova visible / Invisible listeners
        document.addEventListener('pause', this.onInvisible, false)
        document.addEventListener('resume', this.onVisible, false)
      } else {
        // Native Browser listeners
        // Cordova Note: This works also with android webview v61+
        this.$watch('$q.appVisible', function (val) {
          val ? this.onVisible() : this.onInvisible()
        })
      }
    },
    __handleCordovaOnly () {
      this.$nextTick(() => {
        // Hide splashscreen on cordova after all childs have been rendered
        if (this.$q.platform.is.cordova) { navigator.splashscreen.hide() }
      })

      /* Cordova StatusBar color
          if (this.$q.platform.is.cordova && cordova.platformId === 'android') {
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString(qcolor.toHex(this.$store.getters['common/getThemeColor']))
    }
    */

      // Back button exit listener
      if (this.$q.platform.is.cordova) {
        document.addEventListener('backbutton', this.onBackKeyDown, false)
      }
    },
    updateDarkMode () {
      // Time based switch calc
      let dateNow = new Date()
      let startTime = parseInt(this.$store.getters['common/getDarkStartTime'].replace(':', ''))
      let endTime = parseInt(this.$store.getters['common/getDarkEndTime'].replace(':', ''))
      let now = parseInt((dateNow.getHours() < 10 ? '0' + String(dateNow.getHours()) : String(dateNow.getHours())) + (dateNow.getMinutes() < 10 ? '0' + String(dateNow.getMinutes()) : String(dateNow.getMinutes())))

      if ((startTime < endTime) ? ((now >= startTime) && (now <= endTime)) : ((now >= startTime) || (now <= endTime))) {
        if (!this.$q.dark.isActive) { this.$store.commit('common/setDark', true) }
      } else {
        if (this.$q.dark.isActive) { this.$store.commit('common/setDark', false) }
      }
    }
  }
}
