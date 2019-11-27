/*
 App language management
   To add a new lang
   1. Get lang isoName from Quasar: https://github.com/quasarframework/quasar/tree/dev/ui/lang
   1.1 If Quasar does not have the lang, please contribute first to Quasar the translation (5min)
   2. add it to the appLanguages array
   3. add own translation file (filename = isoName) in /lang
   4. add isoName to BOTH webpackInclude magic comments
*/

import languages from 'quasar/lang/index.json'
const appLanguages = languages.filter(lang =>
  ['de', 'en-us'].includes(lang.isoName)
)

export default {
  name: 'lang',
  data () {
    return {
    }
  },
  methods: {
    setAppLang (lang) {
      // if unknown we try to parse it
      if (lang === undefined) { lang = this.__parseBrowserLang() }

      // import and apply
      this.__importAndSetLang(lang)
    },
    getAppLanguages () {
      return appLanguages
    },
    getBrowserLang () {
      return this.$q.lang.getLocale()
    },
    __importAndSetLang (lang) {
      // dynamic import, so loading on demand only
      try {
        import(
          /* webpackInclude: /(de|en-us)\.js$/ */
          `quasar/lang/${lang}`
        ).then(lang => {
          this.$q.lang.set(lang.default)
        })
      } catch (error) {
        console.error('Failed to load Quasar lang:' + lang, error)
        this.$q.notify({ message: 'Failed to load Quasar lang:' + lang, color: 'negative' })
      }
      // repeat for our own translations
      try {
        if (this.$i18n.locale !== lang) {
          // check if lang has been loaded
          if (Object.keys(this.$i18n.getLocaleMessage(lang)).length === 0) {
            import(
              /* webpackInclude: /(de|en-us)\.json$/ */
              `src/lang/${lang}`
            ).then(msgs => {
              this.$i18n.setLocaleMessage(lang, msgs.default)
              this.$i18n.locale = lang
            })
          } else {
            this.$i18n.locale = lang
          }
        }
        // commit
        this.$store.commit('common/setLang', lang)
      } catch (error) {
        console.error('Failed to load App lang:' + lang, error)
        this.$q.notify({ message: 'Failed to load App lang:' + lang, color: 'negative' })
      }
    },
    __parseBrowserLang () {
      let lang = this.getBrowserLang().toLowerCase()

      if (!this.__isLangSupported(lang)) {
        // try to parse
        for (const del of ['-', '_']) {
          const langs = lang.split(del)
          if (this.__isLangSupported(langs[0])) {
            lang = langs[0]
            break
          }
        }
      }
      // fallback to en-us if required
      if (!this.__isLangSupported(lang)) { lang = 'en-us' }
      return lang
    },
    __isLangSupported (lang) {
      return appLanguages.map(el => (el.isoName)).includes(lang)
    }
  }
}
