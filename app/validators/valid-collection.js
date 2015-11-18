import BaseValidator from 'ember-cp-validations/validators/base';

export default BaseValidator.extend({
  validate(value, options, model, attribute) {
    return model.get(attribute).every((element) => {
      return element.get('validations.isValid');
    });
  }
});
