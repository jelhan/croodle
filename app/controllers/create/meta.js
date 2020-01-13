import { inject as service } from '@ember/service';
import { action } from '@ember/object';
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

export default class CreateMetaController extends Controller.extend(Validations) {
  @service
  i18n;

  @alias('model.description')
  description;

  @alias('model.title')
  title;

  init() {
    super.init(...arguments);

    this.get('i18n.locale');
  }

  @action
  previousPage() {
    this.transitionToRoute('create.index');
  }

  @action
  submit() {
    if (this.get('validations.isValid')) {
      this.transitionToRoute('create.options');
    }
  }
}
