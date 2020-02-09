<template>
  <q-list>
    <template v-for="comp in getComponents">
      <q-item
        :key="comp.name"
        tag="label"
      >
        <q-item-section>
          {{$t('remote.comp.'+comp.name)}}
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :disable="comp.name != 'ALL' && !getHyperionEnable"
            :value="comp.enabled"
            @input="requestCompChange($event,comp.name)"
          />
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<style>
</style>

<script>
export default {
  name: 'ComponentsList',
  data () {
    return {
    }
  },
  computed: {
    getComponents () {
      return this.$store.getters['api/getComponents']
    },
    getHyperionEnable () {
      return this.$store.getters['api/getHyperionEnable']
    }
  },
  methods: {
    requestCompChange (value, name) {
      this.$socket.setCompState(name, value)
    }
  }

}
</script>
