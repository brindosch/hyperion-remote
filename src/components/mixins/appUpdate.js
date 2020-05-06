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
      return process.env.MODE === 'pwa'
    }
  },
  methods: {
    // Check for update and ask the user if he want's to download & apply it now
    // PWA: Installs automatically, but a page reload is required
    async checkForAppUpdateAndAsk () {
      const res = await this.checkForAppUpdate()
      console.log('Result from checkForAppUpdate', res)
      if (res) {
        const diares = this.openConfirmDialog({ title: this.$t('app.updateAvail'), msg: this.$t('app.updateAvailMsg') })
        if (diares) {
          console.log('init do app update', res)
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
      if (process.env.MODE === 'pwa') {
        res = await this.__checkPWAUpdate()
      } else {
        console.error('appUpdate.js CheckForUpdate NotImplemented for this platfomr')
      }
      this.checkForAppUpdateRunner = false
      return res
    },
    async __checkPWAUpdate () {
      if ('serviceWorker' in navigator) {
        const results = []
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          const res = await this.__checkPWARegistration(registration)
          results.push(res)
        }
        return results.includes(true)
      }
      return false
    },
    async __checkPWARegistration (registration) {
      return new Promise((resolve, reject) => {
        // check if there is a pending registration that waits to take over
        if (registration.waiting) { resolve(true) }
        console.log('REG', registration)
        // prepare for update check
        registration.addEventListener('updatefound', () => {
          // a new service worker being installed
          console.log('a new service worker being installed')
          const installingWorker = registration.installing
          // listen for state changes
          console.log('Service worker installing', installingWorker)
          installingWorker.onstatechange((e) => {
            console.log(`service worker at installing state change to: ${e.target.state}`)
            if (e.target.state === 'installed') { resolve(true) }
          })
        })
        // trigger update
        console.log('Check for service worker update')
        registration.update()
        // after 5 sec we timeout
        setTimeout(() => { resolve(false) }, 1000 * 5)
      })
    },
    async doAppUpdate () {
      if (process.env.MODE === 'pwa') {
        window.location.reload(true)
      } else {
        console.error('appUpdate.js doAppUpdate NotImplemented for this platform')
      }
    }
  }
}
