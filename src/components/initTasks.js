// https://github.com/udivankin/sunrise-sunset#readme
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { qcolor } from '../utils'
import { colors } from 'quasar'
import { langMixin } from 'components/mixins'

let arrMix = [langMixin]

if (process.env.MODE == 'pwa') {
  import('components/mixins/appUpdate')
    .then((comp) => {
      arrayMix.push(comp.default)
    })
}

export default {
  name: 'init',
  mixins: arrMix,
  data () {
    return {
      disconnectTimerId: null,
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
    '$store.state.common.syncSettings.dark.mode' (val) {
      clearInterval(this.darkModeTimer)
      if (['time', 'gps'].includes(val)) {
        if (val === 'gps')
          // recalc start and end time based on gps
          this.calcGPSTime()
        this.updateDarkMode()
        this.darkModeTimer = setInterval(this.updateDarkMode, 1000 * 60)
      }
    },
    '$store.state.common.syncSettings.dark.startTime' (val) {
      if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
        this.updateDarkMode()
      }
    },
    '$store.state.common.syncSettings.dark.endTime' (val) {
      if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
        this.updateDarkMode()
      }
    },
    '$store.state.common.syncSettings.dark.lat' (val) {
      if (this.$store.getters['common/getDarkMode'] == 'gps') {
        this.calcGPSTime()
      }
    },
    '$store.state.common.syncSettings.dark.long' (val) {
      if (this.$store.getters['common/getDarkMode'] == 'gps') {
        this.calcGPSTime()
      }
    },
    '$store.state.temp.ledStreamRequest' (val) {
      this.$socket.setLedStream(val.length > 0)
    },
    '$store.state.temp.imageStreamRequest' (val) {
      this.$socket.setImageStream(val.length > 0)
    },
    '$store.state.api.loggedin' (val) {
      if (val) {
        if (this.$store.state.temp.imageStreamRequest.length > 0)
          this.$socket.setImageStream(true)
        if (this.$store.state.temp.ledStreamRequest.length > 0)
          this.$socket.setLedStream(true)
      }
    }
  },
  mounted () {
    this.setAppLang(this.$store.getters['common/getLang'])

    // if we are in EMBED mode, force adminMode
    if (process.env.EMBED) { this.$store.commit('common/setAdminAppMode', true) }
    // Update Check for PWA TODO: Does this work? May be to slow
    if (process.env.MODE == 'pwa') this.checkForAppUpdateAndAsk()

    // make sure Quasar dark plugin is properly set based on user setting
    this.$store.commit('common/setDarkMode', this.$store.getters['common/getDarkMode'])
    // handle darkMode switch if time/gps mode
    if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
      if (this.$store.getters['common/getDarkMode'] === 'gps')
        // recalc start and end time based on gps
        this.calcGPSTime()
      this.updateDarkMode()
      this.darkModeTimer = setInterval(this.updateDarkMode, 1000 * 60)
    }

    // hide splash screens
    this.__handlehideSplashes()
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
      if (!this.$store.getters['temp/isConnected'] && this.$store.getters['connection/getLastAddress']) {
        this.$socket.connect()
      }
      // start darkModeTimer if time/gps mode
      // stop darkModeTimer
      clearInterval(this.darkModeTimer)
      if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
        if (this.$store.getters['common/getDarkMode'] == 'gps')
          this.calcGPSTime()
        this.updateDarkMode()
        this.darkModeTimer = setInterval(this.updateDarkMode, 1000 * 60)
      }
    },
    onInvisible () {
      // app not visible
      const autoDisconnect = this.$store.getters['connection/getAutoDisconnect']
      const prevDisconnect = this.$store.getters['temp/getPreventAutoDisconnect']
      // reset timer if possible and start new one if time is > 0 AND we are currently connected
      if (!prevDisconnect && autoDisconnect) {
        this.stopTimer()
        // 10 seconds delay before disconnect
        this.disconnectTimerId = setTimeout(this.disconnect, 10 * 1000)
      }
      // stop darkModeTimer
      clearInterval(this.darkModeTimer)
    },
    disconnect (context) {
      this.$socket.disconnect()
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
        } else if (window.electron) {
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
    __handlehideSplashes () {
      this.$nextTick(() => {
        if (this.$q.platform.is.cordova) {
          // Hide splashscreen on cordova after all childs have been rendered
          navigator.splashscreen.hide()
        }
        else if (window.electron) {
          // delay the show slightly
          setTimeout(() => window.electron.ipc.send('hidesplash'), 250)
        }
      })
    },
    __handleCordovaOnly () {
      this.$nextTick(() => {

        if (this.$q.platform.is.cordova) {
          // Back button exit listener
          document.addEventListener('backbutton', this.onBackKeyDown, false)
        }
      })

      /* Cordova StatusBar color
          if (this.$q.platform.is.cordova && cordova.platformId === 'android') {
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString(qcolor.toHex(this.$store.getters['common/getThemeColor']))
    }
    */
    },
    calcGPSTime () {
      const lat = this.$store.getters['common/getDarkLat']
      const long = this.$store.getters['common/getDarkLong']
      const eTime = getSunrise(lat, long)
      const sTime = getSunset(lat, long)
      const end = (('0' + eTime.getHours()).slice(-2)) + ':' + (('0' + eTime.getMinutes()).slice(-2))
      const start = (('0' + sTime.getHours()).slice(-2)) + ':' + (('0' + sTime.getMinutes()).slice(-2))
      this.$store.commit('common/setDarkStartTime', start)
      this.$store.commit('common/setDarkEndTime', end)
    },
    updateDarkMode () {
      // Time based switch calc
      let dateNow = new Date()
      let startTime = parseInt(this.$store.getters['common/getDarkStartTime'].replace(':', ''))
      let endTime = parseInt(this.$store.getters['common/getDarkEndTime'].replace(':', ''))
      let now = parseInt((('0' + dateNow.getHours()).slice(-2)) + (('0' + dateNow.getMinutes()).slice(-2)))

      if ((startTime < endTime) ? ((now >= startTime) && (now <= endTime)) : ((now >= startTime) || (now <= endTime))) {
        if (!this.$q.dark.isActive) { this.$store.commit('common/setDark', true) }
      } else {
        if (this.$q.dark.isActive) { this.$store.commit('common/setDark', false) }
      }
    }
  }
}
