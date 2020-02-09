<template>
  <div>
    <q-banner
      class="text-white"
      :class="barColor"
      v-if="showBar"
    >
      {{getStatusText}}
      <template v-slot:action>
        <q-btn
          flat
          color="white"
          :label="$t('label.connect')"
          v-if="!$store.getters['temp/isConnected']"
          @click="$refs.connectDialog.connect()"
        />
        <q-btn
          flat
          color="white"
          :label="$t('label.login')"
          v-if="!$store.getters['api/getLoginState'] && $store.getters['temp/isConnected']"
          @click="$refs.loginDialog.openDialog()"
        />
      </template>
    </q-banner>
    <connect-dialog ref="connectDialog"></connect-dialog>
    <login-dialog ref="loginDialog"></login-dialog>
  </div>

</template>

<script>
import ConnectDialog from './Connect'
import LoginDialog from './Login'

export default {
  name: 'StatusBar',
  components: {
    'connect-dialog': ConnectDialog,
    'login-dialog': LoginDialog
  },
  data () {
    return {
      barColor: 'bg-positive',
      showBar: true,
    }
  },
  watch: {
    getStatusText (oldVal, newVal) { }
  },
  computed: {
    getStatusText () {
      if (!this.$store.getters['temp/isConnected']) {
        this.barColor = 'bg-red'
        this.showBar = true
        return this.$t('conn.notconnected')
      }
      else if (this.$store.getters['temp/getConnectingState']) {
        this.barColor = 'bg-positive'
        this.showBar = true
        return this.$t('conn.connecting')
      }
      else if (!this.$store.getters['api/getLoginState']) {
        this.barColor = 'bg-red'
        this.showBar = true
        return this.$t('login.required')
      } else {
        this.showBar = false
      }
    }
  }
}
</script>

<style>
</style>