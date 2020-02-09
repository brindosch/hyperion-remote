<template>

  <!-- TODO: Test Recorder API, there is blob data. https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API -->
  <div>
    <canvas
      v-show="false"
      ref="scanvas"
    ></canvas>
    <video
      v-show="false"
      ref="svideo"
      autoplay
    ></video>
    <!-- Option dialog -->
    <q-dialog v-model="showOptionDialog">
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section class="text-h6">
          {{$t('capture.title')}}
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{$t('capture.optionMsg')}}
        </q-card-section>
        <q-card-section>
          <div>{{$t('capture.lessIsMore')}}</div>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>{{$t('capture.imageHeight')}}</q-item-label>
                <q-slider
                  :value="conImageHeight"
                  @change="val => { conImageHeight = val }"
                  :min="10"
                  :max="500"
                  :step="10"
                  label
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>{{$t('capture.imageWidth')}}</q-item-label>
                <q-slider
                  :value="conImageWidth"
                  @change="val => { conImageWidth = val }"
                  :min="10"
                  :max="500"
                  :step="10"
                  label
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>{{$t('capture.hz')}}</q-item-label>
                <q-slider
                  :value="conImageHz"
                  @change="val => { conImageHz = val }"
                  :min="1"
                  :max="10"
                  label
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section>
          <div>{{$t('capture.source')}}</div>
          <q-radio
            v-if="hasDisplayMedia"
            v-model="conSource"
            val="platform"
            :label="$t('capture.platform')"
          />
          <q-radio
            v-if="hasUserMedia"
            v-model="conSource"
            val="camera"
            :label="$t('capture.camera')"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$q.lang.label.cancel"
            v-close-popup
          />
          <q-btn
            flat
            :disable="!conSource"
            :label="$q.lang.label.ok"
            v-close-popup
            @click="toggleStream"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- QDialog for the capture screen selection of electron -->
    <q-dialog
      v-if="$q.platform.is.electron"
      no-esc-dismiss
      no-backdrop-dismiss
      v-model="showSelectionDialog"
    >
      <q-card>
        <q-card-section class="text-h6">
          {{$t('capture.source')}}
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{$t('capture.selectMsg')}}
        </q-card-section>
        <q-card-section>
          <div class="row justify-center content-center">
            <template v-for="(source, i) in selectionList">
              <div
                :key="i"
                class="q-ma-sm text-center"
              >
                <video
                  autoplay
                  :src-object.prop.camel="source.stream"
                  style="height: 150px; width: 230px"
                  @click="handleStreamSelection(source.stream)"
                  class="v-zoom cursor-pointer"
                />
                <div
                  style="width:230px"
                  class="text-subtitle2"
                >
                  {{source.name}}</div>
              </div>
            </template>
          </div>
        </q-card-section>
        <q-card-actions
          align="center"
          class="full-width"
        >
          <q-btn
            flat
            :label="$q.lang.label.cancel"
            @click="handleStreamSelection (null)"
          />
        </q-card-actions>
      </q-card>

    </q-dialog>

  </div>

</template>

<style >
.v-zoom {
  transition: transform 0.2s;
  width: 220px;
  height: 150px;
}

.v-zoom:hover {
  transform: scale(1.1);
}
</style>

<script>

