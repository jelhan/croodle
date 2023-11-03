import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { DateTime } from 'luxon';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Helper | format-date-relative', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it formats an ISO date to relative duration from now', async function (assert) {
    this.set('date', DateTime.local().plus({ hours: 6 }));

    await render(hbs`{{format-date-relative this.date}}`);
    assert.dom(this.element).hasText('in 6 hours');

    this.set('date', DateTime.local().plus({ weeks: 1 }));
    assert.dom(this.element).hasText('in 7 days');

    this.set('date', DateTime.local().plus({ weeks: 2 }));
    assert.dom(this.element).hasText('in 14 days');

    this.set('date', DateTime.local().plus({ weeks: 3 }));
    assert.dom(this.element).hasText('in 21 days');

    this.set('date', DateTime.local().plus({ months: 1 }));
    assert.dom(this.element).hasText('in 1 month');

    this.set('date', DateTime.local().plus({ months: 3 }));
    assert.dom(this.element).hasText('in 3 months');

    this.set('date', DateTime.local().plus({ months: 6 }));
    assert.dom(this.element).hasText('in 6 months');

    this.set('date', DateTime.local().plus({ years: 1 }));
    assert.dom(this.element).hasText('in 1 year');
  });

  test('it formats an ISO date to relative duration to now', async function (assert) {
    this.set('date', DateTime.local().minus({ hours: 6 }));

    await render(hbs`{{format-date-relative this.date}}`);
    assert.dom(this.element).hasText('6 hours ago');

    this.set('date', DateTime.local().minus({ weeks: 1 }));
    assert.dom(this.element).hasText('7 days ago');

    this.set('date', DateTime.local().minus({ weeks: 2 }));
    assert.dom(this.element).hasText('14 days ago');

    this.set('date', DateTime.local().minus({ weeks: 3 }));
    assert.dom(this.element).hasText('21 days ago');

    this.set('date', DateTime.local().minus({ months: 1 }));
    assert.dom(this.element).hasText('1 month ago');

    this.set('date', DateTime.local().minus({ months: 3 }));
    assert.dom(this.element).hasText('3 months ago');

    this.set('date', DateTime.local().minus({ months: 6 }));
    assert.dom(this.element).hasText('6 months ago');

    this.set('date', DateTime.local().minus({ years: 1 }));
    assert.dom(this.element).hasText('1 year ago');
  });
});
