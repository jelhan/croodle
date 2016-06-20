import Ember from 'ember';
import localesMeta from 'croodle/locales/meta';

export default Ember.Component.extend({
  tagName: 'select',
  classNames: [ 'language-select' ],
  i18n: Ember.inject.service(),
  moment: Ember.inject.service(),
  current: Ember.computed.readOnly('i18n.locale'),

  locales: Ember.computed('i18n.locales', function() {
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
