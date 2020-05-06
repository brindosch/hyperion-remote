import { openFile } from '../../utils'
import { Plugins } from 'app/src-capacitor/node_modules/@capacitor/core'

const { Modals } = Plugins

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
          res = (res.response !== 0)
        } else if (this.$q.platform.is.capacitor) {
          res = await Modals.confirm({
            title: title,
            message: msg
          })
          res = res.value
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
    // type: one of 'text' | 'number' | 'textarea' (capacitor just text)
    // model: initial value
    // String callback is trimmed to get a false boolean eval on empty data
    async openPromptDialog ({ title, msg, type, model }) {
      // capacitor just accepts text
      const typeText = !type || type === 'text'
      console.log(type, model, typeText)
      if (typeText && this.$q.platform.is.capacitor) {
        const res = await Modals.prompt({
          title: title,
          message: msg,
          inputText: model
        })
        return res.value
      } else {
        return new Promise((resolve, reject) => {
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
            .onOk(data => {
              if (typeof data === 'string') { data = data.trim() }
              resolve(data)
            })
            .onDismiss(() => resolve(false))
        })
      }
    },
    // Show a selection dialog. A radio is single selection while other multi
    // type: one of 'radio' | 'checkbox' | 'toggle'
    // mode: Start value of selection: String 'op1' for radio, array ['op1'] with one entry for other
    // items: The data for selection [ { label: 'Option 1', value: 'op1' }, { label: 'Option 2', value: 'op2' }, { label: 'Option 3', value: 'op3' } ]
    // retuns a string with the selected option(s) comma delimited or boolean false on abort.
    async openSelectionDialog ({ title, msg, type, model, items }) {
      return new Promise((resolve, reject) => {
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
            resolve(data)
          })
          .onDismiss(() => resolve(false))
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
        files = await openFile({ files, filter, multiple })
      } catch (error) {
        console.error(`openFileDialog: ${error.name} Error: ${error.message}`)
        this.$q.notify(`${error.name} Error: ${error.message}`)
      }
      return files
    },
    async _openQuasarConfirmDialog ({ title, msg }) {
      return new Promise((resolve, reject) => {
        this.$q.dialog({
          title: title,
          message: msg,
          cancel: true,
          ok: true,
          'no-esc-dismiss': true,
          'no-backdrop-dismiss': true,
          color: 'primary'
        })
          .onOk(() => resolve(true))
          .onDismiss(() => resolve(false))
      })
    }
  }
}
