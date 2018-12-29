import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import jQuery from 'jquery';

module('Acceptance | build info', function(hooks) {
  setupApplicationTest(hooks);

  test('version is included as html meta tag', async function(assert) {
    await visit('/');

    // ToDo: figure out why find() helper does not work but jQuery does
    assert.ok(jQuery('head meta[name="build-info"]').length === 1, 'tag exists');
    assert.ok(
      jQuery('head meta[name="build-info"]').attr('content').match(/^version=\d[\d.]+\d(-(alpha|beta|rc)\d)?(\+[\da-z]{8})?$/) !== null,
      'format '.concat(jQuery('head meta[name="build-info"]').attr('content'), ' is correct')
    );
  });
});
