<template>
  <q-btn
    v-if="getAvailableInstances.length > 1"
    flat
    round
    dense
    icon="compare_arrows"
  >
    <q-menu>
      <q-list>
        <template v-for="(val,index) in getAvailableInstances">
          <q-item
            :key="index"
            :clickable="getActiveInstance.instance != val.instance && val.running"
          >
            <q-item-section side>
              <q-radio
                @click.native="val.running && handleInstanceSwitch(val.instance)"
                :value="getActiveInstance.instance == val.instance"
                :val="true"
                :disable="!val.running"
              />
            </q-item-section>
            <q-item-section
              style="white-space: nowrap"
              @click="val.running && handleInstanceSwitch(val.instance)"
            >
              <q-item-label>{{val.friendly_name}}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-toggle
                v-if="val.instance > 0"
                :value="val.running"
                @input="handleInstanceState(!val.running, val.instance)"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  name: 'BtnInstanceControl',
  data () {
    return {
    }
  },
  computed: {
    isDarkTheme () { return this.$store.getters['common/isDarkTheme'] },
    getActiveInstance () { return this.$store.getters['api/getActiveInstanceData'] },
    getAvailableInstances () {
      return this.$store.getters['api/getInstances']
    }
  },
  methods: {
    handleInstanceSwitch (val) { this.$socket.setInstance(val) },
    handleInstanceState (newState, inst) { this.$socket.setInstanceState(newState, inst) }
  }
}
</script>
