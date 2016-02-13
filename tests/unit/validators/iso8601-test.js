import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:iso8601', 'Unit | Validator | iso8601', {
  needs: ['validator:messages']
});

test('default validation is correct', function(assert) {
  let validator = this.subject();
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
  let validator = this.subject();
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
  let validator = this.subject();
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

test('valid iso8601 string formats could be defined by options.validFormats', function(assert) {
  let validator = this.subject();
  const buildOptions = validator.buildOptions({
    validFormats: [
      'YYYY-MM-DD',
      'YYYY-MM-DDTHH:mmZ',
      'YYYY-MM-DDTHH:mm:ssZ'
    ]
  }, {});
  assert.notOk(
    validator.validate('1945-05-08') === true,
    'iso 8601 date string is invalid by default'
  );
  assert.equal(
    validator.validate('1945-05-08', buildOptions),
    true,
    'iso 8601 date string is valid if it\'s in validFormats options'
  );
  assert.notOk(
    validator.validate('1945-05-08T23:01Z') === true,
    'iso 8601 datetime string in UTC is invalid by default'
  );
  assert.equal(
    validator.validate('1945-05-08T23:01Z', buildOptions),
    true,
    'iso 8601 datetime string in UTC is valid if it\'s in validFormats options'
  );
  assert.notOk(
    validator.validate('1945-05-08T23:01:00Z') === true,
    true,
    'iso 8601 datetime string with seconds in UTC is invalid by default'
  );
  assert.equal(
    validator.validate('1945-05-08T23:01:00Z', buildOptions),
    true,
    'iso 8601 datetime string with seconds in UTC is valid if it\'s in validFormats options'
  );
});
