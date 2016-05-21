import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

let Validations = buildValidations({
  options: [
    validator('collection', true),
    validator('length', {
      dependentKeys: ['options.[]', 'i18n.locale'],
      min: 1,
      message() {
        const i18n = this.model.get('i18n');
        const isFindADate = this.model.get('isFindADate');
        const translationKey = isFindADate ? 'create.options.error.notEnoughDates' : 'create.options.error.notEnoughOptions';
        const message = i18n.t(translationKey);
        return message.toString();
      }
    }),
    validator('valid-collection', {
      dependentKeys: ['options.[]', 'options.@each.title']
    })
  ]
});

export default Ember.Component.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        this.sendAction('nextPage');
      } else {
        this.set('shouldShowErrors', true);
      }
    }
  },
  // consumed by validator
  i18n: Ember.inject.service(),
  shouldShowErrors: false
});
