export default {
  initialConnected: false,
  connected: false,
  connecting: false,
  lastLedColors: null,
  lastPage: null,
  activeInstance: 0,
  preventAutoDisconnect: false,
  availPages: [{ title: 'dashboard', path: '/', icon: 'dashboard' }, { title: 'control', path: '/control', icon: 'fas fa-gamepad' }, { title: 'settings', path: '/settings', icon: 'settings' }],
  availThemeColors: ['hyperion', 'indigo', 'cyan', 'teal', 'green', 'lime', 'amber', 'orange', 'deep-orange', 'red', 'pink', 'purple', 'deep-purple', 'brown'],
  logFilterOptions: [{ label: 'NETWORK', value: 'JSONSERVER:JSONCLIENTCONNECTION:WEBSOCKET:WEBSERVER' }, { label: 'PLUGINS', value: 'PLUGINS:PLUGIN' }, { label: 'EFFECTS', value: 'EFFECTENGINE:EFFECT' }]
}
