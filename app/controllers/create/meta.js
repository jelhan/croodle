import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const { computed, Controller, inject } = Ember;

const Validations = buildValidations({
  title: [
    validator('presence', {
      presence: true,
      dependentKeys: ['i18n.locale']
    }),
    validator('length', {
      min: 2,
      dependentKeys: ['i18n.locale']
    })
  ]
});

export default Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        this.transitionToRoute('create.options');
      }
    }
  },

  description: computed.alias('model.description'),

  init() {
    this.get('i18n.locale');
  },

  i18n: inject.service(),

  title: computed.alias('model.title')
});
