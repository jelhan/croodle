import { isArray } from '@ember/array';
import { isPresent, isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';
import BaseValidator from 'ember-cp-validations/validators/base';

export default BaseValidator.extend({
  validate(value, options, model, attribute) {
    assert(
      'options.parent is required',
      isPresent(options.parent)
    );
    assert(
      'options.attributeInParent is required',
      isPresent(options.attributeInParent)
    );
    assert(
      'options.dependentKeys is required',
      isArray(options.dependentKeys) && options.dependentKeys.length > 0
    );

    if (options.disable) {
      return true;
    }

    // ignore empty values
    if (isEmpty(value)) {
      return true;
    }

    const parent = model.get(options.parent);
    const collection = parent.get(options.attributeInParent);
    const positionInCollection = collection.indexOf(model);
    const elementsBefore = positionInCollection !== -1 ? collection.slice(0, positionInCollection) : collection;
    const matches = elementsBefore.findBy(attribute, value);

    if (matches) {
      return this.createErrorMessage('unique', value, options);
    } else {
      return true;
    }
  }
});
