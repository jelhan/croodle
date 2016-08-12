export default {
  name: 'i18n',
  initialize(appInstance) {
    const i18n = appInstance.lookup('service:i18n');
    const availableLocales = i18n.get('locales');
    const moment = appInstance.lookup('service:moment');
    const locale = getLocale(availableLocales);

    i18n.set('locale', locale);
    moment.changeLocale(locale);

    i18n.addObserver('locale', i18n, function() {
      const locale = this.get('locale');
      // give cookie a lifetime of one year
      const maxAge = 60 * 60 * 24 * 356;
      moment.changeLocale(locale);

      // save selected locale in cookie
      document.cookie = `language=${locale};max-age=${maxAge};`;
    });
  }
};

function getLocale(availableLocales) {
  const methods = [
    getLocaleFromCookie,
    getLocaleByBrowser
  ];
  let locale;

  methods.any((method) => {
    let l = method();
    if (l && availableLocales.indexOf(l) !== -1) {
      locale = l;
      return true;
    }
  });

  if (locale) {
    return locale;
  } else {
    return 'en';
  }
}

function getLocaleByBrowser() {
  return (window.navigator.userLanguage || window.navigator.language).split('-')[0];
}

function getLocaleFromCookie() {
  let language;

  const cookie = document.cookie.replace(' ', '').split(';');
  cookie.forEach(function(t) {
    let x = t.split('=');
    if (x[0] === 'language') {
      language = x[1];
    }
  });
  return language;
}
