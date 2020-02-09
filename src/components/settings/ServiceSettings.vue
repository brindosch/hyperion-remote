<template>
  <q-list>
    <q-item-label
      header
      class="header-text"
    >
      {{$t('service.title')}}
    </q-item-label>
    <q-item tag="label">
      <q-item-section>
        {{$t('service.debug')}}
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="modDebugState" />
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('service.debug_desc')}}
      </q-tooltip>
    </q-item>
    <q-item
      tag="label"
      @click="checkAppUpdate"
      v-if="showAppUpdate"
      :disable="isAppUpdateRunning"
    >
      <q-item-section>
        {{$t('service.appUpdate')}}
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('service.appUpdate_desc')}}
      </q-tooltip>
    </q-item>
    <q-item
      clickable
      @click="openDialog"
    >
      <q-item-section>
        {{$t('service.resetAppData')}}
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('service.resetAppData_desc')}}
      </q-tooltip>
    </q-item>
  </q-list>
</template>

<script>
import { dialogMixin, restartMixin } from '../mixins'
let arrayMix = [dialogMixin, restartMixin]

if (process.env.MODE == 'pwa') {
  import('components/mixins/appUpdate')
    .then((comp) => {
      arrayMix.push(comp.default)
    })
}

export default {
  name: 'ServiceSettings',
  mixins: arrayMix,
  data () {
    return {}
  },
  computed: {
    modDebugState: {
      get () { return this.$store.getters['common/getDebugState'] },
      set (val) { this.$store.commit('common/setDebugState', val) }
    },
    showAppUpdate () {
      return process.env.MODE == 'pwa'
    }
  },
  methods: {
    async openDialog () {
      const res = await this.openConfirmDialog({ title: this.$t('service.resetAppData'), msg: this.$t('service.resetAppData_desc') })
      if (res) {
        window && window.localStorage && window.localStorage.clear()
        this.restartApp()
      }
    },
    async checkAppUpdate () {
      this.checkForAppUpdateAndAsk()
    }
  }
}
</script>
