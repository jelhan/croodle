import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | time', function(hooks) {
  setupTest(hooks);

  test('HH:mm is treated as valid', function(assert) {
    let validator = this.owner.lookup('validator:time');

    assert.equal(validator.validate('00:00'), true);
    assert.equal(validator.validate('23:59'), true);
  });

  test('24:00 is invalid', function(assert) {
    let validator = this.owner.lookup('validator:time');

    assert.ok(typeof validator.validate('24:00') === 'string');
  });

  test('00:60 is invalid', function(assert) {
    let validator = this.owner.lookup('validator:time');

    assert.ok(typeof validator.validate('00:60') === 'string');
  });

  test('an empty string is invalid', function(assert) {
    let validator = this.owner.lookup('validator:time');

    assert.ok(typeof validator.validate('') === 'string');
  });

  test('null is invalid', function(assert) {
    let validator = this.owner.lookup('validator:time');

    assert.ok(typeof validator.validate(null) === 'string');
  });

  test('undefined is invalid', function(assert) {
    let validator = this.owner.lookup('validator:time');

    assert.ok(typeof validator.validate(undefined) === 'string');
  });

  test('a valid time wrapped by spaces is valid', function(assert) {
    let validator = this.owner.lookup('validator:time');

    assert.equal(validator.validate(' 10:00 '), true);
  });
});
