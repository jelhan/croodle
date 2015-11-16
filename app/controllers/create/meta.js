import Ember from "ember";
import {
  validator, buildValidations
}
from 'ember-cp-validations';

var Validations = buildValidations({
  title: [
    validator('presence', true),
    validator('length', {
      min: 2
    })
  ]
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit: function(){
      this.transitionToRoute('create.options');
    }
  },

  title: Ember.computed.alias('model.title')
});
