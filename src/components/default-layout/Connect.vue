<template>
  <q-dialog
    persistent
    v-model="showConnectDialog"
    padding
    class="flex flex-center"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">{{$t('label.connect')}}</div>
      </q-card-section>
      <q-card-section class="q-dialog__message">
        {{$t('conn.label')}}
      </q-card-section>
      <q-card-section>
        <q-input
          :autofocus="$q.platform.is.desktop"
          v-model="address"
          spellcheck="false"
          :label="$t('conn.webserverAdr')"
          stack-label
          :placeholder="isPageHTTPS ? '192.168.0.20:8092' : '192.168.0.20:8090'"
          :hint="isPageHTTPS ? $t('conn.usehttps',{ port: '8092' }) :''"
          @keyup.enter="connect"
        >
          <template v-slot:prepend>
            <q-icon name="wifi" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section v-if="getStoredConnections.length">
        <div class="text-center">
          <q-list>
            <q-expansion-item
              :label="$t('conn.storedConnections')"
              header-class="q-dialog__message"
            >
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
                    flat
                    color="primary"
                    @click="connect(index+1)"
                    :label="$t('label.connect')"
                    :loading="getConnectionState"
                  />
                  <q-btn
                    flat
                    color="primary"
                    @click="deleteEntry(index+1)"
                    icon="fas fa-trash-alt"
                  />
                </q-btn-group>
              </div>
            </q-expansion-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          :disable="address.length == 0"
          flat
          color="primary"
          @click.stop.prevent="connect"
          :label="$t('label.connect')"
          :loading="getConnectionState"
        />
        <q-btn
          v-if="$q.platform.is.cordova || $q.platform.is.electron"
          flat
          color="primary"
          @click="searchSSDP"
          :loading="isSSDPSearching"
        >
          <q-icon name="search" />
        </q-btn>
      </q-card-actions>
    </q-card>
    <!--<img src="statics/footer_bg.png" style="position:fixed;bottom:0px"> -->
  </q-dialog>
</template>

<style>
</style>

<script>
import { notify } from 'src/utils'
import { ssdpMixin, dialogMixin } from '../mixins'

export default {
  name: 'ConnectDialog',
  mixins: [ssdpMixin, dialogMixin],
  data () {
    return {
      showConnectDialog: false,
      address: this.$store.getters['connection/getLastAddress']
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
    if (this.address) {
      this.connect()
    } else if ((this.$q.platform.is.cordova || window.electron) && this.address === '') {
      // do a ssdp search for server if we don't have an address
      this.showConnectDialog = true
      this.searchSSDP()
    } else {
      this.showConnectDialog = true
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
    },
    getConnectState () { return this.$store.getters['temp/getConnectState'] }
  },
  watch: {
    getConnectState (newVal, oldVal) {
      if (!this.$store.getters['temp/isEmbed']) { this.showConnectDialog = (newVal === 'DISCONNECTED' || newVal === 'CONNECTING') }
    },
    '$store.state.temp.openConnectDialog' (val) {
      if (val && !this.$store.getters['temp/isEmbed']) {
        this.showConnectDialog = true
      }
    }
  },
  methods: {
    connect (index) {
      if (!this.address) { return }

      if (typeof (index) === 'object') {
        this.$socket.connect(this.address)
      } else if (typeof (index) === 'string') {
        this.$socket.connect(index)
      } else {
        this.$socket.connect(this.address)
      }
    },
    async searchSSDP () {
      const ssdpList = await this.searchHyperionServer().catch((error) => {
        notify.error(this.$t('conn.ssdpError', [error]), 'wifi')
      })

      // might be undefined on error
      if (!ssdpList) { return }

      if (ssdpList.length === 0) {
        notify.error(this.$t('conn.ssdpNoResults'), 'wifi')
        return
      }
      const data = await this.openSelectionDialog({
        title: this.$t('conn.ssdpDialogTitle'),
        msg: this.$t('conn.ssdpDialogText'),
        type: 'radio',
        model: ssdpList[0].value,
        items: ssdpList
      })

      if (data) {
        this.address = data
        this.connect()
      }
    },
    deleteEntry (index) { this.$store.commit('connection/deleteStoredConnection', index) },
    openDialog () {
      this.showConnectDialog = true
    }
  }
}
</script>
