import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import localesMeta from 'croodle/locales/meta';
import { action } from '@ember/object';
import type IntlService from 'ember-intl/services/intl';
import type PowerCalendarService from 'ember-power-calendar/services/power-calendar';

export default class LanguageSelect extends Component {
  @service declare intl: IntlService;
  @service declare powerCalendar: PowerCalendarService;

  get currentLocale() {
    return this.intl.primaryLocale;
  }

  locales = localesMeta;

  @action
  handleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const locale = selectElement.value as keyof typeof this.locales;
    const fallbackLocale = locale.includes('-') ? locale.split('-')[0] : null;

    this.intl.setLocale(fallbackLocale ? [locale, fallbackLocale] : [locale]);
    this.powerCalendar.locale = locale;

    if (window.localStorage) {
      window.localStorage.setItem('locale', locale);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LanguageSelect: typeof LanguageSelect;
  }
}
