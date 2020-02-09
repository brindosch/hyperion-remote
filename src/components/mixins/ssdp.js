export default {
    name: 'ssdpMixin',
    data () {
        return {
            SSDPSearching: false
        }
    },
    computed: {
        isSSDPSearching () {
            return this.SSDPSearching
        }
    },
    methods: {
        // entry point to search for a valid SSDP ST target
        // If ST target is invalid or an error occurs the Promise will reject, so you should catch() errors
        // On reject the return value is undefined on resolve it returns an array with all found entries
        // Hint: Use isSSDPSearching to show a loading state
        async searchTarget (target) {
            await this.__isTargetValid(target)

            this.SSDPSearching = true

            let res = await this.__searchServer(target).catch((error) => {
                this.SSDPSearching = false
                // forward reject to caller
                return new Promise((res, rej) => { rej(error) })
            })
            this.SSDPSearching = false
            return res
        },
        async __isTargetValid (target) {
            return new Promise((res, rej) => {
                if (!target)
                    rej('No target given')
                else
                    res(true)
            })
        },
        async __searchServer (target) {
            let res
            if (this.$q.platform.is.cordova) {
                // eslint-disable-next-line no-undef
                res = await this.__handleCordova(target)
            } else if (window.electron) {
                res = await window.electron.ipc.invoke('ssdpget')
            }
            return res
        },
        async __handleCordova (target) {
            return new Promise((res, rej) => {
                serviceDiscovery.getNetworkServices(target, (devices) => {
                    for (let entry of devices) {
                        let list = []
                        if (entry.ST === target) {
                            var parser = document.createElement('a')
                            var oParser = new DOMParser()
                            parser.href = entry.LOCATION
                            var oDOM = oParser.parseFromString(entry.xml, 'text/xml')
                            // check if xml pasrsing was IO
                            if (oDOM.documentElement.nodeName === 'parsererror') {
                                continue
                            }
                            // check if the host address already exists
                            if (list.findIndex(ientry => ientry.value === parser.host) === -1) { list.push({ label: oDOM.getElementsByTagName('friendlyName')[0].innerHTML, value: parser.host }) }
                        }
                    }
                    res(list)
                }, (error) => {
                    rej('Cordova plugin: ' + error)
                })
            })
        },
        async searchHyperionServer () {
            return await this.searchTarget('urn:hyperion-project.org:device:basic:1')
        }
    }
}
