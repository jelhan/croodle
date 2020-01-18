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
  i18n;

  @service
  moment;

  @service
  powerCalendar;

  @readOnly('i18n.locale')
  current;

  @computed('i18n.locales')
  get locales() {
    let currentLocale = this.get('i18n.locale');

    return this.get('i18n.locales').map(function(locale) {
      return {
        id: locale,
        selected: locale === currentLocale,
        text: localesMeta[locale]
      };
    });
  }

  change() {
    let locale = this.element.options[this.element.selectedIndex].value;

    this.i18n.set('locale', locale);
    this.moment.changeLocale(locale);
    this.powerCalendar.set('locale', locale);

    if (window.localStorage) {
      window.localStorage.setItem('locale', locale);
    }
  }
}
