import { module, test } from 'qunit';
import { setupRenderingTest } from 'croodle/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import type IntlService from 'ember-intl/services/intl';

module('Integration | Component | share-poll-url', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Using setupIntl() here causes a strange type error. This is just a
    // workaround until Ember Intl has fixed their types.
    const intlService = this.owner.lookup('service:intl') as IntlService;
    intlService.locale = 'en';
  });

  test('it shows poll url', async function (assert) {
    sinon.stub(this.owner.lookup('service:router'), 'currentURL').value('/foo');

    await render(hbs`<SharePollUrl />`);

    assert.dom('[data-test-poll-url]').containsText('/foo');
  });

  test('user can copy the link to the clipboard', async function (assert) {
    sinon.stub(this.owner.lookup('service:router'), 'currentURL').value('/foo');
    const execCommandFake = sinon.stub(document, 'execCommand');

    await render(hbs`<SharePollUrl />`);
    await click('[data-test-button="copy-link"]');
    assert.ok(execCommandFake.calledOnce);
    assert.deepEqual(execCommandFake.firstCall.args, ['copy']);
  });
});
