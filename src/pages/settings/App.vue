<template>
  <q-page class="row">
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">
      <ui-settings />
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">
      <connection-settings />
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
    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12">
      <service-settings />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { UiSettings, ServiceSettings, ConnectionSettings } from 'components'

export default {
  name: 'PageSettings',
  components: {
    'ui-settings': UiSettings,
    'connection-settings': ConnectionSettings,
    'service-settings': ServiceSettings
  },
  data () {
    return {
      originNameValError: false,
      originNameValErrorLabel: '',
      priorityValError: false,
      priorityValErrorLabel: ''
    }
  },
  computed: {
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
    modEffBlacklist: {
      get () { return this.$store.getters['common/getEffBlacklist'] },
      set (val) { this.$store.commit('common/setEffBlacklist', val) }
    }
  }
}
</script>

<style>
.header-text {
  font-size: 120%;
}
</style>
