import {
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';
import validatePhone from 'pruefung-client/validators/phone';

export default {
  email: validateFormat({
    allowBlank: true,
    type: 'email'
  }),
  firstName: validateLength({
    allowNone: false,
    min: 3
  }),
  fieldOfDuties: validateLength({
    allowNone: false,
    min: 3
  }),
  lastName: validateLength({
    allowNone: false,
    min: 3
  }),
  telephone: validatePhone({
    allowBlank: true
  })
};
