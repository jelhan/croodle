import { inject as service } from '@ember/service';
import Component from '@ember/component';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

let Validations = buildValidations({
  options: [
    validator('collection', true),
    validator('length', {
      dependentKeys: ['model.options.[]', 'model.i18n.locale'],
      min: 1,
      // it's impossible to delete all text options so this case could be ignored
      // for validation error message
      messageKey: 'create.options.error.notEnoughDates'
    }),
    validator('valid-collection', {
      dependentKeys: ['model.options.[]', 'model.options.@each.title']
    })
  ]
});

export default Component.extend(Validations, {
  actions: {
    previousPage() {
      this.onPrevPage();
    },
    submit() {
      if (this.get('validations.isValid')) {
        this.onNextPage();
      } else {
        this.set('shouldShowErrors', true);
      }
    }
  },
  // consumed by validator
  i18n: service(),
  shouldShowErrors: false
});
