import Alias from 'ember-cp-validations/validators/alias';

export default Alias.extend({
  validate(value, options, model, attribute) {
    return this._super(value, options, model, attribute) || true;
  }
});
