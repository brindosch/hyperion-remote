<template>
  <q-list :bordered="!$q.dark.isActive">
    <q-item-section>
      {{$t('remote.plugins.subTitle')}}
    </q-item-section>
    <q-item
      v-for="[key, value] of getPlugins"
      :key="key"
    >
      <q-item-section>
        {{value.name}}
      </q-item-section>
      <q-item-section side>
        <q-toggle
          :value="value.running"
          @change="setPluginEnable(key,$event)"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'HPluginsList',
  data () {
    return {
    }
  },
  computed: {
    getPlugins () { return Object.entries(this.$store.getters['api/getPlugins']) }
  },
  methods: {
    setPluginEnable (id, val) { this.$socket.setPluginState(id, val) }
  }
}
</script>
