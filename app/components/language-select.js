import Ember from 'ember';
import localesMeta from 'croodle/locales/meta';

const { Component, computed, inject } = Ember;

export default Component.extend({
  tagName: 'select',
  classNames: [ 'language-select' ],
  i18n: inject.service(),
  moment: inject.service(),
  current: computed.readOnly('i18n.locale'),

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
    this.get('i18n').set('locale', locale);
  }
});
