import Alias from 'ember-cp-validations/validators/alias';
import Ember from 'ember';

const { get } = Ember;

const ModelAlias = Alias.extend({
  validate(value, options, model, attribute) {
    const optionsModel = get(options, 'model');
    if (optionsModel) {
      model = get(model, optionsModel);
    }
    return this._super(value, options, model, attribute) || true;
  }
});

export default ModelAlias;
