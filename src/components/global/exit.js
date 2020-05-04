
export default {
  name: 'exit',
  data () {
    return {
      backButtonTimer: null
    }
  },
  mounted () {
    if (this.$q.platform.is.cordova) {
      // Back button exit listener
      document.addEventListener('backbutton', this.onBackKeyDown, false)

    /* Cordova StatusBar color
  if (this.$q.platform.is.cordova && cordova.platformId === 'android') {
// eslint-disable-next-line no-undef
StatusBar.backgroundColorByHexString(qcolor.toHex(this.$store.getters['common/getThemeColor']))
}
*/
    }
  },
  methods: {
    spHideSplash () {
      this.$nextTick(() => {
        if (this.$q.platform.is.cordova) {
          // Hide splashscreen on cordova after all childs have been rendered
          navigator.splashscreen.hide()
        } else if (window.electron) {
          // delay the show slightly
          setTimeout(() => window.electron.ipc.send('hidesplash'), 250)
        }
      })
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
