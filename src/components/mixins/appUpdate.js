import dialogMixin from './dialog'

export default {
  name: 'appUpdateMixin',
  mixins: [dialogMixin],
  data () {
    return {
      checkForAppUpdateRunner: false
    }
  },
  computed: {
    isAppUpdateRunning () {
      return this.checkForAppUpdateRunner
    },
    showAppUpdate () {
      return process.env.MODE == 'pwa'
    }
  },
  methods: {
    // Check for update and ask the user if he want's to download & apply it now
    // PWA: Installs automatically, but a page reload is required
    async checkForAppUpdateAndAsk () {
      const res = await this.checkForAppUpdate()
      if (res) {
        const diares = this.openConfirmDialog({ title: this.$t('app.updateAvail'), msg: this.$t('app.updateAvailMsg') })
        if (diares) {
          this.doAppUpdate()
        }
      } else {
        this.$q.notify(this.$t('app.upToDate'))
      }
    },
    // Check if an app update is available
    // PWA: Installs automatically
    async checkForAppUpdate () {
      this.checkForAppUpdateRunner = true
      let res = false
      if (process.env.MODE == 'pwa') {
        res = await this.__checkPWAUpdate()
      } else {
        console.error('appUpdate.js CheckForUpdate NotImplemented for this platfomr')
      }
      this.checkForAppUpdateRunner = false
      return res
    },
    async __checkPWAUpdate () {
      if ('serviceWorker' in navigator) {
        let results = []
        let registrations = await navigator.serviceWorker.getRegistrations()
        for (let registration of registrations) {
          const res = await this.__checkPWARegistration(registration)
          results.push(res)
        }
        return results.includes(true)
      }
      return false
    },
    async __checkPWARegistration (registration) {
      return new Promise((resolve, reject) => {
        registration.onupdatefound(() => {
          // a new service worker being installed
          console.log('a new service worker being installed')
          let installingWorker = registration.installing
          // listen for state changes
          installingWorker.onstatechange((e) => {
            console.log(`service worker at installing state change to: ${e.target.state}`)
            if (e.target.state === 'installed')
              resolve(true)
          })
        })
        console.log('Call sw registration update()')
        registration.update()
        // after 5 sec we timeout
        setTimeout(() => { resolve(false) }, 1000 * 5)
      })
    },
    async doAppUpdate () {
      if (process.env.MODE == 'pwa') {
        window.location.reload(true)
      } else {
        console.error('appUpdate.js doAppUpdate NotImplemented for this platform')
      }
    }
  }
}