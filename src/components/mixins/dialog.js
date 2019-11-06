const dialog = {
  name: 'dialog',
  data () {
    return {
    }
  },
  methods: {
    openConfirmDialog ({ title, msg }) {
      return this.$q.dialog({
        title: title,
        message: msg,
        cancel: true,
        ok: true,
        'no-esc-dismiss': true,
        'no-backdrop-dismiss': true,
        dark: this.$store.getters['common/isDarkTheme'],
        color: 'primary'
      })
    },
    openPromptDialog ({ title, msg, type, model }) {
      return this.$q.dialog({
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
        dark: this.$store.getters['common/isDarkTheme'],
        color: 'primary'
      })
    }
  }
}
export { dialog }
