import { copyToClipboard } from 'quasar'

export default {
  name: 'copyToClipBoardMixin',
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
    async __copyToClipboard (data) {
      let res
      if (window.electron) {
        res = new Promise((resolve, reject) => {
          window.electron.copyToClipboard(data)
          resolve(true)
        })
      } else {
        res = await copyToClipboard(data)
      }
      return res
    }
  }
}
