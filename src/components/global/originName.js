
import { Plugins } from '@capacitor/core'

const { Device } = Plugins

export default {
  name: 'originName',
  data () {
    return {
    }
  },
  methods: {
    async __handleOriginName () {
      // Determine the originName (App Name) based on current env if null
      if (this.$store.getters['common/getOriginName'] === null) {
        let origin = ''

        if (this.$q.platform.is.cordova) {
          if (cordova.platformId === 'android') {
            origin = 'Android App'
          } else if (cordova.platformId === 'ios') {
            origin = 'iOS App'
          } else {
            console.error('handleOrigin Name has no value for this cordova platform', cordova.platformId)
          }
        } if (this.$q.platform.is.capacitor) {
          const info = await Device.getInfo()
          if (info.platform === 'android') {
            origin = 'Android App'
          } else if (info.platform === 'ios') {
            origin = 'iOS App'
          } else {
            console.error('handleOriginName has no value for this capcitor platform', info.platform)
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
    }
  }
}
