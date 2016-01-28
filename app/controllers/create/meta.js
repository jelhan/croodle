import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  title: [
    validator('presence', true),
    validator('length', {
      min: 2
    })
  ]
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        this.transitionToRoute('create.options');
      }
    }
  },

  title: Ember.computed.alias('model.title')
});
