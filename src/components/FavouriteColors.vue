<template>
  <div>
    <q-menu context-menu>
      <q-list dense>
        <q-item
          clickable
          v-close-popup
          @click="showEditDialog = true"
        >
          <q-item-section>
            {{$t('remote.colors.editFavColors')}}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <div class="flex">
      <div
        v-ripple
        class="grid-item row content-start relative-position cursor-pointer shadow-1"
        :class="{'bg-grey-5': el.color.length > 1}"
        v-for="(el, i) in favColors"
        :style="el.color.length > 1 ? '' : 'background-color: '+el.color"
        :key="el.id"
        @click="setColor(i)"
      >
        <template v-if="el.color.length > 1">
          <div
            v-for="(col, ix) in getColorByIndex(i)"
            :key="ix+col"
            class="inset-shadow-1"
            :class="gridItemClassByLength(el.color.length)"
            :style="'background-color: '+col"
          ></div>
        </template>
      </div>
    </div>
    <!-- EDIT DIALOG -->
    <q-dialog v-model="showEditDialog">
      <q-card style="width:800px">
        <q-card-section>
          <div class="text-h6">{{$t('remote.colors.editFavColors')}}</div>
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{$t('remote.colors.editFavColors_desc')}}

        </q-card-section>
        <q-card-section>
          <q-list>
            <!-- Section -->
            <draggable
              :list="favColors"
              v-bind="dragOptions"
              handle=".fav-colors-handle"
            >
              <q-item
                v-for="(el, idx) in favColors"
                :key="idx"
                dense
              >
                <q-item-section side>
                  <q-icon
                    name="fas fa-align-justify cursor-pointer"
                    class="fav-colors-handle"
                  />
                </q-item-section>

                <q-item-section>
                  <!-- Section Colors -->
                  <draggable
                    :list="favColors[idx].color"
                    group="favcolgroup"
                    ghost-class="favourite-ghost"
                    :animation='150'
                    draggable='.favc-draggable'
                    filter=".favc-filter"
                    class="flex"
                    @remove="onRemove($event,idx)"
                    @start="colorDrag = true"
                    @end="colorDrag = false"
                  >
                    <div
                      v-for="(col, ix) in favColors[idx].color"
                      :key="ix"
                      class="grid-item-edit favc-draggable cursor-pointer position-relative shadow-1"
                      @click="setPickerData(idx,ix,col)"
                    >
                      <div
                        :style="'background:'+col"
                        class="fit"
                      ></div>
                      <q-popup-proxy>
                        <div>
                          <q-color
                            :value="initialPickerColor"
                            @change="modColor(currIndex, currColorIndex, $event)"
                            format-model="hex"
                            no-footer
                          />
                        </div>
                      </q-popup-proxy>
                    </div>
                    <!-- Add section color -->
                    <div
                      class="grid-item-edit cursor-pointer position-relative flex flex-center favc-filter"
                      @click="addColor(idx)"
                      style="background:rgba(219, 219, 219, 0.59)"
                    >
                      <q-icon
                        name="fas fa-times close"
                        class="rotate-45"
                      ></q-icon>
                      <q-menu context-menu>
                        <q-list dense>
                          <template v-for="(col, idc) in favColors[idx].color">
                            <q-item
                              clickable
                              v-close-popup
                              @click.stop="addColor(idx,col)"
                              :key="idc"
                            >
                              <q-item-section side>
                                {{idc+1}}
                              </q-item-section>
                              <q-item-section>
                                <div
                                  :style="'background:'+col"
                                  class="grid-item-small shadow-1"
                                ></div>
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-list>
                      </q-menu>
                    </div>
                  </draggable>
                </q-item-section>
                <!-- Section trash icon -->
                <q-item-section side>

                  <draggable
                    :list="trashList"
                    group="favcolgroup"
                    v-bind="trashOptions"
                    ghost-class="hide-ghost"
                  >
                    <q-icon
                      ref="trashicon"
                      name="fas fa-trash-alt"
                      class="cursor-pointer"
                      :class="{'zoom-2':colorDrag}"
                      size="sm"
                      @click.stop="removeEntryAt(idx)"
                    />

                  </draggable>
                </q-item-section>
              </q-item>
            </draggable>

          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="$t('label.add')"
            color="primary"
            @click.stop="addEntry"
          />
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style>
.grid-item {
  width: 48px;
  height: 48px;
  margin: 10px;
}
.grid-item-small {
  width: 20px;
  height: 20px;
}
.grid-item-edit {
  width: 35px;
  height: 35px;
  margin: 7px;
}
.favourite-ghost {
  opacity: 0.5;
}
.hide-ghost {
  display: none;
}
.grid-item-item {
  width: 20px;
  height: 20px;
}
.grid-item-16 {
  width: 12px;
  height: 12px;
}
.grid-item-12 {
  width: 12px;
  height: 16px;
}
.grid-item-8 {
  width: 24px;
  height: 12px;
}
.grid-item-6 {
  width: 24px;
  height: 16px;
}
.grid-item-4 {
  width: 24px;
  height: 24px;
}
.grid-item-2 {
  width: 48px;
  height: 24px;
}
</style>

