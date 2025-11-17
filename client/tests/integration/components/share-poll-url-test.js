import { module, test } from 'qunit';
import { setupRenderingTest } from '@croodle/client/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';

module('Integration | Component | share-poll-url', function (hooks) {
  setupRenderingTest(hooks);

  test('it shows poll url', async function (assert) {
    sinon.stub(this.owner.lookup('service:router'), 'currentURL').value('/foo');

    await render(hbs`<SharePollUrl />`);

    assert.dom('[data-test-poll-url]').containsText('/foo');
  });

  test('user can copy the link to the clipboard', async function (assert) {
    sinon.stub(this.owner.lookup('service:router'), 'currentURL').value('/foo');
    sinon.mock(window.location);
    const clipboardWriteTextMock = sinon
      .mock(navigator.clipboard)
      .expects('writeText');

    await render(hbs`<SharePollUrl />`);
    await click('[data-test-button="copy-link"]');
    assert.ok(clipboardWriteTextMock.calledOnce);
    assert.deepEqual(clipboardWriteTextMock.firstCall.args, [
      `${document.location.href}#/foo`,
    ]);
  });
});
