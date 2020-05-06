<template>
      <q-card style="max-width:250px">
      <q-card-section>
        <div class="text-h6">Dialog</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn no-caps color="primary" label="confirmDialog" @click="testConfirmDialog" />
        <q-btn no-caps color="primary" label="promptDialog" @click="testPromptDialog()" />
        <q-btn no-caps color="primary" label="promptDialog:text" @click="testPromptDialogText('text')" />
        <q-btn no-caps color="primary" label="promptDialog:text:model" @click="testPromptDialogTextModel('text','A custom init value')" />
        <q-btn no-caps color="primary" label="promptDialog:number" @click="testPromptDialogNumber('number')" />
        <q-btn no-caps color="primary" label="promptDialog:textarea" @click="testPromptDialogTextarea('textarea')" />
        <q-btn no-caps color="primary" label="selectDialog:radio" @click="testSelectDialogRadio('radio','op2')" />
        <q-btn no-caps color="primary" label="selectDialog:checkbox" @click="testSelectDialogCheckbox('checkbox',['op2'])" />
        <q-btn no-caps color="primary" label="selectDialog:toggle" @click="testSelectDialogToggle('toggle',['op2'])" />
        <q-btn no-caps color="primary" label="fileDialog:image" @click="testFileDialogImage('image')" />
        <q-btn no-caps color="primary" label="fileDialog:image:multi" @click="testFileDialogImageMulti('image',true)" />
        <q-btn no-caps color="primary" label="fileDialog:image:multi" @click="testFileDialogJson('json')" />
        <q-btn no-caps color="primary" label="clear files" @click="files = []" />
      </q-card-actions>
    </q-card>
</template>

<script>
import { dialogMixin } from 'components/mixins'

export default {
  name: 'DialogTest',
  mixins: [dialogMixin],
  data () {
    return {
      title: 'This is a title',
      msg: 'this is a message',
      selData: [{ label: 'Option 1', value: 'op1' }, { label: 'Option 2', value: 'op2' }, { label: 'Option 3', value: 'op3' }],
      files: []

    }
  },
  methods: {
    async testConfirmDialog () {
      const res = await this.openConfirmDialog({ title: this.title, msg: this.msg })
      this.$q.notify(`confirmDialog Result: ${res}`)
    },
    async testPromptDialog (type, model) {
      const res = await this.openPromptDialog({ title: this.title, msg: this.msg, type, model })
      this.$q.notify(`promptDialog Result: ${res}`)
    },
    async testPromptDialogText (type, model) {
      const res = await this.openPromptDialog({ title: this.title, msg: this.msg, type, model })
      this.$q.notify(`promptDialogText Result: ${res}`)
    },
    async testPromptDialogTextModel (type, model) {
      const res = await this.openPromptDialog({ title: this.title, msg: this.msg, type, model })
      this.$q.notify(`promptDialogTextModel Result: ${res}`)
    },
    async testPromptDialogNumber (type, model) {
      const res = await this.openPromptDialog({ title: this.title, msg: this.msg, type, model })
      this.$q.notify(`promptDialogNumber Result: ${res}`)
    },
    async testPromptDialogTextarea (type, model) {
      const res = await this.openPromptDialog({ title: this.title, msg: this.msg, type, model })
      this.$q.notify(`promptDialogTextarea Result: ${res}`)
    },
    async testSelectDialogRadio (type, model) {
      const res = await this.openSelectionDialog({ title: this.title, msg: this.msg, type, model, items: this.selData })
      this.$q.notify(`selectDialogRadio Result: ${res}`)
    },
    async testSelectDialogCheckbox (type, model) {
      const res = await this.openSelectionDialog({ title: this.title, msg: this.msg, type, model, items: this.selData })
      this.$q.notify(`selectDialogCheckbox Result: ${res}`)
    },
    async testSelectDialogToggle (type, model) {
      const res = await this.openSelectionDialog({ title: this.title, msg: this.msg, type, model, items: this.selData })
      this.$q.notify(`selectDialogToggle Result: ${res}`)
    },
    async testFileDialogImage (type, multiple) {
      const res = await this.openFileDialog({ files: this.files, type, filter: undefined, multiple })
      this.$q.notify(`FileDialogImage Result: ${JSON.stringify(res)}`)
    },
    async testFileDialogImageMulti (type, multiple) {
      const res = await this.openFileDialog({ files: this.files, type, filter: undefined, multiple })
      this.$q.notify(`fileDialogImageMulti Result: ${JSON.stringify(res)}`)
    },
    async testFileDialogJson (type, multiple) {
      const res = await this.openFileDialog({ files: this.files, type, filter: undefined, multiple })
      this.$q.notify(`fileDialogJson Result: ${JSON.stringify(res)}`)
    }
  }
}
</script>
