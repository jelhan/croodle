import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:time', 'Unit | Validator | time', {
  needs: ['validator:messages']
});

test('HH:mm is treated as valid', function(assert) {
  let validator = this.subject();

  assert.ok(validator.validate('00:00'));
  assert.ok(validator.validate('23:59'));
});

test('24:00 is invalid', function(assert) {
  let validator = this.subject();

  assert.ok(typeof validator.validate('24:00') === 'string');
});

test('00:60 is invalid', function(assert) {
  let validator = this.subject();

  assert.ok(typeof validator.validate('00:60') === 'string');
});

test('an empty string is invalid', function(assert) {
  let validator = this.subject();

  assert.ok(typeof validator.validate('') === 'string');
});

test('null is invalid', function(assert) {
  let validator = this.subject();

  assert.ok(typeof validator.validate(null) === 'string');
});

test('undefined is invalid', function(assert) {
  let validator = this.subject();

  assert.ok(typeof validator.validate(undefined) === 'string');
});

test('a valid time wrapped by spaces is valid', function(assert) {
  let validator = this.subject();

  assert.ok(validator.validate(' 10:00 '));
});
