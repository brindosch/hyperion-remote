<template>
  <div>
    <q-dialog
      persistent
      v-model="showLoginDialog"
      padding
      class="flex flex-center"
      @before-hide="stopActions"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('label.login')}}</div>
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{getAdminAppMode ? $t('login.passwordHint') : $t('login.tokenHint')}}
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="username"
            type="text"
            name="username"
            spellcheck="false"
            label="Username"
            stack-label
            style="display:none"
          />
          <q-input
            :autofocus="$q.platform.is.desktop"
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            spellcheck="false"
            :label="getAdminAppMode ? $t('login.password') : $t('login.token')"
            stack-label
            @keyup.enter="login"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click.stop.prevent="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :disable="!isInputValid()"
            color="primary"
            flat
            @click="login"
            :label="$t('label.login')"
          />
          <q-btn
            v-if="!getAdminAppMode"
            :label="$t('btn.createToken')"
            color="primary"
            flat
            @click="createToken"
          >
          </q-btn>
          <q-toggle
            v-if="!$store.getters['temp/isEmbed']"
            class="q-pa-md"
            v-model="modAdminMode"
            color="red"
            :label="'(WIP) '+$t('login.adminmode')"
            left-label
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      no-esc-dismiss
      no-backdrop-dismiss
      v-model="showTokenDialog"
      @before-hide="stopActions"
    >
      <q-card
        class="text-white"
        style="background: linear-gradient(rgb(32, 107, 173) 0%,  rgb(0, 150, 175) 100%)"
      >
        <q-card-section>
          <div class="text-h6">{{$t('btn.createToken')}}</div>
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{$t('login.tokWizMsg')}}.<br />
          {{$t('login.tokWizMsg2')}}
          <br /><br />
          {{$t('login.app')}}: <strong>{{tokenComment}}</strong>
          <br />
          {{$t('login.code')}}: <strong>{{tokenId}}</strong>
          <br /><br />
          <q-linear-progress
            :dark="false"
            stripe
            style="height: 10px"
            :value="requestTimerCount"
            color="warning"
            class="q-mt-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            flat
            :label="$t('btn.openWui')"
            @click="openHyperionWebUi"
          />
          <q-btn
            color="primary"
            flat
            :label="$q.lang.label.cancel"
            @click="createTokenAbort"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
</style>

<script>
import { notify, EventBus } from 'src/utils'
import { uid } from 'quasar'
import { openUrlMixin } from '../mixins'

export default {
  name: 'LoginDialog',
  mixins: [openUrlMixin],
  data () {
    return {
      showLoginDialog: false,
      isPwd: true,
      requestTimerCount: 1.0,
      requestTimer: null,
      tokenId: '',
      tokenComment: '',
      showTokenDialog: false,
      password: '',
      username: 'Hyperion',
      userRequested: false
    }
  },
  props: {
    asAdmin: {
      type: Boolean,
      default: false
    }
  },
  created () {
    EventBus.$on('authorize-requestToken', this.handleRequestTokenResponse)
  },
  beforeDestroy () {
    EventBus.$off('authorize-requestToken', this.handleRequestTokenResponse)
    this.stopActions()
  },
  mounted () {
    // should we login as admin
    if (this.asAdmin) { this.$store.commit('common/setAdminAppMode', this.asAdmin) }
  },
  computed: {
    getAuthState () {
      return this.$store.getters['temp/getConnectingState']
    },
    getAdminAppMode () {
      return this.$store.getters['common/getAdminAppMode']
    },
    modAdminMode: {
      get () { return this.$store.getters['common/getAdminAppMode'] },
      set (val) {
        this.$store.commit('common/setAdminAppMode', val)
        this.getLoginCred()
        this.$socket.logout()
        if (!val && this.$route.path.includes('settings'))
          this.$router.push('/').catch(() => { })
      }
    },
    loginRequired () { return this.$store.getters['temp/isConnected'] && !this.$store.getters['api/getLoginState'] && this.$store.getters['api/getLoginReady'] }
  },
  watch: {
    loginRequired (newVal, oldVal) {
      if (newVal) {
        this.showLoginDialog = true
        this.getLoginCred(!this.userRequested)
        this.userRequested = false
      } else {
        this.showLoginDialog = false
      }
    },
    '$store.state.temp.openLoginDialog' (val) {
      if (val) {
        this.userRequested = true
        this.$socket.logout()
      }
    }
  },
  methods: {
    async login (index) {
      if (!this.isInputValid()) { return }

      const admin = this.$store.getters['common/getAdminAppMode']
      let data

      if (typeof (index) === 'string')
        this.password = index

      if (admin) {
        data = await this.$socket.login(this.password)
      } else {
        data = await this.$socket.loginToken(this.password)
      }
      if (data.success) {
        // update password or token. Be aware, login with password returns a session token
        const type = admin ? 'password' : 'token'
        this.$store.dispatch('connection/setLastPassword', { pw: this.password, type: type }).catch(e => console.error(e.message))
        this.$store.commit('api/setLoginState', true)
        this.$socket.startApiInit(true)
      } else {
        // error during auth or api error. We do not know which one.
        if (admin) {
          this.$store.commit('connection/resetLastPassword')
        } else {
          this.$store.commit('connection/resetLastToken')
        }
        this.$q.notify({ message: this.$t('login.failed'), icon: 'fas fa-sign-in-alt', color: 'red' })
      }
    },
    isInputValid () {
      const admin = this.$store.getters['common/getAdminAppMode']

      if (admin) {
        if (this.password.length < 8) {
          return false
        }
      } else {
        if (this.password.length !== 36) {
          return false
        }
      }
      return true
    },
    getLoginCred (login) {
      let type = this.getAdminAppMode ? 'password' : 'token'
      this.$store.dispatch('connection/getLastPassword', { type: type }).then((pw) => { this.password = pw; if (login) this.login(pw) })
    },
    createToken () {
      this.$store.commit('temp/setPreventAutoDisconnect', true)
      let uuid = uid()
      this.tokenId = uuid.slice(uuid.length - 5)
      this.tokenComment = this.$store.getters['common/getOriginName']
      this.$socket.requestToken(this.tokenComment, this.tokenId)
      this.showTokenDialog = true
      this.requestTimer = setInterval(() => { this.requestTimerCount -= (1 / 180) }, 1000)
    },
    createTokenAbort () {
      this.showTokenDialog = false
      clearTimeout(this.requestTimer)
      this.requestTimerCount = 1.0
      if (this.tokenId !== '') { this.$socket.cancelRequestToken(this.tokenComment, this.tokenId) }
      this.tokenId = ''
    },
    handleRequestTokenResponse (data) {
      this.createTokenAbort()
      if (data.success) {
        this.password = data.info.token
        this.login(data.info.token)
        notify.success(this.$t('login.tokCreaSucc'))
      } else {
        notify.error(this.$t('login.tokCreaFail'))
      }
    },
    stopActions () {
      // in case we got no response while requesting a token reset autoDisconnect or we navigate away
      this.$store.commit('temp/setPreventAutoDisconnect', false)
      // stop pending timers
      this.createTokenAbort()
    },
    openHyperionWebUi () {
      let address = this.$store.getters['connection/getLastAddress']
      try {
        // eslint-disable-next-line no-new
        new URL(address)
      } catch (error) {
        address = 'http://' + address
      }
      this.openURL(address)
    },
    openDialog () {
      this.userRequested = true
      this.showLoginDialog = true
    }
  }
}
</script>