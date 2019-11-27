<template>
  <q-list>
    <q-item-label
      header
      class="header-text"
    >
      {{$t('ui.listLabel')}}
    </q-item-label>
    <q-item>
      <q-item-section>
        <lang-select></lang-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          :hint="$t('ui.themeColor_desc')"
          :label="$t('ui.themeColor')"
          bottom-slots
          :options="getAvailThemeColors"
          v-model="modThemeColor"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="color_lens" />
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-icon
                  :name="scope.opt.icon"
                  :color="scope.opt.color"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          :hint="$t('ui.startPage_desc')"
          :label="$t('ui.startPage')"
          bottom-slots
          :options="getAvailPages"
          v-model="modStartPage"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="panorama" />
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          :hint="$t('ui.darkMode_desc')"
          :label="$t('ui.darkMode')"
          bottom-slots
          :options="getDarkModeOptions"
          v-model="modDarkMode"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="brightness_3" />
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item v-if="false">
      <q-item-section>
        <q-input
          :hint="$t('ui.darkStartTime_desc')"
          :label="$t('ui.darkStartTime')"
          bottom-slots
          v-model="modDarkStartTime"
          mask="time"
          :rules="['time']"
        >
          <template v-slot:prepend>
            <q-icon name="brightness_3" />
          </template>
          <template v-slot:append>
            <q-icon
              name="access_time"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  now-btn
                  v-model="modDarkStartTime"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-show="modDarkMode==='time'">
      <q-item-section>
        <q-input
          :value="getDarkTimespanInput"
          @input="setDarkTimespan"
          mask="##:## - ##:##"
          :error="timespanError"
          :error-message="$t('validate.timespan')"
          bottom-slots
          hide-hint
          :hint="$t('ui.darkTimespan_desc')"
          :label="$t('ui.darkTimespan')"
        >
          <template v-slot:prepend>
            <q-icon name="brightness_3" />
          </template>
          <template v-slot:append>
            <q-icon
              name="access_time"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-scroller
                  view="time-range"
                  disable-validation
                  rounded-borders
                  no-border
                  no-footer
                  :inner-color="$q.dark.isActive ? 'grey-9':'white'"
                  :inner-text-color="$q.dark.isActive ? 'grey-2':'grey-8'"
                  v-model="modDarkTimespan"
                  :style="scrollerPopupStyle250"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item v-if="false">
      <q-item-section>
        <q-input
          :hint="$t('ui.darkEndTime_desc')"
          :label="$t('ui.darkEndTime')"
          bottom-slots
          v-model="modDarkEndTime"
          mask="time"
          :rules="['time']"
        >
          <template v-slot:prepend>
            <q-icon name="brightness_3" />
          </template>
          <template v-slot:append>
            <q-icon
              name="access_time"
              class="cursor-pointer"
            >
              <q-popup-proxy
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  now-btn
                  v-model="modDarkEndTime"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item tag="label">
      <q-item-section>
        <q-item-label>
          {{$t('ui.backToTop')}}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="modBackToTop" />
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('ui.backToTop_desc')}}
      </q-tooltip>
    </q-item>
  </q-list>
</template>

<style src="@quasar/quasar-ui-qscroller/dist/index.css"></style>

<script>
import { colors } from 'quasar'
import { qcolor } from 'src/utils'

import LangSelect from './LangSelect'
import { Component as QScroller } from '@quasar/quasar-ui-qscroller'

export default {
  name: 'UiSettings',
  components: {
    'lang-select': LangSelect,
    'q-scroller': QScroller
  },
  data () {
    return { timespanError: false }
  },
  computed: {
    getAvailThemeColors () {
      let selectList = []
      for (let entry of this.$store.getters['temp/getAvailThemeColors']) {
        selectList.push({ label: this.$i18n.t('colors.' + entry), value: entry, icon: 'color_lens', color: entry })
      }
      return selectList
    },
    modThemeColor: {
      get () { return this.$store.getters['common/getThemeColor'] },
      set (val) {
        this.$store.commit('common/setThemeColor', val)
        // switch color of primary
        colors.setBrand('primary', qcolor.toHex(this.$store.getters['common/getThemeColor']))
        // addressbar color switch to new primary
        this.$q.addressbarColor.set()
        // android
        if (this.$q.platform.is.cordova && cordova.platformId === 'android') {
          // eslint-disable-next-line no-undef
          StatusBar.backgroundColorByHexString(qcolor.toHex(this.$store.getters['common/getThemeColor']))
        }
      }
    },
    getAvailPages () {
      let selectList = []
      for (let entry of this.$store.getters['temp/getAvailPages']) {
        selectList.push({ label: this.$i18n.t('pages.' + entry.title), value: entry.path, icon: entry.icon })
      }
      return selectList
    },
    modStartPage: {
      get () { return this.$store.getters['common/getStartPage'] },
      set (val) { this.$store.commit('common/setStartPage', val) }
    },
    getDarkModeOptions () {
      return this.$store.getters['common/getDarkModeOptions'].map(el => ({ label: this.$t('ui.darkMode_' + el), value: el }))
    },
    modDarkMode: {
      get () { return this.$store.getters['common/getDarkMode'] },
      set (val) { this.$store.commit('common/setDarkMode', val) }
    },
    modDarkTimespan: {
      get () { return this.$store.getters['common/getDarkTimespan'] },
      set (val) { this.$store.commit('common/setDarkTimespan', val) }
    },
    getDarkTimespanInput () {
      return this.$store.getters['common/getDarkStartTime'] + ' - ' + this.$store.getters['common/getDarkEndTime']
    },
    modDarkStartTime: {
      get () { return this.$store.getters['common/getDarkStartTime'] },
      set (val) { this.$store.commit('common/setDarkStartTime', val) }
    },
    modDarkEndTime: {
      get () { return this.$store.getters['common/getDarkEndTime'] },
      set (val) { this.$store.commit('common/setDarkEndTime', val) }
    },
    modBackToTop: {
      get () { return this.$store.getters['common/isBacktoTop'] },
      set (val) { this.$store.commit('common/setBackToTop', val) }
    },
    scrollerPopupStyle250 () {
      if (this.$q.screen.lt.sm) {
        return {
          width: '90vw',
          height: '25vh'
        }
      } else {
        return {
          maxHeight: '200px',
          height: '200px',
          width: '250px'
        }
      }
    }
  },
  methods: {
    setDarkTimespan (val) {
      this.lmodDarkTimespanInput = val
      if (val.length == 13 && this.validateTime(val)) {
        this.timespanError = false
        const st = val.split(' - ')
        this.$store.commit('common/setDarkStartTime', st[0])
        this.$store.commit('common/setDarkEndTime', st[1])
      } else {
        this.timespanError = true
      }
    },
    validateTime (timeString) {
      const parts = timeString.split('-')
      if (parts.length === 2) {
        const start = parts[0].trim()
        const end = parts[1].trim()
        if (this.isValidTime(start) && this.isValidTime(end)) {
          return true
        }
      }
      return false
    },
    isValidTime (time) {
      let parts = time.split(':')
      if (parts.length === 2) {
        let hour = parseInt(parts[0], 10)
        let minute = parseInt(parts[1], 10)
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
          return true
        }
      }
      return false
    }
  }
}
</script>
