export default {
  norevert: 'This action can\'t be reverted!',
  led: 'LED',
  leds: 'LEDs',
  locale: {
    'en-us': 'English',
    de: 'German'
  },
  base: {
    ledregex: 'Example: \'5\' or \'1-9\' or \'3,5,7,22\' or \'4,7,12-16\''
  },
  streamer: {
    select: 'Select a screen to start streaming'
  },
  ui: {
    listLabel: 'User interface',
    locale_select: 'Language',
    locale_select_desc: 'Select a language for the user interface',
    themeColor: 'Color',
    themeColor_desc: 'Choose a theme color',
    startPage: 'Start page',
    startPage_desc: 'Choose a start page',
    backToTop: 'Back To Top',
    backToTop_desc: 'Show the "Back to Top" button, when the end of page has been reached',
    darkTheme: 'Night mode',
    darkTheme_desc: 'Enable or disable the night mode'
  },
  colors: {
    hyperion: 'Default',
    indigo: 'Indigo',
    cyan: 'Cyan',
    teal: 'Teal',
    green: 'Green',
    lime: 'Lime',
    amber: 'Amber',
    orange: 'Orange',
    'deep-orange': 'Deep orange',
    red: 'Red',
    pink: 'Pink',
    purple: 'Purple',
    'deep-purple': 'Deep purple',
    brown: 'Brown',
    white: 'White',
    blue: 'Blue',
    magenta: 'Magenta',
    yellow: 'Yellow'
  },
  btn: {
    connect: 'Connect',
    login: 'Login',
    logout: 'Logout',
    createToken: 'Create Token',
    openWui: 'Open Webconfiguration',
    disconnect: 'Disconnect',
    toggleFullscreen: 'Full screen',
    toggleLeds: 'Toggle LEDs',
    toggleImage: 'Toggle Image'
  },
  pages: {
    dashboard: 'Dashboard',
    control: 'Control',
    settings: 'Settings',
    about: 'About'
  },
  conn: {
    connected: 'Connected',
    notconnected: 'Not connected',
    disconnected: 'Disconnected',
    connecting: 'Connecting',
    webserverAdr: 'Hyperion Webserver address',
    failedMsg: 'Hyperion seems not reachable at the given address',
    successMsg: 'Successfully connected',
    storedConnections: 'Stored connections',
    address: 'Address',
    settingsListLabel: 'Connection',
    autoConnect: 'Auto connect',
    autoConnect_desc: 'Connect automatically on startup to the last connected Hyperion address',
    autoDisconnect: 'Auto disconnect',
    autoDisconnect_desc: 'Disconnect from Hyperion temporarily when the app is in background. Reconnects automatically when back in foreground',
    autoLogin: 'Auto login',
    autoLogin_desc: 'Login automatically if required and login data is available',
    ssdpNoResults: 'No Hyperion server found',
    ssdpError: 'Ups, failure while using SSDP discovery',
    ssdpDialogTitle: 'Found Hyperion server',
    ssdpDialogText: 'Choose a server you want to connect',
    invalidMsgAddress: "Provided address isn't legit",
    spinnerFetchData: 'Synchronize data with server',
    respFailure: 'Server Error Response',
    usehttps: 'You need to use the HTTPS port! (default: {port})'
  },
  login: {
    failed: 'Failed to login',
    password: 'Password to get access to the Hyperion settings',
    passwordHint: 'Enter your password',
    token: 'Token',
    tokenHint: 'You need a token, create one at the webconfig or use the wizard below',
    tokWizMsg: 'A token has been requested',
    tokWizMsg2: 'Visit the Hyperion Webconfiguration to accept the following request',
    tokCreaFail: 'Token creation timed out or has been denied',
    tokCreaSucc: 'Token created successfully',
    adminmode: 'Settings mode',
    code: 'Code',
    app: 'App'
  },
  remote: {
    comp: {
      title: 'Component states',
      subtitle: 'Show and control the state of all components and Hyperion itself',
      ALL: 'Hyperion',
      SMOOTHING: 'Smoothing',
      BLACKBORDER: 'Blackborder detector',
      GRABBER: 'Platform capture',
      V4L: 'USB capture',
      LEDDEVICE: 'LED hardware',
      FORWARDER: 'Forwarder',
      BOBLIGHTSERVER: 'Boblight'
    },
    effects: {
      title: 'Effect',
      help: 'Start an effect'
    },
    adjust: {
      subTitle: 'Color adjustments',
      index: 'Color profile',
      indexHelp: 'Choose a color profile',
      gammaRed: 'Gamma red',
      gammaGreen: 'Gamma green',
      gammaBlue: 'Gamma blue',
      brightness: 'Brightness',
      brightnessCompensation: 'Brightness compensation'
    },
    plugins: {
      subTitle: 'Plugins'
    }
  },
  system: {
    logtitle: 'Log',
    logempty: 'No log entries to show',
    logShowMethods: 'Show methods',
    logAutoScroling: 'Auto scrolling',
    logFilterLabel: 'Filter',
    logFilterHelper: 'Filter log for specific entries',
    instCurr: 'Current instance'
  },
  about: {
    intro: 'Remote application for Hyperion, the open source ambient lighting software',
    version: 'Version',
    developer: 'Developer',
    homepage: 'Homepage',
    support: 'Support',
    buildTime: 'Build date',
    build: 'Build',
    official: 'Official build',
    prettyName: 'Name',
    arch: 'System',
    hostName: 'Hostname',
    gitremote: 'Git Remote'
  },
  misc: {
    title: 'Miscellaneous',
    effBlacklist: 'Hidden effects',
    effBlacklistHelp: "Effects in that list won't be shown at the effect selection",
    originName: 'Identifier',
    originNameHelp: 'Will be displayed at the sources overview as indentifier',
    priority: 'Priority',
    priorityHelp: 'Colors and effects will be set with the defined priority'
  },
  label: {
    yes: 'Yes',
    no: 'No'
  },
  capture: {
    small: 'Small',
    normal: 'Normal',
    large: 'Large',
    insane: 'Insane'
  },
  validate: {
    minLength: 'The length should be at least {0}',
    maxLength: 'The length should be maximum {0}',
    mininum: 'The number should be at minimum {0}',
    maximum: 'The number should be at maximum {0}'
  },
  conf: {
    layout: {
      movexaxis: 'Move on X-Axis',
      moveyaxis: 'Move on Y-Axis',
      movexyaxis: 'Move on X/Y-Axis',
      reset: 'Reset Layout',
      order: 'Order LEDs',
      add: 'Add @:led',
      remove: 'Remove @:led | Remove @:leds',
      ledAdded: '@:led added {lednr}',
      ledRemoved: '@:led removed {lednr} | @:leds removed {lednr}',
      ledVisible: '@:led visibility',
      confResetMsg: 'Do you really want to reset this layout? @:norevert',
      removeLedsMsg: 'You can remove multiple @:leds by providing their number. @:base.ledregex',
      ledVisibleMsg: 'For easier editing of single @:leds you might want to limit the visibility just to specific ones based on their number. @:base.ledregex'
    }
  }
}
