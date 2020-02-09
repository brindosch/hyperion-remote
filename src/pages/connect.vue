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
      <div v-if="$store.getters['temp/isEmbed']">
        <q-btn
          :label="$t('label.connect')"
          outline
          color="white"
          dark
          @click="connect"
          style="margin-top:20px;"
          :loading="getConnectionState"
        ></q-btn>
      </div>
      <div
        style="margin-top:20px;"
        v-if="!$store.getters['temp/isEmbed']"
      >
        <q-input
          :autofocus="$q.platform.is.desktop"
          v-model="address"
          dark
          spellcheck="false"
          color="white"
          :label="$t('conn.webserverAdr')"
          stack-label
          :placeholder="isPageHTTPS ? '192.168.0.20:8092' : '192.168.0.20:8090'"
          :hint="isPageHTTPS ? $t('conn.usehttps',{ port: '8092' }) :''"
          hide-hint
          @keyup.enter="connect"
        >
          <template v-slot:prepend>
            <q-icon name="wifi" />
          </template>
        </q-input>
        <q-btn
          :disable="address.length == 0"
          outline
          color="white"
          dark
          style="margin-top:25px"
          @click="connect"
          :label="$t('label.connect')"
          :loading="getConnectionState"
        />
        <q-btn
          v-if="$q.platform.is.cordova || $q.platform.is.electron"
          outline
          color="white"
          dark
          style="margin-top:25px; margin-left:5px"
          @click="searchSSDP"
          :loading="isSSDPSearching"
        >
          <q-icon name="search" />
        </q-btn>
      </div>
      <div
        class="text-white text-center"
        v-if="getStoredConnections.length && !$store.getters['temp/isEmbed']"
        style="padding-top:15px"
      >
        <q-list dark>
          <q-expansion-item :label="$t('conn.storedConnections')">
            <div
              v-for="(entry, index) in getStoredConnections"
              :key="index"
              style="border-top:1px #fff6 solid; padding:10px"
            >
              <div>
                {{entry.address}}
              </div>
              <q-btn-group
                flat
                style="margin-top:5px"
              >
                <q-btn
                  outline
                  @click="connect(index+1)"
                  :label="$t('label.connect')"
                  :loading="getConnectionState"
                />
                <q-btn
                  outline
                  @click="deleteEntry(index+1)"
                  icon="fas fa-trash-alt"
                />
              </q-btn-group>
            </div>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
    <!--<img src="statics/footer_bg.png" style="position:fixed;bottom:0px"> -->
  </q-page>
</template>

<style>
</style>

<script>
import { notify } from '../utils'
import { ssdpMixin } from 'components/mixins'

export default {
  name: 'PageConnect',
  mixins: [ssdpMixin],
  data () {
    return {
      address: this.$store.getters['connection/getLastAddress']
    }
  },
  props: {
    autoConnect: {
      type: Boolean,
      default: true
    }
  },
  created () {
    if (process.env.EMBED) {
      const loc = document.location
      const port = loc.port === '' ? (loc.protocol === 'https:' ? '433' : '80') : loc.port
      this.address = `${loc.protocol}//${loc.hostname}:${port}`
    }
  },
  mounted () {
    // auto connection on startup
    // to prevent reconnect on user requested disconnect(); autoConnect is overwritten by router props
    if (this.autoConnect && this.address !== '') {
      this.connect()
    } else if ((this.$q.platform.is.cordova || window.electron) && this.address === '') {
      // do a ssdp search for server if we don't have an address
      this.searchSSDP()
    }
  },
  computed: {
    getConnectionState () {
      return this.$store.getters['temp/getConnectingState']
    },
    getStoredConnections () {
      // filtered, remove first entry
      return this.$store.getters['connection/getStoredConnections'].filter((entry, index) => index > 0)
    },
    isPageHTTPS () {
      return document.location.protocol === 'https:'
    }
  },
  methods: {
    connect (index) {
      if (this.address === '') { return }

      if (typeof (index) === 'object') {
        this.$socket.connect(this.address)
      } else if (typeof (index) === 'string') {
        this.$socket.connect(index)
      } else {
        this.$socket.connect(this.address)
      }
    },
    async searchSSDP () {
      let ssdpList = undefined
      ssdpList = await this.searchHyperionServer().catch((error) => {
        notify.error(this.$t('conn.ssdpError', [error]), 'wifi')
      })

      // might be undefined on error
      if (ssdpList)
        this.showSSDPDialog(ssdpList)
    },
    showSSDPDialog (ssdpList) {
      if (ssdpList.length === 0) {
        notify.error(this.$t('conn.ssdpNoResults'), 'wifi')
        return
      }
      this.$q.dialog({
        title: this.$t('conn.ssdpDialogTitle'),
        message: this.$t('conn.ssdpDialogText'),
        ok: { outline: true },
        class: 'text-white',
        style: { background: 'linear-gradient(rgb(32, 107, 173) 0%,  rgb(0, 150, 175) 100%)' },
        options: {
          type: 'radio',
          model: ssdpList[0].value,
          items: ssdpList
        },
        cancel: { outline: true },
        'no-esc-dismiss': true,
        'no-backdrop-dismiss': true,
        color: 'white'
      }).onOk(data => {
        this.connect(data)
      })
    },
    deleteEntry (index) { this.$store.commit('connection/deleteStoredConnection', index) }
  }
}
</script>
