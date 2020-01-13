import classic from 'ember-classic-decorator';
import BaseValidator from 'ember-cp-validations/validators/base';

@classic
class FalsyValidator extends BaseValidator {
  validate(value, options) {
    return value ? this.createErrorMessage('iso8601', value, options) : true;
  }
}

export default FalsyValidator;
