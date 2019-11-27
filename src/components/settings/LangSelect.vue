<template>
  <q-select
    :hint="$t('ui.lang_desc')"
    :label="$t('ui.lang')"
    :bottom-slots="showHint"
    v-model="lang"
    :options="langOptions"
    emit-value
    map-options
  >
    <template v-slot:prepend>
      <q-icon name="language" />
    </template>
  </q-select>
</template>

<script>
import { langMixin } from '../mixins'

export default {
  mixins: [langMixin],
  props: {
    showHint: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      lang: this.$store.getters['common/getLang']
    }
  },

  watch: {
    lang (lang) {
      this.setAppLang(lang)
    }
  },

  created () {
    this.langOptions = this.getAppLanguages().map(lang => ({
      label: lang.nativeName, value: lang.isoName
    }))
  }
}
</script>
