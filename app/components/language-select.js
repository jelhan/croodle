import classic from 'ember-classic-decorator';
import { classNames, tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import localesMeta from 'croodle/locales/meta';

@classic
@tagName('select')
@classNames('language-select')
export default class LanguageSelect extends Component {
  @service
  intl;

  @service
  powerCalendar;

  get currentLocale() {
    return this.intl.primaryLocale;
  }

  get locales() {
    return localesMeta;
  }

  change(event) {
    const locale = event.target.value;

    this.intl.set('locale', locale.includes('-') ? [locale, locale.split('-')[0]] : [locale]);
    this.powerCalendar.set('locale', locale);

    if (window.localStorage) {
      window.localStorage.setItem('locale', locale);
    }
  }
}