export default {
  name: 'Streamer',
  data () {
    return {
      showOptionDialog: false,
      showSelectionDialog: false,
      selectionList: [],
      canvas: null,
      canvasCtx: null,
      idata: null,
      recorder: null,
      screenshotTimer: null,
      streamImageHeight: 0,
      streamImageWidth: 0,
      conImageWidth: this.$store.state.common.capture.width,
      conImageHeight: this.$store.state.common.capture.height,
      conImageHz: this.$store.state.common.capture.hz,
      conSource: this.$store.state.common.capture.source,
      streaming: false
    }
  },
  mounted () {
    if (this.hasCaptureInterface)
      this.initCanvas()
  },
  beforeDestroy () {
    this.handleStreamSelection(null)
  },
  computed: {
    hasDisplayMedia () {
      return window && window.navigator.mediaDevices && window.navigator.mediaDevices.getDisplayMedia
    },
    hasUserMedia () {
      return window && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia
    },
    hasCaptureInterface () {
      let res = this.hasDisplayMedia || this.hasUserMedia
      this.$emit('visible', res)
      return res
    }
  },
  methods: {
    showOptDialog () {
      this.showOptionDialog = true
    },
    initCanvas () {
      // if OffscreenCanvas is supported, use it!
      // if(window && 'OffscreenCanvas' in window)
      //  this.canvas = new OffscreenCanvas(256, 256)
      // else
      this.canvas = this.$refs.scanvas

      // grab context
      this.canvasCtx = this.canvas.getContext('2d')
    },
    toggleStream () {
      this.streaming ? this.stopCapture() : this.startCapture()
    },
    handleStreamSelection (stream) {
      if (stream == null) {
        for (const entry of this.selectionList) {
          this.stopStream(entry.stream)
        }
        this.stopCapture()
        this.showSelectionDialog = false
        this.selectionList = []
        return
      }
      // stop all streams - not the requested
      for (const entry of this.selectionList) {
        if (stream.id !== entry.stream.id) { this.stopStream(entry.stream) }
      }

      // apply stream to video element, listen for track ending, fires when user aborts through browser
      this.$refs.svideo.srcObject = stream
      const track = stream.getVideoTracks()[0]
      track.onended = () => this.stopCapture()

      // wait for video ready, starts the capture
      this.$refs.svideo.onloadedmetadata = (e) => {
        window.setTimeout(() => (
          this.onCapabilitiesReady(track.getSettings())
        ), 500)
      }
      // close dialog
      this.showSelectionDialog = false
    },
    stopStream (stream) {
      stream.getTracks().forEach(track => track.stop())
    },
    async startCapture () {
      try {
        // platform specific window capture
        if (this.conSource == 'platform') {
          if (window.electron) {
            // workaround, we loose focus for an unknown reason sometimes
            window.electron.getFocusedWindow()

            const sources = await window.electron.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 0, height: 0 } })
            await this.getElectronSources(sources)
            // workaround
            window.electron.focusLastWindow()
            this.showSelectionDialog = true
          } else {
            let displayMediaOptions = {
              video: {
                cursor: 'never',
                width: this.conImageWidth,
                height: this.conImageHeight,
                frameRate: this.conImageHz
              },
              audio: false
            }
            let stream = await window.navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
            this.handleStreamSelection(stream)

            //      this.recorder = new MediaRecorder(stream);
            //      this.recorder.addEventListener('dataavailable', event => {
            //          if (event.data.size === 0) return;
            //          console.warn('DATA:',event.data)
            //        });

          }
        } else {
          // webcam, camera
          let constr = {
            audio: false,
            video: {
              width: { ideal: this.conImageWidth },
              height: { ideal: this.conImageHeight }
            }
          }
          let stream = await window.navigator.mediaDevices.getUserMedia(constr)
          console.log('myStream', stream)
          this.handleStreamSelection(stream)
        }
      } catch (err) {
        this.$q.notify({ message: `Error: ${err.name} - ${err.message}`, icon: 'videocam', color: 'negative' })
        this.handleStreamSelection(null)
        return
      }
    },
    onCapabilitiesReady (settings) {
      // extract real width/height
      this.streamImageWidth = settings.width
      this.streamImageHeight = settings.height

      // update canvas
      this.canvas.width = this.streamImageWidth
      this.canvas.height = this.streamImageHeight

      // start screenshotTimer
      this.updateScrTimer(false)

      // we are sending
      this.streaming = true
      this.$q.notify({ message: 'Capturing started (W:' + this.streamImageWidth + 'px | H:' + this.streamImageHeight + 'px)', icon: 'videocam', color: 'positive' })
      // this.recorder.start()
      // set global disconnect blocker
      this.$store.commit('temp/setPreventAutoDisconnect', true)
    },
    stopCapture (evt) {
      this.streaming = false
      this.$store.commit('temp/setPreventAutoDisconnect', false)
      // this.recorder.stop()

      this.updateScrTimer(true)
      // sometimes it's null on abort
      if (this.$refs.svideo.srcObject) {
        this.stopStream(this.$refs.svideo.srcObject)
        this.$refs.svideo.srcObject = null
      }
    },
    takePicture () {
      this.canvasCtx.drawImage(this.$refs.svideo, 0, 0, this.streamImageWidth, this.streamImageHeight)

      this.idata = this.canvas.toDataURL('image/png').split(',')[1]
      // this.idata = this.canvasCtx.createImageData(this.streamImageWidth, this.streamImageHeight)
      // this.$socket.setImageRGBA(this.idata, 2000, "Streaming");
      this.$socket.setImage(this.idata, 2000, 'Streaming')

      // To get data from recorder, we need to request it!
      // this.recorder.requestData();
    },
    updateScrTimer (stop) {
      // start or update screenshot timer
      clearInterval(this.screenshotTimer)

      if (stop === false) {
        this.screenshotTimer = setInterval(() => (
          this.takePicture()
        ), 1 / this.conImageHz * 1000)
      }
    },
    async getElectronSources (sources) {
      for (const source of sources) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: this.conImageWidth,
              minHeight: this.conImageHeight,
            }
          }
        })
        this.selectionList.push(Object.assign(source, { stream: stream }))
      }
    }
  }
}
</script>
