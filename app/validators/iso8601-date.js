import BaseValidator from 'ember-cp-validations/validators/base';
import moment from 'moment';

export default BaseValidator.extend({
  validate(value, options) {
    let valid;

    if (typeof options !== 'object') {
      options = {};
    }

    if (options.active === false) {
      return true;
    }

    options.value = value;

    valid = moment(value, 'YYYY-MM-DD', true).isValid();

    if (valid) {
      return true;
    } else {
      return this.createErrorMessage('iso8601-date', value, options);
    }
  }
});
