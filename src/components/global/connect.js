
export default {
  name: 'connect',
  data () {
    return {
      disconnectTimerId: null
    }
  },
  methods: {
    coStopDisconnect () {
      if (this.disconnectTimerId) {
        clearTimeout(this.disconnectTimerId)
        this.disconnectTimerId = null
      }
    },
    coHandleReconnect () {
      if (!this.$store.getters['temp/isConnected'] && this.$store.getters['connection/getLastAddress']) {
        this.$socket.connect()
      }
    },
    coHandleDisconnect () {
      const autoDisconnect = this.$store.getters['connection/getAutoDisconnect']
      const prevDisconnect = this.$store.getters['temp/getPreventAutoDisconnect']
      // reset timer if possible and start new one if time is > 0 AND we are currently connected
      if (!prevDisconnect && autoDisconnect) {
        this.coStopDisconnect()
        // 10 seconds delay before disconnect
        this.disconnectTimerId = setTimeout(this.disconnect, 10 * 1000)
      }
    },
    disconnect (context) {
      this.$socket.disconnect()
    }
  }
}
