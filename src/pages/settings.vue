<template>
  <q-page class="row">
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">
      <q-list>
        <q-item-label
          header
          class="header-text"
        >
          {{$t('ui.listLabel')}}
        </q-item-label>
        <q-item>
          <q-item-section>
            <q-select
              :hint="$t('ui.locale_select_desc')"
              :label="$t('ui.locale_select')"
              :dark="isDarkTheme"
              :options-dark="isDarkTheme"
              bottom-slots
              :options="getSupportedLocales"
              v-model="modLocale"
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="language" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              :helper="$t('ui.themeColor_desc')"
              :label="$t('ui.themeColor')"
              :dark="isDarkTheme"
              :options-dark="isDarkTheme"
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
              :helper="$t('ui.startPage_desc')"
              :label="$t('ui.startPage')"
              bottom-slots
              :dark="isDarkTheme"
              :options-dark="isDarkTheme"
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
            <q-field
              :dark="isDarkTheme"
              :hint="$t('ui.darkTheme_desc')"
              :label="$t('ui.darkTheme')"
              stack-label
              bottom-slots
            >
              <template v-slot:prepend>
                <q-icon name="brightness_3" />
              </template>
              <q-toggle
                :dark="isDarkTheme"
                v-model="modDarkTheme"
              />
            </q-field>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-field
              :dark="isDarkTheme"
              :hint="$t('ui.backToTop_desc')"
              :label="$t('ui.backToTop')"
              bottom-slots
              stack-label
            >
              <template v-slot:prepend>
                <q-icon name="keyboard_arrow_up" />
              </template>
              <q-toggle
                :dark="isDarkTheme"
                v-model="modBackToTop"
              />
            </q-field>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">
      <q-list>
        <q-item-label
          header
          class="header-text"
        >
          {{$t('conn.settingsListLabel')}}
          <q-icon name="info">
            <q-tooltip
              content-style="font-size: 90%"
              :delay="400"
              max-width="30rem"
            >
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label> {{$t('conn.autoConnect')}} </q-item-label>
                    <q-item-label> {{$t('conn.autoConnect_desc')}} </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label> {{$t('conn.autoDisconnect')}} </q-item-label>
                    <q-item-label> {{$t('conn.autoDisconnect_desc')}} </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label> {{$t('conn.autoLogin')}} </q-item-label>
                    <q-item-label> {{$t('conn.autoLogin_desc')}} </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tooltip>
          </q-icon>
        </q-item-label>
        <q-item>
          <q-item-section>
            <q-field
              :dark="isDarkTheme"
              :hint="$t('conn.autoConnect_desc')"
              :label="$t('conn.autoConnect')"
              bottom-slots
              stack-label
            >
              <template v-slot:prepend>
                <q-icon name="wifi" />
              </template>
              <q-toggle
                :dark="isDarkTheme"
                v-model="modAutoConnect"
              />
            </q-field>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-field
              :dark="isDarkTheme"
              :hint="$t('conn.autoDisconnect_desc')"
              :label="$t('conn.autoDisconnect')"
              bottom-slots
              stack-label
            >
              <template v-slot:prepend>
                <q-icon name="wifi_off" />
              </template>
              <q-toggle
                :dark="isDarkTheme"
                v-model="modAutoDisconnect"
              />
            </q-field>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-field
              :dark="isDarkTheme"
              :hint="$t('conn.autoLogin_desc')"
              :label="$t('conn.autoLogin')"
              bottom-slots
              stack-label
            >
              <template v-slot:prepend>
                <q-icon name="fas fa-sign-in-alt" />
              </template>
              <q-toggle
                :dark="isDarkTheme"
                v-model="modAutoLogin"
              />
            </q-field>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">
      <q-list>
        <q-item-label
          header
          class="header-text"
        >
          {{$t('misc.title')}}
        </q-item-label>
        <q-item>
          <q-item-section>
            <q-select
              :hint="$t('misc.effBlacklistHelp')"
              :label="$t('misc.effBlacklist')"
              bottom-slots
              stack-label
              :dark="isDarkTheme"
              :options-dark="isDarkTheme"
              multiple
              :options="$store.getters['api/getSelectPreparedEffects']"
              v-model="modEffBlacklist"
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="visibility_off" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              :hint="$t('misc.originNameHelp')"
              :label="$t('misc.originName')"
              :error="originNameValError"
              :error-message="originNameValErrorLabel"
              bottom-slots
              :dark="isDarkTheme"
              v-model="modOriginName"
              type="text"
              spellcheck="false"
            >
              <template v-slot:prepend>
                <q-icon name="perm_identity" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              :hint="$t('misc.priorityHelp')"
              :label="$t('misc.priority')"
              :error="priorityValError"
              :error-message="priorityValErrorLabel"
              bottom-slots
              :dark="isDarkTheme"
              v-model="modPriority"
              type="number"
              spellcheck="false"
            >
              <template v-slot:prepend>
                <q-icon name="priority_high" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { colors } from 'quasar'
