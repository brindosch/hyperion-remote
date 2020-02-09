<template>
  <q-input
    class="full-width"
    readonly
    :value="data"
  >
    <template v-slot:after>
      <q-btn
        round
        dense
        flat
        icon="fas fa-clipboard"
        @click="copyToClipboard(data)"
      >
        <q-tooltip>{{$t('utils.copyToClipboard')}}</q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { copyToClipboardMixin } from '../mixins'
export default {
  name: 'CopyToClipboard',
  mixins: [copyToClipboardMixin],
  props: {
    data: String
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>