import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import localesMeta from 'croodle/locales/meta';

export default Component.extend({
  tagName: 'select',
  classNames: [ 'language-select' ],

  i18n: service(),
  moment: service(),
  powerCalendar: service(),

  current: readOnly('i18n.locale'),

  locales: computed('i18n.locales', function() {
    let currentLocale = this.get('i18n.locale');

    return this.get('i18n.locales').map(function(locale) {
      return {
        id: locale,
        selected: locale === currentLocale,
        text: localesMeta[locale]
      };
    });
  }),

  change() {
    let locale = this.$().val();

    this.i18n.set('locale', locale);
    this.moment.changeLocale(locale);
    this.powerCalendar.set('locale', locale);

    if (window.localStorage) {
      window.localStorage.setItem('locale', locale);
    }
  }
});
