import BaseValidator from 'ember-cp-validations/validators/base';

export default BaseValidator.extend({
  validate(value) {
    var valid = value.every((element) => {
      return element.get('validations.isValid');
    });

    if (valid) {
      return true;
    } else {
      return 'all elements must be valid';
    }
  }
});
