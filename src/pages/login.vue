<template>
  <q-page
    padding
    class="flex flex-center"
  >
    <div
      class="text-center"
      style="padding:20px; backdrop-filter: blur(10px);"
    >
      <img src="statics/hyperion-logo-white.png" />
      <div style="margin-top:20px;">
        <q-input
          v-model="username"
          dark
          type="text"
          name="username"
          spellcheck="false"
          color="white"
          label="Username"
          stack-label
          style="display:none"
        />
        <q-input
          :autofocus="$q.platform.is.desktop"
          v-model="password"
          dark
          :type="isPwd ? 'password' : 'text'"
          spellcheck="false"
          color="white"
          :label="getAdminAppMode ? $t('login.password') : $t('login.token')"
          stack-label
          :hint="getAdminAppMode ? $t('login.passwordHint') : $t('login.tokenHint')"
          hide-hint
          @keyup.enter="login"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn
          :disable="!isInputValid()"
          outline
          color="white"
          dark
          style="margin-top:25px"
          @click="login"
          :label="$t('btn.login')"
        />
        <q-btn
          v-if="!getAdminAppMode"
          :label="$t('btn.createToken')"
          outline
          color="white"
          dark
          style="margin-top:25px; margin-left:5px;"
          @click="createToken"
        >
        </q-btn>
        <br>
        <q-btn
          v-if="!$store.getters['temp/isEmbed']"
          :label="$t('btn.disconnect')"
          outline
          color="white"
          dark
          style="margin-top:25px"
          @click="$socket.disconnect()"
        >
        </q-btn>
      </div>
      <q-toggle
        v-if="!$store.getters['temp/isEmbed']"
        class="text-white q-pa-md"
        v-model="modAdminMode"
        color="red"
        :label="'(WIP) '+$t('login.adminmode')"
        left-label
      />
    </div>
    <q-dialog
      no-esc-dismiss
      no-backdrop-dismiss
      v-model="showTokenDialog"
      dark
    >
      <q-card
        class="text-white"
        style="background: linear-gradient(rgb(32, 107, 173) 0%,  rgb(0, 150, 175) 100%)"
      >
        <q-card-section>
          <div class="text-h6">{{$t('btn.createToken')}}</div>
        </q-card-section>
        <q-card-section style="color:rgba(255,255,255,0.9)">
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
            dark
            outline
            color="white"
            :label="$t('btn.openWui')"
            @click="openHyperionWebUi"
          />
          <q-btn
            dark
            outline
            color="white"
            :label="$q.lang.label.cancel"
            @click="createTokenAbort"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<style>
</style>

<script>
import { notify, EventBus } from '../utils'
import { openURL, uid } from 'quasar'

export default {
  name: 'PageLogin',
  data () {
    return {
      isPwd: true,
      requestTimerCount: 1.0,
      requestTimer: null,
      tokenId: '',
      tokenComment: '',
      showTokenDialog: false,
      password: '',
      username: 'Hyperion'
    }
  },
  props: {
    autoLogin: {
      type: Boolean,
      default: true
    },
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
    // in case we got no response while requesting a token reset autoDisconnect or we navigate away
    this.$store.commit('temp/setPreventAutoDisconnect', false)
    // stop pending timers
    this.createTokenAbort()
  },
  mounted () {
    this.$store.commit('temp/setPreventAutoDisconnect', true)

    // should we login as admin
    if (this.asAdmin) { this.$store.commit('common/setAdminAppMode', this.asAdmin) }

    // auto login
    // to prevent re-login on user requested logout, autoLogin is overwritten by router props
    if (this.autoLogin && this.$store.getters['connection/getAutoLogin']) {
      this.getLoginCred(true)
    } else {
      // get login data without login
      this.getLoginCred()
    }
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
      set (val) { this.$store.commit('common/setAdminAppMode', val); this.getLoginCred() }
    }
  },
  methods: {
    login (index) {
      if (!this.isInputValid()) { return }

      const admin = this.$store.getters['common/getAdminAppMode']

      if (typeof (index) === 'object') {
        admin ? this.$socket.login(this.password) : this.$socket.loginToken(this.password)
      } else if (typeof (index) === 'string') {
        admin ? this.$socket.login(index) : this.$socket.loginToken(index)
      } else {
        console.error('login page unhandled')
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
    openHyperionWebUi () {
      let address = this.$store.getters['connection/getLastAddress']
      try {
        // eslint-disable-next-line no-new
        new URL(address)
      } catch (error) {
        address = 'http://' + address
      }
      openURL(address)
    }
  }
}
</script>
