
export default {
  name: 'splashscreen',
  data () {
    return {
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
    }
  }
}
