import { ledStreamRequest } from "./mutations";

export default {
  initialConnected: false,
  connectState: 'DISCONNECTED',
  lastLedColors: null,
  activeInstance: 0,
  preventAutoDisconnect: false,
  openLoginDialog: false,
  openConnectDialog: false,
  openTokenHandler: false,
  imageStreamRequest: [],
  ledStreamRequest: [],
  btnMoreEntries: [], // [{label:'lang label',icon:'iconname',event:'nameofeventonclick'}]
  availThemeColors: ['hyperion', 'indigo', 'cyan', 'teal', 'green', 'lime', 'amber', 'orange', 'deep-orange', 'red', 'pink', 'purple', 'deep-purple', 'brown'],
  logFilterOptions: [{ label: 'NETWORK', value: 'JSONSERVER:JSONCLIENTCONNECTION:WEBSOCKET:WEBSERVER' }, { label: 'PLUGINS', value: 'PLUGINS:PLUGIN' }, { label: 'EFFECTS', value: 'EFFECTENGINE:EFFECT' }]
}
