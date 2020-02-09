import { openURL } from 'quasar'
export default {
    name: 'openUrlMixin',
    data () {
        return {
        }
    },
    methods: {
        openUrl (url) {
            // whitelist URLs to open?!
            if (window.electron)
                window.electron.openUrl(url)
            else
                openURL(url)
        }
    }
}