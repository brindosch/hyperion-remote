export default {
  uiSettings: {
    adminAppMode: false, // If true the app should use "adminAuth" for administration, if false we use "tokenAuth"
    themeColor: 'hyperion',
    backToTop: false
  },
  capture: {
    width: 75,
    height: 50,
    hz: 5,
    source: undefined
  },
  originName: null,
  priority: 50,
  selectedRemoteTab: 'tab-1',
  lastColor: { r: 255, g: 0, b: 0 },
  effBlacklist: [],
  debug: false,
  syncSettings: {
    favColors: [],
    dark: {
      mode: 'platform',
      lat: '',
      long: '',
      startTime: '18:00',
      endTime: '06:00'
    },
    lang: undefined
  }
}
