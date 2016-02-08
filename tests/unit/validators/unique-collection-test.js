import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('validator:unique-collection', 'Unit | Validator | unique-collection', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  let validator = this.subject();
  const buildOptions = validator.buildOptions({ property: 'foo' }, {});
  assert.ok(validator);
  assert.equal(
    validator.validate([
      { foo: 'bar' },
      { foo: 'baz' }
    ], buildOptions),
    true
  );
  assert.equal(
    typeof validator.validate([
      { foo: 'bar' },
      { foo: 'bar' }
    ], buildOptions),
    'string'
  );
  assert.equal(
    validator.validate([
      Ember.Object.create({ foo: 'bar' }),
      Ember.Object.create({ foo: 'baz' })
    ], buildOptions),
    true
  );
  assert.equal(
    typeof validator.validate([
      Ember.Object.create({ foo: 'bar' }),
      Ember.Object.create({ foo: 'bar' })
    ], buildOptions),
    'string'
  );
});
