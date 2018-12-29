import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  title: [
    validator('presence', {
      presence: true,
      dependentKeys: ['model.i18n.locale']
    }),
    validator('length', {
      min: 2,
      dependentKeys: ['model.i18n.locale']
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

  description: alias('model.description'),

  init() {
    this._super(...arguments);

    this.get('i18n.locale');
  },

  i18n: service(),

  title: alias('model.title')
});
