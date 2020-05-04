import { Plugins } from '@capacitor/core'

const { App } = Plugins

export default {
  name: 'visible',
  data () {
    return {
    }
  },
  methods: {
    visInitVisibility () {
      // Visible / Invisible listeners
      if (this.$q.platform.is.capacitor) {
        App.addListener('appStateChange', (state) => {
          // state.isActive contains the active state
          state.isActive ? this.onVisible() : this.onInvisible()
        })
      } else if (this.$q.platform.is.cordova) {
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
    }
  }
}
