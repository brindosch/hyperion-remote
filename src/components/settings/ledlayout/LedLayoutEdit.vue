<template>
  <div class="q-pa-md">
    <div
      ref="frame"
      :style="{'position': 'relative', 'height': this.frameHeight + 'px' }"
      class="layout-editor-qmenu"
    >
      <q-resize-observer
        :debounce="200"
        @resize="onFrameResize"
      />
      <q-menu
        touch-position
        context-menu
        target=".layout-editor-qmenu"
      >
        <q-list dense>
          <q-item
            :disable="!canUndo"
            clickable
            @click.stop="undo()"
          >
            <q-item-section avatar>
              <q-icon
                right
                name="undo"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$q.lang.editor.undo}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            :disable="!canRedo"
            clickable
            @click.stop="redo()"
          >
            <q-item-section avatar>
              <q-icon
                right
                name="redo"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$q.lang.editor.redo}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item
            clickable
            v-close-popup
            @click.stop="createNewLed()"
          >
            <q-item-section avatar>
              <q-icon
                right
                name="add"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.add')}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup="lastActive != -1"
            :disable="lastActive == -1"
            @click.stop="removeLed()"
          >
            <q-item-section avatar>
              <q-icon
                right
                name="remove"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$tc('conf.layout.remove',1)}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup="frameLeds.length > 0"
            :disable="frameLeds.length == 0"
            @click.stop="removeLeds()"
          >
            <q-item-section avatar>
              <q-icon
                right
                name="remove"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$tc('conf.layout.remove',2)}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item
            clickable
            v-close-popup="lastActive != -1"
            :disable="lastActive == -1"
            @click.stop="handleLedName"
          >
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.ledName')}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup="frameLeds.length > 0"
            :disable="frameLeds.length == 0"
            @click="nameLedsDialog = !nameLedsDialog"
          >
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.ledName')}} ...</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup="frameLeds.length > 0"
            :disable="frameLeds.length == 0"
            @click="moveVisible = !moveVisible"
          >
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.ledOrder')}} ...</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-close-popup
            clickable
            @click.stop="handleVisibleLeds"
          >
            <q-item-section avatar>

            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.ledVisible')}} ...</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />

          <q-item
            tag="label"
            v-close-popup
            clickable
          >
            <q-item-section avatar>
              <q-radio
                class="q-pl-sm"
                dense
                v-model="axisOption"
                val="x"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.movexaxis')}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            tag="label"
            v-close-popup
            clickable
          >
            <q-item-section avatar>
              <q-radio
                class="q-pl-sm"
                dense
                v-model="axisOption"
                val="y"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.moveyaxis')}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            tag="label"
            v-close-popup
            clickable
          >
            <q-item-section avatar>
              <q-radio
                class="q-pl-sm"
                dense
                v-model="axisOption"
                val="both"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('conf.layout.movexyaxis')}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-item
            v-close-popup
            clickable
            @click.stop="resetLayout()"
          >
            <q-item-section avatar>
              <q-icon
                right
                name="fas fa-trash-alt"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$q.lang.label.reset}}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-menu>

      <vue-draggable-resizable
        class="flex flex-center"
        :class="{'lle-visibility':!isVisible(i),'cursor-pointer': isVisible(i) ,'lle-default': currentActive != i}"
        class-name-active="lle-active"
        class-name-handle="editor-handle"
        v-for="(led, i) in frameLeds"
        :key="led.id"
        :x="led.x"
        :y="led.y"
        :w="led.width"
        :h="led.height"
        :axis="axisOption"
        :active="isVisible(i) && currentActive == i"
        :resizable="isVisible(i)"
        :draggable="isVisible(i)"
        @dragstop="(left, top) => onDragStop(i, left, top)"
        @resizestop="(left, top, width, height) => onResizeStop(i, left, top, width, height)"
        @activated="onActivated(i)"
        @deactivated="onDeactivated(i)"
        :parent="true"
      >
        <div>{{i+1}}
        </div>
        <template v-if="led.name">
          <q-tooltip>{{led.name}}</q-tooltip>
        </template>
      </vue-draggable-resizable>

    </div>
    <q-dialog v-model="moveVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('conf.layout.ledOrder')}}</div>
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{$t('conf.layout.ledOrderMsg')}}
        </q-card-section>
        <q-card-section>
          <draggable
            v-model="frameLeds"
            class="row"
            group="ledlayoutorder"
            ghost-class="favourite-ghost"
            :animation='150'
          >
            <div
              v-for="(el, i) in frameLeds"
              class="grid-item row justify-center items-center cursor-pointer"
              :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'"
              :key="i"
            >{{i+1}}
              <template v-if="el.name">
                <q-tooltip>{{el.name}}</q-tooltip>
              </template>
            </div>
          </draggable>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$q.lang.label.ok"
            v-close-popup
            color="primary"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="nameLedsDialog"
      @before-hide="calcFrameLedsToLed"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('conf.layout.ledName')}}</div>
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{$t('conf.layout.ledNameMsg2')}}
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div
              v-for="(el, i) in frameLeds"
              class="grid-item row justify-center items-center cursor-pointer"
              :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-3'"
              :key="i"
            >{{i+1}}
              <template v-if="el.name">
                <q-tooltip>{{el.name}}</q-tooltip>
              </template>
              <q-popup-edit
                buttons
                v-model="currLedName"
                :title="$t('conf.layout.ledName')+' '+(i+1)"
                :validate="ledNameValidation"
                @hide="ledNameValidation"
                @save="saveName(i,$event)"
                @before-show="currLedName = frameLeds[i].name || ''"
              >
                <q-input
                  v-model="currLedName"
                  :error="ledNameError"
                  :error-message="ledNameErrorMsg"
                  dense
                  autofocus
                />
              </q-popup-edit>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            :label="$q.lang.label.ok"
            color="primary"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import draggable from 'vuedraggable'
