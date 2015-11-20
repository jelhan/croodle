import moment from "moment";

export default {
  name: 'i18n',
  initialize: function({ container }) {
    var i18n = container.lookup('service:i18n'),
        availableLocales = i18n.get('locales'),
        locale = getLocale(availableLocales);

    i18n.set('locale', locale);
    moment.locale( locale );
  }
};

function getLocale(availableLocales) {
  var methods = [
    getLocaleByBrowser,
    getLocaleFromCookie
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
