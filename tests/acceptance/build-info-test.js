import { test } from 'qunit';
import moduleForAcceptance from 'croodle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | build info');

test('version is included as html meta tag', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok($('head meta[name="build-info"]'), 'tag exists');
    assert.ok($('head meta[name="build-info"]').match(/^version=v\d[\d\.]+\d(\+[\da-z]{7})?$/) !== null, 'format is correct');
  });
});
