import { openFile } from '../../utils'

export default {
  name: 'dialogMixin',
  data () {
    return {
    }
  },
  methods: {
    // Returns a promise with true or false
    async openConfirmDialog ({ title, msg }) {
      let res
      try {
        if (window.electron) {
          res = await window.electron.openConfirmDialog({ title, msg, cancelLabel: this.$q.lang.label.cancel, okLabel: this.$t('label.yes') })
          res = (res.response != 0)
        } else {
          res = this._openQuasarConfirmDialog({ title, msg })
        }
      } catch (error) {
        // on failure we fallback to Quasar Dialog
        console.error('Confirm Dialog Error', error)
        res = this._openQuasarConfirmDialog({ title, msg })
      }
      return res
    },
    // Returns a promise with data or false
    // String callback is trimmed to get a false boolean eval on empty data
    async openPromptDialog ({ title, msg, type, model }) {
      return new Promise((res, rej) => {
        this.$q.dialog({
          title: title,
          message: msg,
          cancel: true,
          prompt: {
            model: model,
            type: type
          },
          ok: true,
          'no-esc-dismiss': true,
          'no-backdrop-dismiss': true,
          color: 'primary'
        })
          .onOk(data => res(data))
          .onDismiss(() => res(false))
      })
    },
    // Returns a promise with data or false
    // String callback is trimmed to get a false boolean eval on empty data
    async openSelectionDialog ({ title, msg, type, model, items }) {
      return new Promise((res, rej) => {
        this.$q.dialog({
          title: title,
          message: msg,
          cancel: true,
          options: {
            model: model,
            type: type,
            items: items
          },
          ok: true,
          'no-esc-dismiss': true,
          'no-backdrop-dismiss': true,
          color: 'primary'
        })
          .onOk(data => {
            if (typeof data === 'string') { data = data.trim() }
            res(data)
          })
          .onDismiss(() => res(false))
      })
    },
    // Returns a promise with files.
    // type: The file type. One of 'image','json','zip'
    // multiple: If the dialog should allow multiple file selections
    // files: An array of previous files or empty, Format: [{name,size,data,preview}]
    async openFileDialog ({ files, type, filter, multiple }) {
      // check type of dialog
      if (!filter && !['image', 'json'/*, 'zip' */].includes(type)) {
        this.$q.notify('No valid file type specified in openFileDialog')
        return
      }
      switch (type) {
        case 'image':
          filter = ['jpg', 'jpeg', 'png', 'gif']
          break
        case 'json':
          filter = ['json']
          break
        //  case 'zip':
        //    filter = ['zip']
        //   break;
        default:
          break
      }

      try {
        await openFile({ files, filter, multiple })
      } catch (error) {
        console.error(`openFileDialog: ${error.name} Error: ${error.message}`)
        this.$q.notify(`${error.name} Error: ${error.message}`)
      }
    },
    async _openQuasarConfirmDialog ({ title, msg }) {
      return new Promise((res, rej) => {
        this.$q.dialog({
          title: title,
          message: msg,
          cancel: true,
          ok: true,
          'no-esc-dismiss': true,
          'no-backdrop-dismiss': true,
          color: 'primary'
        })
          .onOk(() => res(true))
          .onDismiss(() => res(false))
      })
    }
  }
}
