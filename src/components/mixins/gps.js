import openUrlMixin from './openUrl'
import dialogMixin from './dialog'
import { Plugins } from 'app/src-capacitor/node_modules/@capacitor/core'

const { Geolocation } = Plugins

export default {
  name: 'GpsMixin',
  mixins: [openUrlMixin, dialogMixin],
  data () {
    return {

    }
  },
  methods: {
    // Get the current GPS coords (longitude,latitude).
    // param: notifySucces  If true notify a success, that the data has been applied
    // If no results are found, a Dialog will ask the user if a browser should be opened with an external service
    // Returns false or an object {longitude:data,latitude:data}
    async getGpsPosition (notifySucces = true) {
      let data = false
      if (this.$q.platform.is.capacitor) {
        data = await this._getCapacitorPosition()
      } else if (navigator.geolocation) {
        data = await this._getBrowserPosition()
      }
      // in case of failure
      if (!data) {
        const open = await this.openConfirmDialog({
          title: this.$t('utils.gps.not'),
          msg: this.$t('utils.gps.openBrowser')
        })
        if (open) { this.openUrl('https://www.google.com/maps') }
      } else if (notifySucces) {
        this.$q.notify(this.$t('utils.gps.applied'))
      }
      return data
    },
    async _getBrowserPosition () {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          if (pos) { resolve({ longitude: pos.coords.longitude, latitude: pos.coords.latitude }) } else { resolve(false) }
        }, (err) => {
          if (process.env.DEV || this.$store.getters['common/getDebugState']) { console.log(`Browser geolocation: ${err.message}`) }
          resolve(false)
        })
      })
    },
    async _getCapacitorPosition () {
      let data
      try {
        data = await Geolocation.getCurrentPosition()
      } catch (error) {
        return false
      }
      console.log('gps DATA', data)
      this.$q.notify(`Here is some GPS data:${JSON.stringify(data)}`)
    }
  }
}
