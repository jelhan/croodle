import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:iso8601-date', 'Unit | Validator | iso8601-date', {
  needs: ['validator:messages']
});

test('validation is correct', function(assert) {
  let validator = this.subject();
  assert.equal(
    validator.validate('1945-05-08'),
    true,
    'iso 8601 date string is valid'
  );
  assert.notOk(
    validator.validate('1945-05-08T23:01+0100') === true,
    'iso 8601 datetime string is invalid'
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
