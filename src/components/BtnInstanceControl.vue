<template>
  <q-btn
    v-if="getAvailableInstances.length > 1"
    flat
    round
    dense
    icon="compare_arrows"
  >
    <q-menu>
      <q-list
        :dark="isDarkTheme"
        :class="{'bg-matmenu':isDarkTheme}"
      >
        <template v-for="(val,index) in getAvailableInstances">
          <q-item
            :dark="isDarkTheme"
            :key="index"
            :clickable="getActiveInstance.instance != val.instance && val.running"
          >
            <q-item-section
              @click="handleInstanceSwitch(val.instance)"
              side
            >
              <q-radio
                :dark="isDarkTheme"
                :value="getActiveInstance.instance == val.instance"
                :val="true"
              />
            </q-item-section>
            <q-item-section
              @click="handleInstanceSwitch(val.instance)"
              style="white-space: nowrap"
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
      // .filter(entry => entry.running) }
    }
  },
  methods: {
    handleInstanceSwitch (val) { this.$socket.setInstance(val) },
    handleInstanceState (newState, inst) { this.$socket.setInstanceState(newState, inst) }
  }
}
</script>
