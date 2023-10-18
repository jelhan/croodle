import { isPresent, isEmpty } from '@ember/utils';
import localesMeta from 'croodle/locales/meta';

export default {
  name: 'i18n',
  initialize(appInstance) {
    let intl = appInstance.lookup('service:intl');
    let powerCalendar = appInstance.lookup('service:power-calendar');

    let availableLocales = Object.keys(localesMeta);
    let locale = getLocale(availableLocales);

    intl.set(
      'locale',
      locale.includes('-') ? [locale, locale.split('-')[0]] : [locale],
    );
    powerCalendar.set('local', locale);
  },
};

function getLocale(availableLocales) {
  for (const method of [getSavedLocale, getLocaleByBrowser]) {
    const preferredLocales = method();

    if (isEmpty(preferredLocales)) {
      continue;
    }

    const supportedPreferredLocale = preferredLocales.find(
      (preferredLocale) => {
        return availableLocales.indexOf(preferredLocale) !== -1;
      },
    );

    if (isEmpty(supportedPreferredLocale)) {
      continue;
    }

    return supportedPreferredLocale;
  }

  return 'en';
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