import { cutNumber } from 'src/utils'
import { undoredo, freeze, getRandomHash, dialogMixin, stringToNumber } from 'components/mixins'

export default {
  name: 'PageLedLayout',
  mixins: [undoredo, freeze, getRandomHash, dialogMixin, stringToNumber],
  components: {
    'vue-draggable-resizable': VueDraggableResizable,
    draggable
  },
  data () {
    return {
      currLedName: '',
      ledNameErrorMsg: '',
      ledNameError: false,
      axisOption: 'both',
      currentActive: -1,
      lastActive: -1,
      visibleLeds: [],
      moveVisible: false,
      nameLedsDialog: false,
      currLeds: [],
      frameLeds: [], // leds calculated to frame size + vue-draggable-resizeable vals
      frameWidth: 100,
      frameHeight: 100
    }
  },
  mounted () {
    // be sure we init
    this.resetLayout(true)
    this.onFrameResize({ width: this.$refs.frame.offsetWidth })
  },
  methods: {
    onFrameResize (size) {
      this.frameWidth = size.width
      this.frameHeight = Math.round(size.width / (16 / 10))
      this.calcLedsToFrame()
    },
    onResizeStop (i, x, y, width, height) {
      // width/height/x/Y push back to frameLeds, to keep data in sync, store transaction
      this.storeUndoItem(this.frameLeds)

      this.$set(this.frameLeds, i, Object.assign({}, this.frameLeds[i], { width, height, x, y }))
      this.$set(this.currLeds, i, this.calcFrameLedToLed({ x, y, width, height }))
    },
    onDragStop (i, x, y) {
      // catch in place drags, as the component emits them often which fills undo/redo
      if (this.frameLeds[i].x === x && this.frameLeds[i].y === y) { return }
      // x/y push back to frameLeds to keep data in sync, store transaction
      this.storeUndoItem(this.frameLeds)

      // drag has no width/height in emit
      let width = this.frameLeds[i].width
      let height = this.frameLeds[i].height

      this.$set(this.frameLeds, i, Object.assign({}, this.frameLeds[i], { x, y }))
      this.$set(this.currLeds, i, this.calcFrameLedToLed({ x, y, width, height }))
    },
    calcFrameLedsToLed () {
      let cLeds = []
      this.frameLeds.forEach(fled => {
        cLeds.push(this.calcFrameLedToLed(fled))
      })
      this.currLeds = cLeds
    },
    calcFrameLedToLed ({ x, y, width, height, name }) {
      // calc position of led back to Led Layout values
      let hmin, hmax, vmin, vmax

      hmin = cutNumber(x / this.frameWidth)
      hmax = cutNumber((x + width) / this.frameWidth)
      vmin = cutNumber(y / this.frameHeight)
      vmax = cutNumber((y + height) / this.frameHeight)
      return { hmin, hmax, vmin, vmax, name }
    },
    calcLedsToFrame () {
      let fLeds = []
      this.currLeds.forEach(led => {
        fLeds.push(this.calcLedToFrameLed(led))
      })
      this.frameLeds = fLeds
    },
    calcLedToFrameLed (led) {
      // calc position of LED based on Led Layout to frame width/height rounded to Pixels
      let x, y, width, height, id, name
      id = this.getRandomHash()
      x = Math.round(led.hmin * this.frameWidth)
      y = Math.round(led.vmin * this.frameHeight)
      width = Math.round((led.hmax - led.hmin) * this.frameWidth)
      height = Math.round((led.vmax - led.vmin) * this.frameHeight)
      name = led.name
      return { x, y, width, height, id, name }
    },
    async resetLayout (skipDialog) {
      if (!skipDialog) {
        const res = await this.openConfirmDialog({ title: this.$t('conf.layout.reset'), msg: this.$t('conf.layout.confResetMsg') })
        if (res)
          this._performReset()
        return
      }
      this._performReset()
    },
    _performReset () {
      this.currLeds = this.unfreeze(this.$store.getters['api/getLeds'])
      this.calcLedsToFrame()
      this.resetUndoItems()
      this.visibleLeds = []
      this.axisOption = 'both'
    },
    undo () {
      this.frameLeds = this.undoItem()
      this.calcFrameLedsToLed()
    },
    redo () {
      this.frameLeds = this.redoItem()
      this.calcFrameLedsToLed()
    },
    onActivated (i) {
      this.currentActive = i
      this.lastActive = i
    },
    onDeactivated (i) {
      this.currentActive = -1
      // we might want to delete the last active led, race condition
      setTimeout(() => { this.lastActive = -1 }, 100)
    },
    createNewLed () {
      this.storeUndoItem(this.frameLeds)
      this.currLeds.push({ hmin: 0.4, hmax: 0.6, vmin: 0.4, vmax: 0.6 })
      this.calcLedsToFrame()
      this.$q.notify(this.$t('conf.layout.ledAdded', { lednr: '(' + this.currLeds.length + ')' }))
      this.currentActive = this.currLeds.length - 1
      this.lastActive = this.currLeds.length - 1
    },
    async handleVisibleLeds () {
      const data = await this.openPromptDialog({ title: this.$t('conf.layout.ledVisible'), msg: this.$t('conf.layout.ledVisibleMsg'), model: this.visibleLeds.map(x => x + 1).toString() })
      if (data) {
        // translate from led number to index pos and filter
        const res = this.stringExpToInteger(data).map(v => v - 1)
        this.visibleLeds = res.filter(val => this.frameLeds[val] !== undefined)
      }
    },
    async handleLedName () {
      if (this.lastActive === -1) { return }
      const la = this.lastActive
      let data = await this.openPromptDialog({ title: this.$t('conf.layout.ledName'), msg: this.$t('conf.layout.ledNameMsg', { lednr: this.lastActive + 1 }) })

      if (data) {
        this.storeUndoItem(this.frameLeds)
        this.$set(this.frameLeds[la], 'name', data)
        this.$set(this.currLeds[la], 'name', data)
      }
    },
    removeLed () {
      if (this.lastActive === -1) { return }
      this.storeUndoItem(this.frameLeds)
      this.$q.notify(this.$tc('conf.layout.ledRemoved', 1, { lednr: '(' + (this.lastActive + 1) + ')' }))
      this.currLeds.splice(this.lastActive, 1)
      this.frameLeds.splice(this.lastActive, 1)
    },
    async removeLeds () {
      const data = await this.openPromptDialog({ title: this.$tc('conf.layout.remove', 2), msg: this.$t('conf.layout.removeLedsMsg') })
      if (data) {
        // translate from led number to index pos and filter
        const res = this.stringExpToInteger(data).map(v => v - 1)
        const avail = res.filter(val => this.frameLeds[val] !== undefined)

        if (avail.length) {
          this.storeUndoItem(this.frameLeds)
          this.frameLeds = this.frameLeds.filter((val, i, self) => !avail.includes(i))
          this.currLeds = this.currLeds.filter((val, i, self) => !avail.includes(i))
          this.visibleLeds = this.visibleLeds.filter((val, i, self) => !avail.includes(val))
          this.$q.notify(this.$tc('conf.layout.ledRemoved', avail.length, { lednr: '(' + avail.map(x => x + 1).toString() + ')' }))
        }
      }
    },
    isVisible (i) {
      return this.visibleLeds.length === 0 || this.visibleLeds.includes(i)
    },
    ledNameValidation (val) {
      if (val !== undefined) {
        const cleanVal = val.trim()
        if (this.frameLeds.find((el) => el.name == cleanVal)) {
          this.ledNameError = true
          this.ledNameErrorMsg = this.$t('validate.unique', [`"${val}"`])
          return false
        }
        return true
      }
      this.ledNameError = false
      this.ledNameErrorMsg = ''
      return true
    },
    saveName (i, name) {
      if (name === undefined || name.trim() === '') {
        this.$delete(this.frameLeds[i], 'name')
        this.$delete(this.currLeds[i], 'name')
      } else {
        this.$set(this.frameLeds[i], 'name', name.trim())
        this.$set(this.currLeds[i], 'name', name.trim())
      }
    }
  }
}
</script>

