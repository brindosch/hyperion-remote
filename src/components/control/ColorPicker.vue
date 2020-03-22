<template>
  <div class="relative-position">
    <q-resize-observer @resize="onResize" />
    <q-btn
      round
      unelevated
      @click.stop="requestClear"
      class="absolute-top-right"
      icon="clear"
    >
    </q-btn>
    <div class="flex flex-center">
      <div ref="m_colorpicker"></div>
    </div>
  </div>
</template>

<script>
import iro from '@jaames/iro'
import { throttle } from 'src/utils'

export default {
  name: 'ColorPicker',
  data () {
    return {
      colorPicker: null,
      currWidth: 0,
      currColor: this.$store.getters['common/getColor']
    }
  },
  created () {
    this.sendColor = throttle(this.sendColor, 100)
  },
  beforeDestroy () {
    this.setColor(this.currColor)
  },
  methods: {
    requestClear () {
      this.$socket.setClear()
    },
    setColor (val) {
      this.$store.commit('common/setColor', val)
    },
    sendColor (color) {
      this.$socket.setColor([color.rgb.r, color.rgb.g, color.rgb.b])
      this.currColor = color.rgb
    },
    onResize (size) {
      if (size.width > 400) {
        size.width = 400
      }
      const newWidth = size.width - 32
      if (this.colorPicker === null) {
        // https://rakujira.jp/projects/iro/docs/guide.html#Getting-Started
        this.colorPicker = new iro.ColorPicker(this.$refs.m_colorpicker, {
          width: newWidth,
          color: this.currColor,
          padding: 2,
          display: 'relative',
          sliderMargin: 14,
          sliderSize: 36
        })
        // throttle the change events, fires also the last trigger
        this.colorPicker.on('input:change', this.sendColor)
      } else if (this.currWidth !== newWidth) {
        this.currWidth = newWidth
        this.colorPicker.resize(newWidth, 0)
      }
    }
  }
}
</script>

<style>
</style>
