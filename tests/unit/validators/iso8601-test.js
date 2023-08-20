import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | iso8601', function(hooks) {
  setupTest(hooks);

  test('default validation is correct', function(assert) {
    let validator = this.owner.lookup('validator:iso8601');
    assert.equal(
      validator.validate('1945-05-08T23:01:00.000Z'),
      true,
      'iso 8601 datetime string with milliseconds in UTC is valid by default'
    );
    assert.notOk(
      validator.validate(null) === true,
      'null is invalid'
    );
    assert.notOk(
      validator.validate(undefined) === true,
      'undefined is invalid'
    );
    assert.notOk(
      validator.validate('') === true,
      'empty string is invalid'
    );
    assert.notOk(
      validator.validate('abc123') === true,
      'random string is invalid'
    );
  });

  test('option.active disables validation on false', function(assert) {
    let validator = this.owner.lookup('validator:iso8601');
    const buildOptions = validator.buildOptions({ active: false }, {});
    assert.notOk(
      validator.validate(null) === true,
      'is validated on default'
    );
    assert.equal(
      validator.validate(null, buildOptions),
      true,
      'validation is disabled on active === false'
    );
  });

  test('option.active could be a function', function(assert) {
    let validator = this.owner.lookup('validator:iso8601');
    const buildOptions = validator.buildOptions({
      active() {
        return false;
      }
    }, {});
    assert.equal(
      validator.validate(null, buildOptions),
      true,
      'validation is dislabed if function returns false'
    );
  });

  test('other iso8601 strings', function(assert) {
    let validator = this.owner.lookup('validator:iso8601');
    assert.strictEqual(
      validator.validate('1945-05-08'),
      true,
      'iso 8601 date string is valid'
    );
    assert.strictEqual(
      validator.validate('1945-05-08T23:01Z'),
      true,
      'iso 8601 datetime string in UTC is valid'
    );
    assert.strictEqual(
      validator.validate('1945-05-08T23:01:00Z'),
      true,
      'iso 8601 datetime string with seconds in UTC is valid'
    );
  });
});
