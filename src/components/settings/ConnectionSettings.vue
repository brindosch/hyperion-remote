<template>
  <q-list>
    <q-item-label
      header
      class="header-text"
    >
      {{$t('conn.settingsListLabel')}}
    </q-item-label>
    <q-item tag="label">
      <q-item-section>
        <q-item-label>
          {{$t('conn.autoDisconnect')}}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="modAutoDisconnect" />
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('conn.autoDisconnect_desc')}}
      </q-tooltip>
    </q-item>
  </q-list>
</template>
<script>
export default {
  name: 'ConnectionSettings',
  data () {
    return {}
  },
  computed: {
    modAutoDisconnect: {
      get () { return this.$store.getters['connection/getAutoDisconnect'] },
      set (val) { this.$store.commit('connection/setAutoDisconnect', val) }
    }
  }
}
</script>
