import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | build', function(hooks) {
  setupApplicationTest(hooks);

  test('version is included as html meta tag', async function(assert) {
    await visit('/');

    // head is not available through `find()`, `assert.dom()` or `this.element.querySelector()`
    // cause they are scoped to `#ember-testing-container`.
    let buildInfoEl = document.head.querySelector('head meta[name="build-info"]');
    assert.ok(buildInfoEl, 'tag exists');

    let content = buildInfoEl.content;
    assert.ok(
      /^version=\d[\d.]+\d(-(alpha|beta|rc).\d)?(\+[\da-z]{8})?$/.test(content),
      `${content} is valid version string`
    );
  });

  test('CSP meta tag is present and before any dangerous element', async function(assert) {
    await visit('/');

    // `find()`, `assert.dom()` and `this.element.querySelector()` are all scoped to `#testing-container`
    // and therefore don't have access to head
    assert.ok(document.head.querySelector('meta[http-equiv="Content-Security-Policy"]'), 'CSP meta tag exists');

    // this only covers dynamically created elements not the ones defined in `app/index.html` cause
    // that one is replaced by `tests/index.html` for testing.
    ['link', 'script', 'style'].forEach((type) => {
      assert.notOk(
        document.head.querySelector(`${type} meta[http-equiv="Content-Security-Policy"]`),
        'CSP meta tag does not have a silbing of type ${type}'
      );
    });
  });
});
