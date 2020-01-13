import classic from 'ember-classic-decorator';
import BaseMessages from 'ember-i18n-cp-validations/validators/messages';

@classic
export default class ValidationMessages extends BaseMessages {
  validCollection = 'This collection is not valid.';
  time = '{{value}} is not a vaild time.';
}
