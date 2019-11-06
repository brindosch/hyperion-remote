<template>
  <div>
    <q-list :dark="isDarkTheme">
      <template v-for="(comp, index) in getComponents">
        <q-item :key="index">
          <q-item-section>
            {{$t('remote.comp.'+comp.name)}}
          </q-item-section>
          <q-item-section>
            <q-toggle
              :disable="comp.name != 'ALL' && !getHyperionEnable"
              :value="comp.enabled"
              @input="requestCompChange($event,comp.name)"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'HListComponents',
  data () {
    return {
    }
  },
  computed: {
    isDarkTheme () {
      return this.$store.getters['common/isDarkTheme']
    },
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