<script>
import draggable from 'vuedraggable'
import { getRandomHash } from 'components/mixins'
import { colors } from 'quasar'
const { hexToRgb } = colors
import { EventBus } from 'src/utils'

export default {
  name: 'FavouriteColors',
  mixins: [getRandomHash],
  components: {
    draggable
  },
  props: {
    showEdit: Boolean
  },
  data () {
    return {
      favColors: this.$store.getters['common/getFavColors'],
      trashList: [],
      colorDrag: false,
      showEditDialog: this.showEdit,
      currIndex: 0,
      currColorIndex: 0,
      initialPickerColor: '#fff'
    }
  },
  created () {
    EventBus.$on('favcolorsedit', this.openEditDialog)
  },
  beforeDestroy () {
    EventBus.$off('favcolorsedit', this.openEditDialog)
  },
  computed: {
    dragOptions () {
      return {
        animation: 150,
        group: 'description',
        disabled: false,
        ghostClass: 'favourite-ghost'
      }
    },
    trashOptions () {
      return {
        group: {
          name: 'trash',
          put: () => true,
          pull: false
        }
      }
    }
  },
  methods: {
    gridItemClassByLength (count) {
      if (count < 3)
        return 'grid-item-2'
      else if (count < 5)
        return 'grid-item-4'
      else if (count < 7)
        return 'grid-item-6'
      else if (count < 9)
        return 'grid-item-8'
      else if (count < 13)
        return 'grid-item-12'
      else
        return 'grid-item-16'
    },
    getColorByIndex (i) {
      return this.favColors[i].color.slice(0, 16)
    },
    setPickerData (i, ic, col) {
      this.currIndex = i
      this.currColorIndex = ic
      this.initialPickerColor = col
    },
    modColor (i, ic, val) {
      this.favColors[i].color.splice(ic, 1, val)
    },
    setColor (i) {
      let arrayColors = []
      this.favColors[i].color.forEach(hexCol => {
        const col = hexToRgb(hexCol)
        for (const key in col) { arrayColors.push(col[key]) }
      })
      this.$socket.setColor(arrayColors)
    },
    addEntry () {
      this.favColors.push({ id: this.getRandomHash(), color: ['#ff0000'] })
    },
    removeEntryAt (i) {
      this.favColors.splice(i, 1)
    },
    addColor (i, col) {
      // add color in .color
      this.favColors[i].color.push(col || this.favColors[i].color.slice(-1)[0] || '#ff0000')
    },
    onRemove (e, i) {
      if (e.oldIndex === 0) { this.removeEntryAt(i) }
    },
    openEditDialog () {
      this.showEditDialog = true
    }
  }
}
</script>
