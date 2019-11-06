<template>
  <div
    class="flex flex-center"
    ref="page"
  >
    <q-resize-observer @resize="onResize" />
    <div style="position:relative">
      <q-btn
        round
        unelevated
        @click="requestClear"
        style="position:absolute;right:10px"
        :color="$store.getters['common/getThemeColor']"
      >
        <q-icon name="clear" />
      </q-btn>
      <div ref="m_colorpicker"></div>
      <q-list :dark="isDarkTheme">
        <q-item>
          <q-item-section side>
            <q-icon name="brightness_low" />
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model="modBrightness"
              :min="0"
              :max="100"
              :dark="isDarkTheme"
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
            <q-select
              :hint="$t('remote.effects.help')"
              :label="$t('remote.effects.title')"
              bottom-slots
              :dark="isDarkTheme"
              :options-dark="isDarkTheme"
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
import { throttle } from '../utils'

export default {
  name: 'ColorPicker',
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
      if (this.currWidth !== size.width && (size.width < 500 || this.colorPicker === null)) {
        if (this.colorPicker !== null) {
          if (this.colorPicker.el.firstChild) { this.colorPicker.el.removeChild(this.colorPicker.el.firstChild) }
        }
        if (this.colorPicker === null && size.width > 500) {
          size.width = 500
        }
        this.currWidth = size.width
        // https://rakujira.jp/projects/iro/docs/guide.html#Getting-Started
        this.colorPicker = new iro.ColorPicker(this.$refs.m_colorpicker, {
          width: size.width,
          color: this.currColor,
          padding: 2,
          display: 'relative',
          sliderMargin: 14,
          sliderHeight: 36
        })
        // throttle the change events, fires also the last trigger
        this.colorPicker.on('input:change', throttle((color) => {
          this.$socket.setColor(color.rgb)
          this.currColor = color.rgb
        }, 100)
        )
      }
    }
  }
}
</script>
