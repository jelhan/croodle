import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import localesMeta from 'croodle/locales/meta';
import { action } from '@ember/object';

export default class LanguageSelect extends Component {
  @service intl;
  @service powerCalendar;

  get currentLocale() {
    return this.intl.primaryLocale;
  }

  get locales() {
    return localesMeta;
  }

  @action
  handleChange(event) {
    const locale = event.target.value;

    this.intl.locale = locale.includes('-') ? [locale, locale.split('-')[0]] : [locale];
    this.powerCalendar.locale = locale;

    if (window.localStorage) {
      window.localStorage.setItem('locale', locale);
    }
  }
}
