import Ember from "ember";
import {
  validator, buildValidations
}
from 'ember-cp-validations';

var Validations = buildValidations({
  pollType: [
    validator('presence', true),
    validator('inclusion', {
      in: ['FindADate', 'MakeAPoll']
    })
  ]
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit: function() {
      this.transitionToRoute('create.meta');
    }
  },

  pollType: Ember.computed.alias('model.pollType'),

  pollTypes: function(){
    return [
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id : "FindADate",
        labelTranslation : "pollTypes.findADate.label"
      }),
      Ember.Object.extend(Ember.I18n.TranslateableProperties, {}).create({
        id : "MakeAPoll",
        labelTranslation : "pollTypes.makeAPoll.label"
      })
    ];
  }.property()
});
