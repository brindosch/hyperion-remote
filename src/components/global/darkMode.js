import { getSunrise, getSunset } from 'sunrise-sunset-js'

export default {
  name: 'darkMode',
  data () {
    return {
      darkModeTimer: null
    }
  },
  watch: {
    '$store.state.common.syncSettings.dark.mode' (val) {
      clearInterval(this.darkModeTimer)
      if (['time', 'gps'].includes(val)) {
        if (val === 'gps') { this.dmCalcGPSTime() }
        this.dmUpdateDarkMode()
        this.darkModeTimer = setInterval(this.dmUpdateDarkMode, 1000 * 60)
      }
    },
    '$store.state.common.syncSettings.dark.startTime' (val) {
      if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
        this.dmUpdateDarkMode()
      }
    },
    '$store.state.common.syncSettings.dark.endTime' (val) {
      if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
        this.dmUpdateDarkMode()
      }
    },
    '$store.state.common.syncSettings.dark.lat' (val) {
      if (this.$store.getters['common/getDarkMode'] === 'gps') {
        this.dmCalcGPSTime()
      }
    },
    '$store.state.common.syncSettings.dark.long' (val) {
      if (this.$store.getters['common/getDarkMode'] === 'gps') {
        this.dmCalcGPSTime()
      }
    }
  },
  methods: {
    dmInitDarkMode () {
      // make sure Quasar dark plugin is properly set based on user setting
      this.$store.commit('common/setDarkMode', this.$store.getters['common/getDarkMode'])
      // handle darkMode switch if time/gps mode
      if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
        if (this.$store.getters['common/getDarkMode'] === 'gps')
        // recalc start and end time based on gps
        { this.dmCalcGPSTime() }
        this.dmUpdateDarkMode()
        this.darkModeTimer = setInterval(this.dmUpdateDarkMode, 1000 * 60)
      }
    },
    dmStartDarkModeTimer () {
      clearInterval(this.darkModeTimer)
      // we just start when gps/time is configured
      if (['time', 'gps'].includes(this.$store.getters['common/getDarkMode'])) {
        if (this.$store.getters['common/getDarkMode'] === 'gps') { this.dmCalcGPSTime() }
        this.dmUpdateDarkMode()
        this.darkModeTimer = setInterval(this.dmUpdateDarkMode, 1000 * 60)
      }
    },
    dmStopDarkModeTimer () {
      clearInterval(this.darkModeTimer)
    },
    dmCalcGPSTime () {
      const lat = this.$store.getters['common/getDarkLat']
      const long = this.$store.getters['common/getDarkLong']
      const eTime = getSunrise(lat, long)
      const sTime = getSunset(lat, long)
      const end = (('0' + eTime.getHours()).slice(-2)) + ':' + (('0' + eTime.getMinutes()).slice(-2))
      const start = (('0' + sTime.getHours()).slice(-2)) + ':' + (('0' + sTime.getMinutes()).slice(-2))
      this.$store.commit('common/setDarkStartTime', start)
      this.$store.commit('common/setDarkEndTime', end)
    },
    dmUpdateDarkMode () {
      // Time based switch calc
      const dateNow = new Date()
      const startTime = parseInt(this.$store.getters['common/getDarkStartTime'].replace(':', ''))
      const endTime = parseInt(this.$store.getters['common/getDarkEndTime'].replace(':', ''))
      const now = parseInt((('0' + dateNow.getHours()).slice(-2)) + (('0' + dateNow.getMinutes()).slice(-2)))

      if ((startTime < endTime) ? ((now >= startTime) && (now <= endTime)) : ((now >= startTime) || (now <= endTime))) {
        if (!this.$q.dark.isActive) { this.$store.commit('common/setDark', true) }
      } else {
        if (this.$q.dark.isActive) { this.$store.commit('common/setDark', false) }
      }
    }
  }
}
