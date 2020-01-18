import classic from 'ember-classic-decorator';
import BaseValidator from 'ember-cp-validations/validators/base';

@classic
export default class ValidCollectionValidator extends BaseValidator {
  validate(value, options) {
    if (options.active === false) {
      return true;
    }

    const valid = value.every((element) => {
      return element.get('validations.isValid');
    });

    if (valid) {
      return true;
    } else {
      return this.createErrorMessage('validCollection', options, value);
    }
  }
}
