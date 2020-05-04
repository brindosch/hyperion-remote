import { openURL } from 'quasar'
import { Plugins } from '@capacitor/core'

const { App } = Plugins

export default {
  name: 'openUrlMixin',
  data () {
    return {
    }
  },
  methods: {
    async openUrl (url) {
      // whitelist URLs to open?!
      if (window.electron) {
        window.electron.openUrl(url)
      } else if (this.$q.platform.is.capacitor) {
        // var ret = await App.canOpenUrl({ url: 'com.getcapacitor.myapp' });
        // console.log('Can open url: ', ret.value);

        const ret = await App.openUrl({ url })
        if (!ret.completed) { this.$q.notify(`Failed to open url: ${url}`) }
      } else {
        openURL(url)
      }
    }
  }
}
