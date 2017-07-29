import { test } from 'qunit';
import jQuery from 'jquery';
import moduleForAcceptance from 'croodle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | build info');

test('version is included as html meta tag', function(assert) {
  visit('/');

  andThen(function() {
    // ToDo: figure out why find() helper does not work but jQuery does
    assert.ok(jQuery('head meta[name="build-info"]').length === 1, 'tag exists');
    assert.ok(
      jQuery('head meta[name="build-info"]').attr('content').match(/^version=\d[\d\.]+\d(-(alpha|beta|rc)\d)?(\+[\da-z]{8})?$/) !== null,
      'format '.concat(jQuery('head meta[name="build-info"]').attr('content'), ' is correct')
    );
  });
});
