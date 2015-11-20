import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'select',
  classNames: [ 'language-select' ],
  i18n: Ember.inject.service(),
  current: Ember.computed.readOnly('i18n.locale'),

  locales: Ember.computed('i18n.locales', function() {
    return this.get('i18n.locales').map(function (locale) {
      return { id: locale, text: locale };
    });
  }),

  change() {
    this.get('i18n').set('locale', this.$().val());
  }
});
