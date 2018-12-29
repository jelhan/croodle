import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | valid-collection', function(hooks) {
  setupTest(hooks);

  test('it works', function(assert) {
    let validator = this.owner.lookup('validator:valid-collection');
    assert.ok(validator);
  });
});
