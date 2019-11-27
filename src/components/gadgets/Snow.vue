<template>
  <canvas ref="snow_flake_canvas"></canvas>
</template>

<script>
export default {
  name: 'SeasonSnow',
  data () {
    return {
      canvas: null,
      ctx: null,
      requestFrameId: null,
      flakes: [],
      flakeCount: 55,
      mY: -100,
      mX: -100
    }
  },
  mounted () {
    this.canvas = this.$refs.snow_flake_canvas
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.$q.screen.width + 20
    this.canvas.height = this.$q.screen.height + 20

    // reduce flake count on mobile
    if (this.$q.platform.is.mobile) { this.flakeCount = 15 }

    // allow mouse influence
    this.canvas.addEventListener('mousemove', this.updateMousePos)

    // Init
    this.init()

    // if app is not visible during creation we should stop
    if (!this.$q.appVisible) { this.stopAnimation() }
  },
  beforeDestroy () {
    // stop always the animation
    this.stopAnimation()
  },
  watch: {
    '$q.screen.width' (val) {
      this.canvas.width = val + 20
    },
    '$q.screen.height' (val) {
      this.canvas.height = val + 20
    },
    '$q.appVisibile' (val) {
      // start and stop animation based on visibility
      // eslint-disable-next-line no-unused-expressions
      val ? this.snow() : this.stopAnimation()
    }
  },
  methods: {
    init () {
      for (let i = 0; i < this.flakeCount; i++) {
        var x = Math.floor(Math.random() * this.canvas.width),
          y = Math.floor(Math.random() * this.canvas.height),
          size = (Math.random() * 3) + 2,
          speed = (Math.random() * 1) + 0.5,
          opacity = (Math.random() * 0.5) + 0.3

        this.flakes.push({
          speed: speed,
          velY: speed,
          velX: 0,
          x: x,
          y: y,
          size: size,
          stepSize: (Math.random()) / 30,
          step: 0,
          opacity: opacity
        })
      }

      this.snow()
    },
    snow () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      for (let i = 0; i < this.flakeCount; i++) {
        let flake = this.flakes[i],
          x = this.mX,
          y = this.mY,
          minDist = 150,
          x2 = flake.x,
          y2 = flake.y

        let dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
          dx = x2 - x,
          dy = y2 - y

        if (dist < minDist) {
          // if flake is next to the mouse, push it away
          var force = minDist / (dist * dist),
            xcomp = (x - x2) / dist,
            ycomp = (y - y2) / dist,
            deltaV = force / 2

          flake.velX -= deltaV * xcomp
          flake.velY -= deltaV * ycomp
        } else {
          // X axis movement
          flake.velX *= 0.98
          if (flake.velY <= flake.speed) {
            flake.velY = flake.speed
          }
          flake.velX += Math.cos(flake.step += 0.05) * flake.stepSize
        }

        flake.y += flake.velY
        flake.x += flake.velX

        // reset flake when it hits the edge
        if (flake.y >= this.canvas.height || flake.y <= 0) {
          this.reset(flake)
        }

        if (flake.x >= this.canvas.width || flake.x <= 0) {
          this.reset(flake)
        }

        this.ctx.beginPath()
        this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
        this.ctx.fillStyle = 'rgba(255,255,255,' + flake.opacity + ')'
        this.ctx.fill()
      }
      this.requestFrameId = window.requestAnimationFrame(this.snow)
    },
    reset (flake) {
      flake.x = Math.floor(Math.random() * this.canvas.width)
      flake.y = 0
      flake.size = (Math.random() * 3) + 2
      flake.speed = (Math.random() * 1) + 0.5
      flake.velY = flake.speed
      flake.velX = 0
      flake.opacity = (Math.random() * 0.5) + 0.3
    },
    stopAnimation () {
      window.cancelAnimationFrame(this.requestFrameId)
    },
    updateMousePos (e) {
      this.mX = e.clientX
      this.mY = e.clientY
    }
  }
}
</script>

<style lang="stylus">
.snow_flake_canvas {
  position: absolute;
  overflow: hidden;
  top: -10;
  left: -10;
  width: 100%;
  height: 100%;
}
</style>
