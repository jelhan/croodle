import classic from 'ember-classic-decorator';
import { classNames, tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
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

  @readOnly('intl.primaryLocale')
  current;

  @computed('intl.{locales,primaryLocale}')
  get locales() {
    let currentLocale = this.intl.primaryLocale;

    return Object.keys(localesMeta).map(function(locale) {
      return {
        id: locale,
        selected: locale === currentLocale,
        text: localesMeta[locale]
      };
    });
  }

  change() {
    let locale = this.element.options[this.element.selectedIndex].value;

    this.intl.set('locale', locale.includes('-') ? [locale, locale.split('-')[0]] : [locale]);
    this.powerCalendar.set('locale', locale);

    if (window.localStorage) {
      window.localStorage.setItem('locale', locale);
    }
  }
}
