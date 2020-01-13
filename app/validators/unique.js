import classic from 'ember-classic-decorator';
import { isArray } from '@ember/array';
import { isPresent, isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';
import BaseValidator from 'ember-cp-validations/validators/base';

@classic
export default class UniqueValidator extends BaseValidator {
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

    let parent = model.get(options.parent);
    let collection = parent.get(options.attributeInParent);

    if (options.ignoreNewRecords) {
      // ignore records while saving cause otherwise the record
      // being created itself is considered a duplicate while saving
      collection = collection.filter((_) => !_.isNew);
    }

    let positionInCollection = collection.indexOf(model);
    let elementsBefore = positionInCollection !== -1 ? collection.slice(0, positionInCollection) : collection;
    let matches = elementsBefore.findBy(attribute, value);

    if (matches) {
      return this.createErrorMessage('unique', value, options);
    } else {
      return true;
    }
  }
}
