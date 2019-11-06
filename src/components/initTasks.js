
import { qcolor } from '../utils'
import { colors } from 'quasar'

export default {
  name: 'init',
  data () {
    return {
      disconnectTimerId: null,
      reconnect: false,
      backButtonTimer: null
    }
  },
  created () {
    // setup theme color
    colors.setBrand('primary', qcolor.toHex(this.$store.getters['common/getThemeColor']))

    this.$q.addressbarColor.set('#1e2f48')
  },
  mounted () {
    // init i18n loading based on browser locale, if current locale is null
    let storedLocale = this.$store.getters['common/getCurrentLocale']
    if (storedLocale == null) {
      storedLocale = this.$q.lang.getLocale()
      console.log('Detected browser locale:', storedLocale)
    }
    this.$store.dispatch('common/setLocale', { lang: storedLocale, app: this })

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
      } else {
        origin = 'Browser App'
      }
      this.$store.commit('common/setOriginName', origin)
    }

    this.$nextTick(() => {
      // Hide splashscreen on cordova after all childs have been rendered
      if (this.$q.platform.is.cordova) { navigator.splashscreen.hide() }
    })

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
    // Back button exit listener
    if (this.$q.platform.is.cordova) {
      document.addEventListener('backbutton', this.onBackKeyDown, false)
    }
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
    }
  }
}
