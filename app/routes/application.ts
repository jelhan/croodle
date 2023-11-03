import Route from '@ember/routing/route';
import { service } from '@ember/service';
import localesMeta from 'croodle/locales/meta';
import type IntlService from 'ember-intl/services/intl';
import type PowerCalendarService from 'ember-power-calendar/services/power-calendar';

type supportedLocales = string[];

function getSavedLocale(supportedLocales: supportedLocales): string | null {
  const { localStorage } = window;

  // test browser support
  if (!localStorage) {
    return null;
  }

  const locale = localStorage.getItem('locale');
  return locale !== null && supportedLocales.includes(locale) ? locale : null;
}

function getPreferredLocale(supportedLocales: supportedLocales): string | null {
  const { languages } = navigator;
  const preferredLocale = languages.find((language) =>
    supportedLocales.includes(language),
  );

  return preferredLocale ?? null;
}

function getLocale(supportedLocales: supportedLocales): string {
  const savedLocale = getSavedLocale(supportedLocales);
  if (savedLocale) {
    return savedLocale;
  }

  const preferredLocale = getPreferredLocale(supportedLocales);
  if (preferredLocale) {
    return preferredLocale;
  }

  // default to english
  return 'en';
}

export default class ApplicationRoute extends Route {
  @service declare intl: IntlService;
  @service declare powerCalendar: PowerCalendarService;

  beforeModel() {
    // Set locale
    const supportedLocales = Object.keys(localesMeta);
    const locale = getLocale(supportedLocales);

    this.intl.set(
      'locale',
      locale.includes('-') ? [locale, locale.split('-')[0]] : [locale],
    );
    this.powerCalendar.set('locale', locale);
  }
}
