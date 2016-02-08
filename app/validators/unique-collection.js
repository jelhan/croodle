import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember';

export default BaseValidator.extend({
  validate(value, options) {
    Ember.assert('Property must be defined as validator option', typeof options === 'object' && !Ember.isEmpty(options.property));
    const { property } = options;

    let values = value.map((el) => {
      return Ember.get(el, property);
    });

    if (values.length === values.uniq().length) {
      return true;
    } else {
      return this.createErrorMessage('uniqueCollection', value, options);
    }
  }
});
