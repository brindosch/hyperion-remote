import SERVERINFO from './serverinfo'

export default {
  sysInfo: {
    hyperion: {
      build: '',
      gitremote: '',
      jsonrpc_version: '',
      time: '',
      version: '0.0.1',
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
  serverInfo: SERVERINFO,
  serverSchema: {},
  serverConfig: {},
  logEntries: [],
  activeLogFilters: [],
  loggedin: false,
  loginReady: false,
  tokenList: [],
  pendingTokens: []
}
