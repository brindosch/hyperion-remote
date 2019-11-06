<template>
  <div
    class="flex-center"
    style="max-width:500px"
  >
    <q-list :bordered="!isDarkTheme">
      <q-item-label header>
        {{$t('remote.adjust.subTitle')}}
      </q-item-label>
      <q-item v-show="getIndexOptions.length > 1">
        <q-item-section>
          <q-select
            :label="$t('remote.adjust.index')"
            :hint="$t('remote.adjust.indexHelp')"
            :dark="isDarkTheme"
            :options-dark="isDarkTheme"
            bottom-slots
            v-model="currentSelectedIndex"
            :options="getIndexOptions"
            :value="0"
            emit-value
            map-options
          />
        </q-item-section>
      </q-item>
      <div
        v-for="(value, index) in getAdjustments"
        :key="index"
        v-show="currentSelectedIndex == index"
        style="margin:10px"
      >
        <q-item
          v-for="(key) in sortedKeys"
          :key="key+index"
        >
          <q-item-section>
            <q-item-label :class="isDarkTheme ? 'text-light':''">{{ Array.isArray(value[key]) ? $t('colors.'+key) : $t('remote.adjust.'+key) }}</q-item-label>
            <q-input
              v-if="Array.isArray(value[key])"
              :dark="isDarkTheme"
              spellcheck="false"
            >
              <!-- :value="'rgb('+value[key][0]+','+value[key][1]+','+value[key][2]+')'" @input="setAdjustment(value['id'],key,$event)" -->
              <template v-slot:append>
                <q-icon
                  name="colorize"
                  class="cursor-pointer"
                  :style="'color: rgb('+value[key][0]+','+value[key][1]+','+value[key][2]+')'"
                >
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      :value="'rgb('+value[key][0]+','+value[key][1]+','+value[key][2]+')'"
                      @input="setAdjustment(value['id'],key,$event)"
                      :dark="isDarkTheme"
                      format-model="rgb"
                      style="min-width:300px;min-height:300px"
                      no-header
                      no-footer
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-slider
              v-else-if="key.startsWith('gamma')"
              :value="value[key]"
              @input="setAdjustment(value['id'],key,$event)"
              :min="0"
              :max="4"
              :step="0.1"
              label
              :dark="isDarkTheme"
            />
            <q-slider
              v-else-if="key.includes('brightness')"
              :value="value[key]"
              @input="setAdjustment(value['id'],key,$event)"
              :min="0"
              :max="100"
              :step="1"
              label
              :dark="isDarkTheme"
            />
          </q-item-section>
        </q-item>

      </div>
    </q-list>
  </div>
</template>

<style>
</style>

<script>
import { throttle } from '../utils'
import { colors } from 'quasar'
const { textToRgb } = colors

export default {
  name: 'AdjustmentsList',
  data () {
    return {
      currentSelectedIndex: '0',
      sortedKeys: ['white', 'red', 'green', 'blue', 'magenta', 'yellow', 'cyan', 'gammaRed', 'gammaGreen', 'gammaBlue', 'brightness', 'brightnessCompensation'],
      currentAdjustments: null
    }
  },
  created () {
    this.copyAdjustData()
    this.sendAdjustment = throttle(this.sendAdjustment, 1000)
  },
  computed: {
    isDarkTheme () { return this.$store.getters['common/isDarkTheme'] },
    getAdjustments () { return this.currentAdjustments },
    getIndexOptions () {
      let arr = []
      let vals = this.getAdjustments
      for (let i in vals) {
        arr.push({ value: i, label: vals[i].id })
      }
      return arr
    }
  },
  methods: {
    setAdjustment (id, type, value) {
      const c = textToRgb(value)
      value = [c.r, c.g, c.b]
      this.currentAdjustments[this.currentSelectedIndex][type] = value
      this.sendAdjustment(id, type, value)
    },
    sendAdjustment (id, type, value) {
      this.$socket.setAdjustment(id, type, value)
    },
    copyAdjustData () {
      // copy current backend data to local scope
      this.currentAdjustments = this.$store.getters['api/getAdjustments']
    }
  }
}
</script>
