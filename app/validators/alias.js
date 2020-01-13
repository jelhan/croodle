import classic from 'ember-classic-decorator';
import Alias from 'ember-cp-validations/validators/alias';

@classic
export default class AliasValidator extends Alias {
  validate(value, options, model, attribute) {
    return super.validate(value, options, model, attribute) || true;
  }
}
