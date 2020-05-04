// https://github.com/udivankin/sunrise-sunset#readme
import { qcolor } from '../utils'
import { colors } from 'quasar'
import { langMixin } from 'components/mixins'
import originName from 'components/global/originName'
import darkMode from 'components/global/darkMode'
import visible from 'components/global/visible'
import connect from 'components/global/connect'
import splash from 'components/global/splashscreen'
import exit from 'components/global/exit'

const arrMix = [langMixin, originName, darkMode, visible, connect, splash, exit]

if (process.env.MODE === 'pwa') {
  import('components/mixins/appUpdate')
    .then((comp) => {
      arrMix.push(comp.default)
    })
}

export default {
  name: 'init',
  mixins: arrMix,
  data () {
    return {
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
    '$store.state.temp.ledStreamRequest' (val) {
      this.$socket.setLedStream(val.length > 0)
    },
    '$store.state.temp.imageStreamRequest' (val) {
      this.$socket.setImageStream(val.length > 0)
    },
    '$store.state.api.loggedin' (val) {
      if (val) {
        if (this.$store.state.temp.imageStreamRequest.length > 0) { this.$socket.setImageStream(true) }
        if (this.$store.state.temp.ledStreamRequest.length > 0) { this.$socket.setLedStream(true) }
      }
    }
  },
  mounted () {
    this.setAppLang(this.$store.getters['common/getLang'])

    // if we are in EMBED mode, force adminMode
    if (process.env.EMBED) { this.$store.commit('common/setAdminAppMode', true) }
    // Update Check for PWA TODO: Does this work? May be to slow
    if (process.env.MODE === 'pwa') this.checkForAppUpdateAndAsk()

    // hide splash screens
    this.dmInitDarkMode()
    this.spHideSplash()
    this.__handleOriginName()
    this.visInitVisibility()
  },
  methods: {
    onVisible () {
      // app visible
      this.coStopDisconnect()
      // check if reconnect required
      this.coHandleReconnect()
      // start darkModeTimer
      this.dmStartDarkModeTimer()
    },
    onInvisible () {
      // app not visible
      this.coHandleDisconnect()
      // stop darkModeTimer
      this.dmStopDarkModeTimer()
    }
  }
}
