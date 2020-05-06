import { copyToClipboard } from 'quasar'
import { Plugins } from 'app/src-capacitor/node_modules/@capacitor/core'

const { Clipboard } = Plugins

export default {
  name: 'clipboardMixin',
  data () {
    return {

    }
  },
  methods: {
    copyToClipboard (data) {
      this.__copyToClipboard(data)
        .then(() => {
          this.$q.notify(this.$t('utils.copiedToClipboard'))
        })
        .catch((error) => {
          console.error(`Copy to clipboard failure: ${error}`)
          this.$q.notify({ color: 'negative', message: this.$t('utils.copyToClipboardFail', [`: ${error}`]) })
        })
    },
    async readFromClipboard () {
      if (this.$q.platform.is.capacitor) {
        const res = await Clipboard.read()
        return res.value
      } else if (this.$q.platform.is.electron) {
        return window.electron.readFromClipboard()
      } else {
        await navigator.clipboard.readText()
      }
    },
    async __copyToClipboard (data) {
      let res
      if (window.electron) {
        res = new Promise((resolve, reject) => {
          window.electron.copyToClipboard(data)
          resolve(true)
        })
      } else if (this.$q.platform.is.capacitor) {
        Clipboard.write({
          string: data
        })
      } else {
        res = await copyToClipboard(data)
      }
      return res
    }
  }
}
