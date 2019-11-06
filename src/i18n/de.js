// This is just an example,
// so you can safely delete all default props below

export default {
  norevert: 'Diese Aktion kann nicht rückgängig gemacht werden!',
  led: 'LED',
  leds: 'LEDs',
  locale: {
    'en-us': 'Englisch (US)',
    de: 'Deutsch'
  },
  base: {
    ledregex: 'Beispiel: \'5\' oder \'1-9\' oder \'3,5,7,22\' oder \'4,7,12-16\''
  },
  streamer: {
    select: 'Wähle einen Bildschirm, um den Stream zu starten'
  },
  ui: {
    listLabel: 'Benutzeroberfläche',
    locale_select: 'Sprache',
    locale_select_desc: 'Wähle eine Sprache für die Benutzeroberfläche',
    themeColor: 'Farbe',
    themeColor_desc: 'Wähle ein Farb-Thema',
    startPage: 'Startseite',
    startPage_desc: 'Wähle eine Startseite',
    backToTop: 'Back To Top',
    backToTop_desc: 'Zeige den "Back to Top" Button, wenn das Seitenende erreicht wird',
    darkTheme: 'Nachtmodus',
    darkTheme_desc: 'Aktiviere oder deaktiviere den Nachtmodus'
  },
  colors: {
    hyperion: 'Standard',
    indigo: 'Indigo',
    cyan: 'Türkis',
    teal: 'Blaugrün',
    green: 'Grün',
    lime: 'Limette',
    amber: 'Bernstein',
    orange: 'Orange',
    'deep-orange': 'Dunkel Orange',
    red: 'Rot',
    pink: 'Pink',
    purple: 'Violett',
    'deep-purple': 'Dunkel Violett',
    brown: 'Braun',
    white: 'Weiß',
    blue: 'Blau',
    magenta: 'Magenta',
    yellow: 'Gelb'
  },
  btn: {
    connect: 'Verbinden',
    login: 'Einloggen',
    logout: 'Ausloggen',
    createToken: 'Token erstellen',
    openWui: 'Öffne Webkonfiguration',
    disconnect: 'Verbindung trennen',
    toggleFullscreen: 'Vollbildmodus',
    toggleLeds: 'LEDs',
    toggleImage: 'Image'
  },
  pages: {
    dashboard: 'Dashboard',
    control: 'Steuern',
    settings: 'Einstellungen',
    about: 'Über'
  },
  conn: {
    connected: 'Verbunden',
    notconnected: 'Nicht verbunden',
    disconnected: 'Verbindung unterbrochen',
    connecting: 'Verbinde',
    webserverAdr: 'Hyperion Webserver Adresse',
    failedMsg: 'Hyperion ist nicht erreichbar unter dieser Adresse',
    successMsg: 'Erfolgreich verbunden',
    storedConnections: 'Gespeicherte Verbindungen',
    address: 'Adresse',
    settingsListLabel: 'Verbindung',
    autoConnect: 'Automatische Verbindung',
    autoConnect_desc: 'Verbinde beim Start automatisch zur zuletzt genutzten Hyperion Adresse',
    autoDisconnect: 'Automatische Unterbrechung',
    autoDisconnect_desc: 'Unterbreche vorübergehend die Verbindung zu Hyperion, wenn die App im Hintergrund ist. Verbindet sich automatisch wieder wenn aktiv',
    autoLogin: 'Automatisches Einloggen',
    autoLogin_desc: 'Login wird autoamtisch ausgeführt, wenn benötigt und Daten verfügbar sind',
    ssdpNoResults: 'Es wurde kein Hyperion Server gefunden',
    ssdpError: 'Suchvorgang ist fehlgeschlagen',
    ssdpDialogTitle: 'Gefundene Hyperion Server',
    ssdpDialogText: 'Wähle einen Hyperion Server, mit dem du dich verbinden möchtest',
    invalidMsgAddress: 'Die angegebene Adresse ist nicht gültig',
    spinnerFetchData: 'Synchronisiere Daten mit Server',
    respFailure: 'Server Fehler',
    usehttps: 'Du musst den HTTPS Port verwenden! (Standard: {port})'
  },
  login: {
    failed: 'Einloggen fehlgeschlagen',
    password: 'Passwort',
    passwordHint: 'Passwort um auf die Einstellungen von Hyperion zugreifen zu können',
    token: 'Token',
    tokenHint: 'Du benötigst ein Token, erstelle eines mit der Webkonfiguration oder nutze den Assistenten',
    tokWizMsg: 'Ein Token wurde angefordert',
    tokWizMsg2: 'Öffne die Hyperion Webkonfiguration, um die folgende Anfrage zu erlauben',
    tokCreaFail: 'Erstellung des Tokens fehlgeschlagen: Abgelehnt durch Nutzer oder Zeit abgelaufen',
    tokCreaSucc: 'Token wurde erfolgreich erstellt',
    adminmode: 'Administrationsmodus',
    code: 'Code',
    app: 'App'
  },
  remote: {
    comp: {
      title: 'Komponenten Status',
      subtitle: 'Überprüfe und verändere den Status der Komponenten oder Hyperion',
      ALL: 'Hyperion',
      SMOOTHING: 'Glättung',
      BLACKBORDER: 'Schwarze Balken Erkennung',
      GRABBER: 'Platform Aufnahme',
      V4L: 'USB Aufnahme',
      LEDDEVICE: 'LED Hardware',
      FORWARDER: 'Weiterleitung',
      BOBLIGHTSERVER: 'Boblight'
    },
    effects: {
      title: 'Effekt',
      help: 'Starte einen Effekt'
    },
    adjust: {
      subTitle: 'Farbanpassungen',
      index: 'Farbprofil',
      indexHelp: 'Wähle ein Farbprofil',
      gammaRed: 'Gamma Rot',
      gammaGreen: 'Gamma Grün',
      gammaBlue: 'Gamma Blau',
      brightness: 'Helligkeit',
      brightnessCompensation: 'Helligkeit Kompensation'
    },
    plugins: {
      subTitle: 'Plugins'
    }
  },
  system: {
    logtitle: 'Protokoll',
    logempty: 'Keine Protokoll Einträge',
    logShowMethods: 'Zeige Funktionen',
    logAutoScroling: 'Automatisches scrollen',
    logFilterLabel: 'Filter',
    logFilterHelper: 'Filtere Protokoll nach spezifischen Einträgen',
    instCurr: 'Aktuelle Instanz'
  },
  about: {
    intro: 'Remote Anwendung für Hyperion, die quelloffene software für Ambient Lighting',
    version: 'Version',
    developer: 'Entwickler',
    homepage: 'Internetseite',
    support: 'Support',
    buildTime: 'Build Datum',
    build: 'Build',
    official: 'Offizieller Build',
    prettyName: 'Name',
    arch: 'System',
    hostName: 'Hostname',
    gitremote: 'Git Remote'
  },
  misc: {
    title: 'Allgemein',
    effBlacklist: 'Ausgeblendete Effekte',
    effBlacklistHelp: 'Effekte in dieser Liste werden nicht in der Effektauswahl erscheinen',
    originName: 'Identifikation',
    originNameHelp: 'Wird in der Übersicht der Quellen als Ursprung angegeben',
    priority: 'Priorität',
    priorityHelp: 'Farben und Effekte werden mit der angegebenen Priorität gesetzt'
  },
  label: {
    yes: 'Ja',
    no: 'Nein'
  },
  capture: {
    small: 'Klein',
    normal: 'Normal',
    large: 'Groß',
    insane: 'Verrückt'
  },
  validate: {
    minLength: 'Die Länge sollte mindestens {0} betragen',
    maxLength: 'Die Länge sollte maximal {0} betragen',
    minimum: 'Die Zahl sollte mindestens {0} betragen',
    maximum: 'Die Zahl sollte maximal {0} betragen'
  },
  conf: {
    layout: {
      movexaxis: 'Auf der X-Achse bewegen',
      moveyaxis: 'Auf der Y-Achse bewegen',
      movexyaxis: 'Auf der X/Y-Achse bewegen',
      reset: 'Layout zurücksetzen',
      order: '@:led Reihenfolge',
      add: '@:led hinzufügen',
      remove: '@:led entfernen | @:leds entfernen',
      ledAdded: '@:led hinzugefügt {lednr}',
      ledRemoved: '@:led entfernt {lednr} | @:leds entfernt {lednr}',
      ledVisible: '@:led Sichtbarkeit',
      confResetMsg: 'Möchtest du das Layout wirklich zurücksetzen? @:norevert',
      removeLedsMsg: 'Du kannst mehrere @:leds entfernen mithilfe der @:led Nummer. @:base.ledregex',
      ledVisibleMsg: 'Um das editieren einzelner @:leds zu vereinfachen, kannst du die Sichtbarkeit über die @:led Nummer beeinflussen. @:base.ledregex'
    }
  }
}
