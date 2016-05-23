import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  pollType: [
    validator('presence', {
      presence: true,
      dependentKeys: ['i18n.locale']
    }),
    validator('inclusion', {
      in: ['FindADate', 'MakeAPoll'],
      dependentKeys: ['i18n.locale']
    })
  ]
});

const TranslateableObject = Ember.Object.extend({
  i18n: Ember.inject.service(),
  label: Ember.computed('labelTranslation', 'i18n.locale', function() {
    return this.get('i18n').t(this.get('labelTranslation'));
  }),
  labelTranslation: undefined
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        this.transitionToRoute('create.meta');
      }
    }
  },

  i18n: Ember.inject.service(),

  init() {
    this.get('i18n.locale');
  },

  pollType: Ember.computed.alias('model.pollType'),

  pollTypes: Ember.computed('', function() {
    const container = this.get('container');

    return [
      TranslateableObject.create({
        id: 'FindADate',
        labelTranslation: 'pollTypes.findADate.label',
        container
      }),
      TranslateableObject.create({
        id: 'MakeAPoll',
        labelTranslation: 'pollTypes.makeAPoll.label',
        container
      })
    ];
  })
});
