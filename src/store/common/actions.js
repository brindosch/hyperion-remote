export const setLocale = (context, {lang, app}) => {
  // to lower
  lang = lang.toLowerCase()

  // it might be required to shorten the locale
  if (!context.rootGetters['temp/getSupportedLocales'].includes(lang)) {
    let extrLang = null
    if (lang.indexOf('_') > -1) { extrLang = lang.split('_')[0] } else if (lang.indexOf('-') > -1) { extrLang = lang.split('-')[0] } else if (lang.length > 2) { extrLang = lang.slice(0, 2) }

    if (extrLang != null) {
      console.log('The requested locale: ' + lang + ' is not supported. Will try:', extrLang)
      lang = extrLang
    }
  }

  // hack it to en-us, as we don't have an ’en’ entry
  if (lang === 'en') {
    console.warn('Locale ’en’ is not supported, set to ’en-us’')
    lang = 'en-us'
  }

  // do loading if the locale exists
  if (context.rootGetters['temp/getSupportedLocales'].includes(lang)) {
    if (app.$i18n.locale !== lang) {
      // check if lang has been loaded
      if (Object.keys(app.$i18n.getLocaleMessage(lang)).length === 0) {
        import(`src/i18n/${lang}`).then(msgs => {
          app.$i18n.setLocaleMessage(lang, msgs.default)
          app.$i18n.locale = lang

          console.log('Loaded translations for locale:', lang)
        })
        // axios.defaults.headers.common['Accept-Language'] = lang
        // document.documentElement.setAttribute('lang', lang)
      } else {
        app.$i18n.locale = lang
      }
      // quasar has always just one translation in place, so replace it
      import(`quasar/lang/${lang}`).then(msgs => {
        app.$q.lang.set(msgs.default)
      }).catch(error => {
          console.warn("Quasar doesn't support locale: " + lang + ' (' + error + ') .It remains on locale:', app.$i18n.locale)
      })
    }
    // apply locale
    app.$store.commit('common/setInternalLocale', lang)
  } else {
    console.warn(`Locale "${lang}" is not supported`)
  }
}