import { qcolor } from '../utils'

export default {
  name: 'PageSettings',
  data () {
    return {
      originNameValError: false,
      originNameValErrorLabel: '',
      priorityValError: false,
      priorityValErrorLabel: ''
    }
  },
  computed: {
    getSupportedLocales () {
      let optLocales = []
      for (let entry of this.$store.getters['temp/getSupportedLocales']) {
        optLocales.push({ label: this.$i18n.t('locale.' + entry), value: entry })
      }
      return optLocales
    },
    modLocale: {
      get () { return this.$store.getters['common/getCurrentLocale'] },
      set (val) { this.$store.dispatch('common/setLocale', { lang: val, app: this }) }
    },
    isDarkTheme () {
      return this.$store.getters['common/isDarkTheme']
    },
    modDarkTheme: {
      get () { return this.$store.getters['common/isDarkTheme'] },
      set (val) { this.$store.commit('common/setDarkTheme', val) }
    },
    modOriginName: {
      get () { return this.$store.getters['common/getOriginName'] },
      set (val) {
        if (val.length >= 4 && val.length <= 20) {
          this.originNameValError = false
          this.$store.commit('common/setOriginName', val)
        } else {
          if (val.length > 20) { this.originNameValErrorLabel = this.$t('validate.maxLength', [20]) } else { this.originNameValErrorLabel = this.$t('validate.minLength', [4]) }
          this.originNameValError = true
        }
      }
    },
    modPriority: {
      get () { return this.$store.getters['common/getPriority'] },
      set (val) {
        val = Math.round(val)
        if (val >= 1 && val <= 253) {
          this.priorityValError = false
          this.$store.commit('common/setPriority', val)
        } else {
          if (val > 253) { this.priorityValErrorLabel = this.$t('validate.maximum', [253]) } else { this.priorityValErrorLabel = this.$t('validate.minimum', [1]) }
          this.priorityValError = true
        }
      }
    },
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
    modEffBlacklist: {
      get () { return this.$store.getters['common/getEffBlacklist'] },
      set (val) { this.$store.commit('common/setEffBlacklist', val) }
    },
    modStartPage: {
      get () { return this.$store.getters['common/getStartPage'] },
      set (val) { this.$store.commit('common/setStartPage', val) }
    },
    modBackToTop: {
      get () { return this.$store.getters['common/isBacktoTop'] },
      set (val) { this.$store.commit('common/setBackToTop', val) }
    },
    modAutoConnect: {
      get () { return this.$store.getters['connection/getAutoConnect'] },
      set (val) { this.$store.commit('connection/setAutoConnect', val) }
    },
    modAutoDisconnect: {
      get () { return this.$store.getters['connection/getAutoDisconnect'] },
      set (val) { this.$store.commit('connection/setAutoDisconnect', val) }
    },
    modAutoLogin: {
      get () { return this.$store.getters['connection/getAutoLogin'] },
      set (val) { this.$store.commit('connection/setAutoLogin', val) }
    }
  }
}
</script>

<style>
.header-text {
  font-size: 120%;
}
</style>
