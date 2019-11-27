export default {
  uiSettings: {
    adminAppMode: false, // If true the app should use "adminAuth" for administration, if false we use "tokenAuth"
    darkTheme: null,
    themeColor: 'hyperion',
    backToTop: false,
    startPage: '/control'
  },
  originName: null,
  priority: 50,
  selectedRemoteTab: 'tab-1',
  lastColor: { r: 255, g: 0, b: 0 },
  lastStreamQuality: 0,
  effBlacklist: [],
  debug: false,
  syncSettings: {
    favColors: [],
    darkMode: 'platform',
    darkTimespan: ['06:00', '18:00'],
    lang: undefined
  }
}
