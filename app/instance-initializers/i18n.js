/* global webshim */

export default {
  name: 'i18n',
  initialize: function({ container }) {
    var i18n = container.lookup('service:i18n'),
        availableLocales = i18n.get('locales'),
        moment = container.lookup('service:moment'),
        locale = getLocale(availableLocales);

    i18n.set('locale', locale);
    moment.changeLocale(locale);
    webshim.activeLang(locale);

    i18n.addObserver('locale', i18n, function() {
      var locale = this.get('locale');
      moment.changeLocale(locale);
      webshim.activeLang(locale);

      // save selected locale in cookie
      document.cookie="language=" + locale + ";" +
                      // give cookie a lifetime of one year
                      "max-age=" + 60*60*24*356 + ";";
    });
  }
};

function getLocale(availableLocales) {
  var methods = [
    getLocaleFromCookie,
    getLocaleByBrowser
  ];
  var locale;

  methods.any((method) => {
    var l = method();
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
  return (window.navigator.userLanguage || window.navigator.language).split("-")[0];
}

function getLocaleFromCookie() {
  var language;

  var cookie = document.cookie.replace(" ", "").split(";");
  cookie.forEach(function(t){
    var x = t.split("=");
    if (x[0] === "language") {
      language = x[1];
    }
  });
  return language;
}
