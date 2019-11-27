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
import { dialog } from '../mixins'
export default {
  name: 'ServiceSettings',
  mixins: [dialog],
  data () {
    return {}
  },
  computed: {
    modDebugState: {
      get () { return this.$store.getters['common/getDebugState'] },
      set (val) { this.$store.commit('common/setDebugState', val) }
    }
  },
  methods: {
    openDialog () {
      this.openConfirmDialog({ title: this.$t('service.resetAppData'), msg: this.$t('service.resetAppData_desc') }).onOk(() => { window && window.localStorage && window.localStorage.clear() && window.location.reload() })
    }
  }
}
</script>
