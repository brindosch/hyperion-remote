<template>
  <div class="relative-position">
    <q-resize-observer @resize="onResize" />
    <canvas
      ref="ledCanvas"
      class="shadow-8 absolute-top-left"
      style="z-index: 3"
    ></canvas>
    <canvas
      ref="imageCanvas"
      class="shadow-8 absolute-top-left"
      style="z-index: 2"
    ></canvas>
    <div ref="flowHelper"></div>
    <q-menu context-menu>
      <q-list dense>
        <q-item
          tag="label"
          clickable
          v-close-popup
        >
          <q-item-section>
            {{$t('btn.toggleLeds')}}
          </q-item-section>
          <q-item-section side>
            <q-toggle
              @input="toggleLedsStream"
              :value="streamingLeds"
            ></q-toggle>
          </q-item-section>
        </q-item>
        <q-item
          tag="label"
          clickable
          v-close-popup
        >
          <q-item-section>
            {{$t('btn.toggleImage')}}
          </q-item-section>
          <q-item-section side>
            <q-toggle
              @input="toggleImageStream"
              :value="streamingImage"
            ></q-toggle>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script>
/// add prototype for simple canvas clear() method
CanvasRenderingContext2D.prototype.Hclear = function () {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

import { EventBus } from 'src/utils'
import { uid } from 'quasar'

export default {
  name: 'LedVisualization',
  data () {
    return {
      led2dctx: null,
      image2dctx: null,
      uuid: uid(),
      paths2d: [],
      ledsLength: 1,
      streamingLeds: true,
      streamingImage: false,
      lastLedColors: null,
      imageResetTimer: null
    }
  },
  mounted () {
    this.image2dctx = this.$refs.imageCanvas.getContext('2d')
    this.led2dctx = this.$refs.ledCanvas.getContext('2d')
    // init 2dpath creation, resize observable first shot is slower than our socket
    this.__setCanvasSize(100, 100 / (16 / 10))
    this.adjustCanvas()
    // start led stream
    this.__setLedStreamState(true)
  },
  beforeDestroy () {
    this.__setLedStreamState(false)
    this.__setImageStreamState(false)
    clearInterval(this.imageResetTimer)
    this.$store.commit('temp/setLastLedColors', this.lastLedColors)
  },
  computed: {
    getLeds () { return this.$store.getters['api/getLeds'] }
  },
  watch: {
    getLeds () {
      this.adjustCanvas()
    }
  },
  methods: {
    onResize (size) {
      // ResizeObserver triggers before mount, but we get refs after mount
      if (this.image2dctx) {
        this.__setCanvasSize(size.width, size.width / (16 / 10))
        this.adjustCanvas()
      }
    },
    adjustCanvas () {
      this.__update2dPaths()
      this.__printLedsToCanvas()
      this.__resetImage()
    },
    toggleLedsStream () {
      if (this.streamingLeds) {
        this.__setLedStreamState(false)
        this.led2dctx.Hclear()
      } else {
        this.__setLedStreamState(true)
      }
      this.streamingLeds = !this.streamingLeds
    },
    toggleImageStream () {
      if (this.streamingImage) {
        this.__setImageStreamState(false)
        this.__resetImage()
      } else {
        this.__setImageStreamState(true)
      }
      this.streamingImage = !this.streamingImage
    },
    setLedColors (data) {
      this.__printLedsToCanvas(data.result.leds)
    },
    setImage (data) {
      clearInterval(this.imageResetTimer)
      this.imageResetTimer = setTimeout(() => this.__resetImage(), 2000)
      const image = new Image()
      image.onload = () => {
        this.image2dctx.drawImage(image, 0, 0, this.image2dctx.canvas.width, this.image2dctx.canvas.height)
      }
      image.src = data.result.image
    },
    __setLedStreamState (state) {
      state ? EventBus.$on('ledcolors-ledstream-update', this.setLedColors) : EventBus.$off('ledcolors-ledstream-update', this.setLedColors)
      // this.$socket.setLedStream(state)
      this.$store.commit('temp/ledStreamRequest', { uuid: this.uuid, state })
    },
    __setImageStreamState (state) {
      state ? EventBus.$on('ledcolors-imagestream-update', this.setImage) : EventBus.$off('ledcolors-imagestream-update', this.setImage)
      // this.$socket.setImageStream(state)
      this.$store.commit('temp/imageStreamRequest', { uuid: this.uuid, state })
    },
    __update2dPaths () {
      this.paths2d = []
      const [width, height] = this.__getCanvasSize()
      const leds = this.getLeds

      this.ledsLength = leds.length
      for (const led of leds) {
        this.paths2d.push(this.__build2DPath(led.hmin * width, led.vmin * height, (led.hmax - led.hmin) * width, (led.vmax - led.vmin) * height, 5))
      }
      this.lastLedColors = (this.$store.getters['temp/getLastLedColors'] === null) ? Array(this.ledsLength * 3).fill(0) : this.$store.getters['temp/getLastLedColors']
    },
    __build2DPath (x, y, width, height, radius) {
      /**
       * Draws a rounded rectangle into a new Path2D object, returns the created path.
       * If you omit the last three params, it will draw a rectangle
       * outline with a 5 pixel border radius
       * @param {Number} x The top left x coordinate
       * @param {Number} y The top left y coordinate
       * @param {Number} width The width of the rectangle
       * @param {Number} height The height of the rectangle
       * @param {Number} [radius = 5] The corner radius; It can also be an object
       *                 to specify different radii for corners
       * @param {Number} [radius.tl = 0] Top left
       * @param {Number} [radius.tr = 0] Top right
       * @param {Number} [radius.br = 0] Bottom right
       * @param {Number} [radius.bl = 0] Bottom left
       * @return {Path2D} The final path
       */
      if (typeof radius === 'undefined') {
        radius = 5
      }
      if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius }
      } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side]
        }
      }

      var path = new Path2D()

      path.moveTo(x + radius.tl, y)
      path.lineTo(x + width - radius.tr, y)
      path.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
      path.lineTo(x + width, y + height - radius.br)
      path.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
      path.lineTo(x + radius.bl, y + height)
      path.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
      path.lineTo(x, y + radius.tl)
      path.quadraticCurveTo(x, y, x + radius.tl, y)

      return path
    },
    __printLedsToCanvas (colors) {
      // toggle leds, do not print
      if (!this.streamingLeds) { return }

      this.led2dctx.Hclear()
      if (typeof colors !== 'undefined') {
        this.lastLedColors = colors
      } else {
        colors = this.lastLedColors
      }
      // check if color length is long enough
      if (this.ledsLength > colors.length / 3) { return }

      let colI = 0
      for (var idx = 0; idx < this.ledsLength; idx++) {
        // var led = leds[idx];
        // can be used as fallback when Path2D is not available
        // roundRect(ledsCanvasNodeCtx, led.h.min * canvas_width, led.v.min * canvas_height, (led.h.max-led.h.min) * canvas_width, (led.v.max-led.v.min) * canvas_height, 4, true, colors[idx])
        // ledsCanvasNodeCtx.fillRect(led.h.min * canvas_width, led.v.min * canvas_height, (led.h.max-led.h.min) * canvas_width, (led.v.max-led.v.min) * canvas_height);
        this.led2dctx.fillStyle = 'rgba(' + colors[colI] + ',' + colors[colI + 1] + ',' + colors[colI + 2] + ',0.85)'// "hsl("+(idx*360/this.ledsLength)+",100%,50%)";
        this.led2dctx.fill(this.paths2d[idx])
        //  if (this.ledsShadow) { this.led2dctx.stroke(this.paths2d[idx]) }

        // increment color index
        colI += 3
      }
    },
    __setCanvasSize (width, height) {
      this.image2dctx.canvas.width = width
      this.image2dctx.canvas.height = height
      this.led2dctx.canvas.width = width
      this.led2dctx.canvas.height = height
      this.$refs.flowHelper.style.height = height + 'px'
    },
    __getCanvasSize (width, height) {
      return [this.image2dctx.canvas.width, this.image2dctx.canvas.height]
    },
    __resetImage () {
      const [width, height] = this.__getCanvasSize()
      this.image2dctx.fillStyle = 'rgb(90,90,90)'
      this.image2dctx.fillRect(0, 0, width, height)
      const image = new Image()
      image.onload = () => {
        this.image2dctx.drawImage(image, width * 0.5 - 126, height * 0.5 - 40)
      }
      image.src = 'statics/hyperion-logo-white.png'
    }

  }
}
</script>
