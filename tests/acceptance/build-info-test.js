import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | build info', function(hooks) {
  setupApplicationTest(hooks);

  test('version is included as html meta tag', async function(assert) {
    await visit('/');

    // head is not available through `find()`, `assert.dom()` or `this.element.querySelector()`
    // cause they are scoped to `#ember-testing-container`.
    let buildInfoEl = document.head.querySelector('head meta[name="build-info"]');
    assert.ok(buildInfoEl, 'tag exists');

    let content = buildInfoEl.content;
    assert.ok(
      /^version=\d[\d.]+\d(-(alpha|beta|rc)\d)?(\+[\da-z]{8})?$/.test(content),
      `${content} is valid version string`
    );
  });
});
