import BaseBsFormElement from 'ember-bootstrap/components/bs-form/element';
import { inject as service } from '@ember/service';

export default class BsFormElement extends BaseBsFormElement {
  '__ember-bootstrap_subclass' = true;

  @service intl;

  get errors() {
    const { model, property } = this.args;
    const validation = model[`${property}Validation`];

    if (validation === undefined || validation === null) {
      return [];
    }

    return [this.intl.t(validation.key, validation.options)];
  }

  get hasValidator() {
    return true;
  }
}
