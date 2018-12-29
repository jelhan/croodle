import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | unique', function(hooks) {
  setupTest(hooks);

  test('throws if required option is missing', function(assert) {
    const validator = this.owner.lookup('validator:unique');
    assert.throws(
      function() {
        validator.validate(null, {
          parent: 'foo',
          dependentKeys: ['foo']
        });
      },
      'throws if attributeInParrent is not defined'
    );
    assert.throws(
      function() {
        validator.validate(null, {
          attributeInParent: 'foo',
          dependentKeys: ['foo']
        });
      },
      'throws if parent is not defined'
    );
    assert.throws(
      function() {
        validator.validate(null, {
          parent: 'foo',
          attributeInParent: 'foo'
        });
      },
      'throws if dependentKeys is not defined'
    );
  });

  test('validation', function(assert) {
    const validator = this.owner.lookup('validator:unique');
    const parent = EmberObject.create({
      collection: A([])
    });
    const childObject = EmberObject.extend({
      parent
    });
    const options = {
      parent: 'parent',
      attributeInParent: 'collection',
      dependentKeys: ['parent.collection.@each.value']
    };
    const child1 = childObject.create({ value: 'foo' });
    const child2 = childObject.create({ value: 'bar' });
    const child3 = childObject.create({ value: 'foo' });

    parent.get('collection').push(child1);
    assert.ok(
      validator.validate(
        child1.get('value'),
        options,
        child1,
        'value'
      ) === true,
      'valid for only one element'
    );

    parent.get('collection').push(child2);
    assert.ok(
      validator.validate(
        child2.get('value'),
        options,
        child2,
        'value'
      ) === true,
      'still valid after pushing another element with different value'
    );

    parent.get('collection').push(child3);
    assert.ok(
      typeof validator.validate(
        child3.get('value'),
        options,
        child3,
        'value'
      ) === 'string',
      'invalid after pushing element with same value'
    );
  });
});
