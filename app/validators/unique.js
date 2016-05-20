import BaseValidator from 'ember-cp-validations/validators/base';
import Ember from 'ember';

export default BaseValidator.extend({
  validate(value, options, model, attribute) {
    Ember.assert(
      'options.parent is required',
      Ember.isPresent(options.parent)
    );
    Ember.assert(
      'options.attributeInParent is required',
      Ember.isPresent(options.attributeInParent)
    );
    Ember.assert(
      'options.dependentKeys is required',
      Ember.isArray(options.dependentKeys) && options.dependentKeys.length > 0
    );

    // ignore empty values
    if (Ember.isEmpty(value)) {
      return true;
    }

    const parent = model.get(options.parent);
    const collection = parent.get(options.attributeInParent);
    const positionInCollection = collection.indexOf(model);
    const elementsBefore = collection.slice(0, positionInCollection);
    const matches = elementsBefore.findBy(attribute, value);

    if (matches) {
      // ToDo: translateable error message
      return this.createErrorMessage('unique');
    } else {
      return true;
    }
  }
});
