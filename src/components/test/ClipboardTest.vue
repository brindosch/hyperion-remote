<template>
      <q-card style="max-width:250px">
      <q-card-section>
        <div class="text-h6">Clipboard</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-input color="primary" label="Copy Content" v-model="copyContent"></q-input>
        <q-btn no-caps color="primary" label="readFromClipboard" @click="testReadFromClipboard" />
        <q-btn no-caps color="primary" label="copyToClipboard" @click="testCopyToClipboard" />
      </q-card-actions>
    </q-card>
</template>

<script>
import { clipboardMixin } from 'components/mixins'

export default {
  name: 'ClipboardTest',
  mixins: [clipboardMixin],
  data () {
    return {
      copyContent: 'A clipboard string'
    }
  },
  methods: {
    async testReadFromClipboard () {
      const res = await this.readFromClipboard()
      this.$q.notify(`readFromClipboard Result: ${res}`)
    },
    async testCopyToClipboard () {
      this.copyToClipboard(this.copyContent)
      this.$q.notify(`copyToClipboard Result: ${this.copyContent}`)
    }
  }
}
</script>
