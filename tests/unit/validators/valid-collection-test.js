import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:valid-collection', 'Unit | Validator | valid-collection', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  let validator = this.subject();
  assert.ok(validator);
});
