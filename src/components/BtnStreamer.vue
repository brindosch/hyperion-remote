<template>
  <div>
    <!-- TODO: Test Recorder API, there is blob data. https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API -->
    <q-btn-dropdown
      v-if="showComponent"
      flat
      dense
      split
      :disable-dropdown="streaming"
      @click="handleStream"
      :color="streaming ? 'red' : 'white'"
      icon="videocam"
    >
      <q-list
        :dark="isDarkTheme"
        :class="{'bg-matmenu':isDarkTheme}"
      >
        <template v-for="(item, index) in streamQualityList">
          <q-item
            clickable
            v-close-popup
            @click="setStreamQuality(item,index)"
            :key="index"
          >
            <q-item-section side>
              <q-icon
                name="picture_in_picture"
                :color="currentSelected == index ? 'green' : 'grey'"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{item.text}}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-btn-dropdown>
    <canvas
      v-show="false"
      ref="scanvas"
    ></canvas>
    <video
      v-show="false"
      ref="svideo"
      autoplay
    ></video>
    <!-- QDialog for the capture screen selection of electron -->
    <q-dialog
      v-if="$q.platform.is.electron"
      no-esc-dismiss
      no-backdrop-dismiss
      v-model="showSelectionDialog"
    >
      <q-card
        style="width: 800px; max-width: 80vw;"
        :class="{'bg-dark text-white':isDarkTheme}"
      >
        <q-card-section class="text-h6 text-center">
          {{$t('streamer.select')}}
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
            @click="handleStreamSelection(null)"
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
  name: 'BtnStreamer',
  data () {
    return {
      showSelectionDialog: false,
      selectionList: [],
      canvas: null,
      canvasCtx: null,
      idata: null,
      recorder: null,
      showComponent: false,
      screenshotTimer: null,
      screenshotIntervalTimeMs: 100,
      streamImageHeight: 0,
      streamImageWidth: 0,
      displayMediaOptions: {
        video: {
          cursor: 'never',
          width: 170,
          height: 100,
          frameRate: 10
        },
        audio: false
      },
      currentSelected: this.getStreamQuality(),
      streaming: false,
      streamQualityList: [
        { width: 85, height: 50, text: this.$t('capture.small') },
        { width: 266, height: 150, text: this.$t('capture.normal') },
        { width: 708, height: 400, text: this.$t('capture.large') },
        { width: 1777, height: 1000, text: this.$t('capture.insane') }
      ]
    }
  },
  mounted () {
    this.checkBrowserAPI()
  },
  computed: {
    isDarkTheme () { return this.$store.getters['common/isDarkTheme'] }
  },
  beforeDestroy () {
    this.handleStreamSelection(null)
  },
  methods: {
    checkBrowserAPI () {
      // check if the streaming api is usable/available
      if (window && window.navigator.mediaDevices && window.navigator.mediaDevices.getDisplayMedia) {
        this.showComponent = true
        this.initCanvas()
        // TODO: Test if API realyl works, as on mobile it won't
      }
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
    setStreamQuality (item, index) {
      this.currentSelected = index
      this.$store.commit('common/setStreamQuality', index)
    },
    getStreamQuality () {
      return this.$store.getters['common/getStreamQuality']
    },
    handleStream () {
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
      // update requested video specs
      this.displayMediaOptions.video.width = this.streamQualityList[this.currentSelected].width
      this.displayMediaOptions.video.height = this.streamQualityList[this.currentSelected].height

      if (this.$q.platform.is.electron) {
        // workaround, we loose focus for an unknown reason sometimes
        window.bwindow.getFocusedWindow()

        window.dCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 0, height: 0 } })
          .then(async sources => {
            for (const source of sources) {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  audio: false,
                  video: {
                    mandatory: {
                      chromeMediaSource: 'desktop',
                      chromeMediaSourceId: source.id,
                      minWidth: this.streamQualityList[this.currentSelected].width,
                      maxWidth: this.streamQualityList[this.currentSelected].width + 1000, // better handling? black bars because of aspect ratio
                      minHeight: this.streamQualityList[this.currentSelected].height,
                      maxHeight: this.streamQualityList[this.currentSelected].height
                    }
                  }
                })
                // data for dialog
                this.selectionList.push(Object.assign(source, { stream: stream }))
              } catch (err) {
                this.handleStreamSelection(null)
                this.$q.notify({ message: 'Browser API Error: ' + err, icon: 'videocam', color: 'negative' })
                return
              }
            }
            // workaround get focus again
            window.bwindow.focusLastWindow()
            this.showSelectionDialog = true
          })
      } else {
        try {
          var stream = await window.navigator.mediaDevices.getDisplayMedia(this.displayMediaOptions)
          this.handleStreamSelection(stream)

          //      this.recorder = new MediaRecorder(stream);
          //      this.recorder.addEventListener('dataavailable', event => {
          //          if (event.data.size === 0) return;
          //          console.warn('DATA:',event.data)
          //        });
        } catch (err) {
          this.stopCapture()
          this.$q.notify({ message: 'Browser API Error: ' + err, icon: 'videocam', color: 'negative' })
        }
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
        ), this.screenshotIntervalTimeMs)
      }
    }
  }
}
</script>
