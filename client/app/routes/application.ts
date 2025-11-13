import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  macroCondition,
  isDevelopingApp,
  isTesting,
  importSync,
  getOwnConfig,
} from '@embroider/macros';
import localesMeta from '@croodle/client/locales/meta';
import type IntlService from 'ember-intl/services/intl';
import type PowerCalendarService from 'ember-power-calendar/services/power-calendar';
import { type startMirage as _startMirage } from '../mirage';

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
    // Start mirage in development
    if (
      macroCondition(
        isDevelopingApp() && !isTesting() && !getOwnConfig().disableMirage,
      )
    ) {
      const { startMirage } = importSync('@croodle/client/mirage') as {
        startMirage: typeof _startMirage;
      };
      startMirage({ environment: 'development' });
    }

    // Set locale
    const supportedLocales = Object.keys(localesMeta);
    const locale = getLocale(supportedLocales);
    const fallbackLocale = locale.includes('-') ? locale.split('-')[0] : null;

    this.intl.setLocale(fallbackLocale ? [locale, fallbackLocale] : [locale]);
    this.powerCalendar.set('locale', locale);
  }
}
