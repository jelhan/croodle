import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:iso8601-datetime', 'Unit | Validator | iso8601-datetime', {
  needs: ['validator:messages']
});

test('validation is correct', function(assert) {
  let validator = this.subject();
  assert.ok(
    validator.validate('1945-05-08T23:01+0100'),
    'iso 8601 datetime string with timezone offset is valid'
  );
  assert.ok(
    validator.validate('1945-05-08T23:01Z'),
    'iso 8601 datetime string in UTC is valid'
  );
  assert.ok(
    validator.validate('1945-05-08T23:01:00Z'),
    'iso 8601 datetime string with seconds in UTC is valid'
  );
  assert.ok(
    validator.validate('1945-05-08T23:01:00.000Z'),
    'iso 8601 datetime string with milliseconds in UTC is valid'
  );
  assert.notOk(
    validator.validate('1945-05-08') === true,
    'iso 8601 date string is invalid'
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
});

test('option.active disables validation on false', function(assert) {
  let validator = this.subject();
  assert.notOk(
    validator.validate(null) === true,
    'is validated on default'
  );
  validator.buildOptions({ active: false }, {});
  assert.ok(
    validator.validate(null),
    'validation is disabled on active === false'
  );
});

test('option.active could be a function', function(assert) {
  let validator = this.subject();
  validator.buildOptions({
    active() {
      return false;
    }
  }, {});
  assert.ok(
    validator.validate(null),
    'validation is dislabed if function returns false'
  );
});
