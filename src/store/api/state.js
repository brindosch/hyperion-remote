export default {
  sysInfo: {
    hyperion: {
      build: '',
      jsonrpc_version: '',
      time: '',
      version: '',
      id: ''
    },
    system: {
      architecture: '',
      hostName: '',
      kernelType: '',
      kernelVersion: '',
      prettyName: '',
      productType: '',
      productVersion: '',
      wordSize: ''
    }
  },
  serverInfo: {
    adjustment: [{ brightness: 50 }],
    components: [
      {
        enabled: true,
        name: 'ALL'
      },
      {
        enabled: true,
        name: 'SMOOTHING'
      },
      {
        enabled: true,
        name: 'BLACKBORDER'
      },
      {
        enabled: false,
        name: 'FORWARDER'
      },
      {
        enabled: false,
        name: 'UDPLISTENER'
      },
      {
        enabled: false,
        name: 'BOBLIGHTSERVER'
      },
      {
        enabled: false,
        name: 'GRABBER'
      },
      {
        enabled: false,
        name: 'V4L'
      },
      {
        enabled: true,
        name: 'LEDDEVICE'
      }
    ],
    effects: [],
    plugins: {},
    instance: [{
      'instance': 0,
      'running': true,
      'friendly_name': 'My First LED Hardware instance'
    }]
  },
  serverSchema: {},
  serverConfig: {},
  logEntries: [],
  activeLogFilters: [],
  adminAuthRequired: true,
  tokenAuthRequired: true,
  loggedin: false
}
