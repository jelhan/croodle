import { getOwner } from '@ember/application';
import { isPresent, isEmpty } from '@ember/utils';

export default {
  name: 'i18n',
  initialize(appInstance) {
    let i18n = appInstance.lookup('service:i18n');
    let availableLocales = i18n.get('locales');

    i18n.addObserver('locale', i18n, localeChanged);
    i18n.set('locale', getLocale(availableLocales));
  }
};

function getLocale(availableLocales) {
  let methods = [
    getSavedLocale,
    getLocaleByBrowser
  ];
  let locale;

  methods.any((method) => {
    let preferredLocales = method();
    let match;

    if (isEmpty(preferredLocales)) {
      return false;
    }

    match = preferredLocales.find((preferredLocale) => {
      return availableLocales.indexOf(preferredLocale) !== -1;
    });

    if (isEmpty(match)) {
      return false;
    }

    locale = match;
    return true;
  });

  if (locale) {
    return locale;
  } else {
    return 'en';
  }
}

function getLocaleByBrowser() {
  let languages;
  let { navigator } = window;
  let primaryLanguage;

  if (isPresent(navigator.languages)) {
    // Prefer experimental NavigatorLanguage.languages property if available.
    // NavigatorLanguage.languages returns an array of language codes ordered by preference.
    // Need to clone returned array cause otherwise Safari 10.1 throws an
    // "Attempted to assign to readonly property" error.
    languages = navigator.languages.slice(0);
  } else if (isPresent(navigator.language)) {
    // navigator.language should be available in most browsers
    // but only returns most prefered language
    languages = [navigator.language];
  } else if (isPresent(navigator.browserLanguage)) {
    // work-a-round for Internet Explorer
    // navigator.browserLanguage returns current operating system language
    languages = [navigator.browserLanguage];
  } else {
    return;
  }

  if (languages.length === 1) {
    // add primary language if the only available one is a combined language code
    primaryLanguage = languages[0].split('-')[0];
    if (primaryLanguage !== languages[0]) {
      languages.push(primaryLanguage);
    }
  }

  // normalize all language codes to lower case
  languages = languages.map((language) => {
    return language.toLowerCase();
  });

  return languages;
}

function getSavedLocale() {
  let { localStorage } = window;
  let locale;

  // test browser support
  if (!localStorage) {
    return;
  }

  locale = localStorage.getItem('locale');

  if (isEmpty(locale)) {
    return;
  }

  return [locale];
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
