import BaseValidator from 'ember-cp-validations/validators/base';

const Truthy = BaseValidator.extend({
  validate(value, options) {
    return value ? this.createErrorMessage('iso8601', value, options) : true;
  }
});

export default Truthy;