<style>
.lle-active {
  z-index: 3 !important;
  border: 1px dashed black !important;
  background-color: rgba(255, 223, 154, 0.6) !important;
}

.lle-default {
  z-index: 2 !important;
  background: rgba(128, 128, 128, 0.6);
  border: 1px solid black;
}

.lle-visibility {
  z-index: 1 !important;
  border: 1px solid rgba(0, 0, 0, 0.336) !important;
  background-color: rgba(128, 128, 128, 0.199) !important;
  color: rgb(58, 58, 58);
}

.editor-handle {
  position: absolute;
  background-color: rgb(201, 201, 201);
  border: 1px solid black;
  border-radius: 50%;
  height: 14px;
  width: 14px;
  box-model: border-box;
  -webkit-transition: all 300ms linear;
  -ms-transition: all 300ms linear;
  transition: all 300ms linear;
}

.editor-handle-tl {
  top: -14px;
  left: -14px;
  cursor: nw-resize;
}

.editor-handle-tm {
  top: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: n-resize;
}

.editor-handle-tr {
  top: -14px;
  right: -14px;
  cursor: ne-resize;
}

.editor-handle-ml {
  top: 50%;
  margin-top: -7px;
  left: -14px;
  cursor: w-resize;
}

.editor-handle-mr {
  top: 50%;
  margin-top: -7px;
  right: -14px;
  cursor: e-resize;
}

.editor-handle-bl {
  bottom: -14px;
  left: -14px;
  cursor: sw-resize;
}

.editor-handle-bm {
  bottom: -14px;
  left: 50%;
  margin-left: -7px;
  cursor: s-resize;
}

.editor-handle-br {
  bottom: -14px;
  right: -14px;
  cursor: se-resize;
}

.editor-handle-tl:hover,
.editor-handle-tm:hover,
.editor-handle-tr:hover,
.editor-handle-mr:hover,
.editor-handle-ml:hover,
.editor-handle-bl:hover,
.editor-handle-bm:hover,
.editor-handle-br:hover {
  background-color: rgb(233, 233, 233);
  transform: scale(1.2);
}
</style>