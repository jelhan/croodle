import Ember from 'ember';
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

var TranslateableObject = Ember.Object.extend({
  i18n: Ember.inject.service(),
  label: Ember.computed('labelTranslation', 'i18n.locale', function() {
    return this.get('i18n').t(this.get('labelTranslation'));
  }),
  labelTranslation: undefined
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit: function() {
      if (this.get('validations.isValid')) {
        this.transitionToRoute('create.meta');
      }
    }
  },

  i18n: Ember.inject.service(),

  pollType: Ember.computed.alias('model.pollType'),

  pollTypes: function(){
    var container = this.get('container');

    return [
      TranslateableObject.create({
        id : "FindADate",
        labelTranslation : "pollTypes.findADate.label",
        container
      }),
      TranslateableObject.create({
        id : "MakeAPoll",
        labelTranslation : "pollTypes.makeAPoll.label",
        container
      })
    ];
  }.property()
});
