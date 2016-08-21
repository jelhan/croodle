import Ember from 'ember';

const { getOwner } = Ember;

export default {
  name: 'i18n',
  initialize(appInstance) {
    const i18n = appInstance.lookup('service:i18n');
    const availableLocales = i18n.get('locales');

    i18n.addObserver('locale', i18n, localeChanged);
    i18n.set('locale', getLocale(availableLocales));
  }
};

function getLocale(availableLocales) {
  const methods = [
    getSavedLocale,
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

function getSavedLocale() {
  let { localStorage } = window;

  // test browser support
  if (!localStorage) {
    return;
  }

  return localStorage.getItem('locale');
}

function saveLocale(locale) {
  let { localStorage } = window;

  // test browser support
  if (!localStorage) {
    return;
  }

  localStorage.setItem('locale', locale);
}

function localeChanged() {
  let locale = this.get('locale');
  getOwner(this).lookup('service:moment').changeLocale(locale);
  saveLocale(locale);
}
