<template>
  <div
    @drop.prevent="addDropFile"
    @dragover.prevent
    @click.stop="addClickFile"
    class="cursor-pointer row flex-center q-pa-sm dropzone"
    :style="dropZoneColor"
  >
    <div
      v-if="files.length == 0"
      class="flex flex-center"
    >
      <div class="text-h5 q-dialog__message">{{ $tc('utils.dropzone.title',this.multiple ? 2 : 1) }}</div>
    </div>
    <div
      v-else
      v-for="file in files"
      :key="file.name"
      class="file-entry relative-position no-wrap shadow-1 q-ma-sm"
      :style="getFileStyle(file)"
    >
      <div class="file-header row flex-center no-wrap rounded-border q-pl-sm q-pt-sm q-pr-sm">
        <div class="col">
          <div class="file-header-title">
            {{ file.name.length > 20 ? file.name.slice(0,20)+'...' : file.name }}
          </div>
          <div class="file-header-subtitle">
            ({{ humanStorageSize(file.size) }})
          </div>
        </div>
        <q-btn
          flat
          round
          dense
          @click.stop="removeFile(file)"
          :title="$q.lang.label.remove"
          icon="close"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.file-entry {
  width: 220px;
  background-size: cover;
}

.file-header {
  padding-bottom: 24px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 20%, transparent);
  color: white;
}

.file-header-subtitle {
  font-size: 12px;
  line-height: 18px;
}

.file-header-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
}

.dropzone {
  border: 3px grey dashed;
}
</style>

<script>
import { format } from 'quasar'
const { humanStorageSize } = format

import { parseFiles } from 'src/utils'
import { dialogMixin } from 'components/mixins'

export default {
  name: 'DropZone',
  mixins: [dialogMixin],
  props: {
    // Array of Strings ['png','json']
    filter: {
      type: Array,
      default: () => ['json', 'png', 'jpeg', 'jpg']
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      files: []
    }
  },
  computed: {
    filesAvailable () {
      return this.files.length === 0
    },
    dropZoneColor () {
      return this.$q.dark.isActive ? 'background: #444;' : ''
    }
  },
  methods: {
    async addDropFile (e) {
      const droppedFiles = e.dataTransfer.files
      if (!droppedFiles) return
      try {
        this.files = await parseFiles({ files: this.files, filter: this.filter, multiple: this.multiple, newFiles: [...droppedFiles] })
      } catch (error) {
        console.error(`DropZone: ${error.name} Error: ${error.message}`)
        this.$q.notify(`${error.name} Error: ${error.message}`)
      }
    },
    async addClickFile (e) {
      this.files = await this.openFileDialog({ files: this.files, filter: this.filter, multiple: this.multiple })
    },
    removeFile (file) {
      this.files = this.files.filter(f => {
        return f !== file
      })
    },
    getFileStyle (file) {
      if (file.preview) { return { 'background-image': 'url(' + file.preview + ')', height: '170px' } } else { return { background: 'white' } }
    },
    humanStorageSize
  }
}
</script>
