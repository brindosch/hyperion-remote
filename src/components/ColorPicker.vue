<template>

  <div
    class="row"
    ref="page"
  >
    <div class="col-xs-12 col-md-6 q-pa-md">
      <q-resize-observer @resize="onResize" />
      <div class="relative-position">
        <q-btn
          round
          unelevated
          @click="requestClear"
          class="absolute-top-right"
          :color="$store.getters['common/getThemeColor']"
        >
          <q-icon name="clear" />
        </q-btn>
        <div class="flex flex-center">
          <div ref="m_colorpicker"></div>
        </div>
      </div>
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
        <q-item>
          <q-item-section>
            <favourite-colors :showEdit="true" />
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
  </div>

</template>

<style>
</style>

<script>
import iro from '@jaames/iro'
import FavouriteColors from './FavouriteColors'
import { throttle } from '../utils'

export default {
  name: 'ColorPicker',
  components: { 'favourite-colors': FavouriteColors },
  data () {
    return {
      colorPicker: null,
      currWidth: 0,
      currEffect: '',
      currColor: this.$store.getters['common/getColor']
    }
  },
  created () {
    this.setBrightness = throttle(this.setBrightness, 100)
  },
  beforeDestroy () {
    this.setColor(this.currColor)
  },
  computed: {
    isDarkTheme () {
      return this.$store.getters['common/isDarkTheme']
    },
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
    requestClear () {
      this.$socket.setClear()
      this.currEffect = ''
    },
    setBrightness (val) {
      this.$socket.setAdjustment(undefined, 'brightness', val)
    },
    setColor (val) {
      this.$store.commit('common/setColor', val)
    },
    onResize (size) {
      if (size.width > 400) {
        size.width = 400
      }
      let newWidth = size.width - 32
      if (this.colorPicker === null) {
        // https://rakujira.jp/projects/iro/docs/guide.html#Getting-Started
        this.colorPicker = new iro.ColorPicker(this.$refs.m_colorpicker, {
          width: newWidth,
          color: this.currColor,
          padding: 2,
          display: 'relative',
          sliderMargin: 14,
          sliderHeight: 36
        })
        // throttle the change events, fires also the last trigger
        this.colorPicker.on('input:change', throttle((color) => {
          this.$socket.setColor([color.rgb.r, color.rgb.g, color.rgb.b])
          this.currColor = color.rgb
        }, 100)
        )
      } else if (this.currWidth !== newWidth) {
        this.currWidth = newWidth
        this.colorPicker.resize(newWidth, 0)
      }
    }
  }
}
</script>
