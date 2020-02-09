export default {
  name: 'restartMixin',
  data () {
    return {

    }
  },
  methods: {
    restartApp () {
      if (window.electron)
        window.electron.restartApp()
      else {
        window.location.reload()
      }
    }
  }
}