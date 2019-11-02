import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | falsy', function(hooks) {
  setupTest(hooks);

  test('`false` passes validation', function(assert) {
    let validator = this.owner.lookup('validator:falsy');
    assert.ok(validator.validate(false) === true);
  });

  test('`true` fails validation', function(assert) {
    let validator = this.owner.lookup('validator:falsy');
    assert.ok(typeof validator.validate(true) === 'string');
  });
});
