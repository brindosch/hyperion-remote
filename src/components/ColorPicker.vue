<template>

  <div
    class="row"
    ref="page"
  >
    <div class="col-xs-12 col-md-6 q-pa-md">
      <color-picker></color-picker>
    </div>
    <div class="col-xs-12 col-md-6 q-pt-sm">
      <q-list>
        <q-item>
          <q-item-section side>
            <q-icon name="brightness_low" />
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model="modBrightness"
              :min="0"
              :max="100"
              label
              :label-value="modBrightness + '%'"
            />
          </q-item-section>
          <q-item-section side>
            <q-icon name="brightness_high" />
          </q-item-section>
        </q-item>
        <q-item v-show="$store.getters['common/getFavColors'].length > 0">
          <q-item-section>
            <favourite-colors />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              :hint="$t('remote.effects.help')"
              :label="$t('remote.effects.title')"
              bottom-slots
              :options="getEffects"
              v-model="currEffect"
              emit-value
              map-options
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <drop-zone></drop-zone>
  </div>

</template>

<style>
</style>

<script>
import FavouriteColors from './FavouriteColors'
import { throttle } from 'src/utils'
import { DropZone } from 'components/utils'
import { ColorPicker } from 'components/control'

export default {
  name: 'ColorPicker',
  components: {
    'color-picker': ColorPicker,
    'favourite-colors': FavouriteColors,
    'drop-zone': DropZone
  },
  data () {
    return {
      currEffect: ''
    }
  },
  created () {
    this.setBrightness = throttle(this.setBrightness, 100)
  },
  computed: {
    modBrightness: {
      get () { return this.$store.getters['api/getBrightness'] },
      set (val) { this.$store.commit('api/setBrightness', val); this.setBrightness(val) }
    },
    getEffects () {
      let arr = [{ label: '-', value: '' }]
      return arr.concat(this.$store.getters['api/getSelectPreparedEffectsFiltered'])
    }
  },
  watch: {
    currEffect (val, oldVal) { if (val !== '') this.$socket.setEffect(val) }
  },
  methods: {
    setBrightness (val) {
      this.$socket.setAdjustment(undefined, 'brightness', val)
    }
  }
}
</script>
