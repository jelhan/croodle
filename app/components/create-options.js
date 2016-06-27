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
      // it's impossible to delete all text options so this case could be ignored
      // for validation error message
      messageKey: 'create.options.error.notEnoughDates'
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
