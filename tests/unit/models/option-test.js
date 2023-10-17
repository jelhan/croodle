import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { DateTime } from 'luxon';

module('Unit | Model | option', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks, 'en');

  test('day property (get)', function (assert) {
    let option = run(() =>
      this.owner.lookup('service:store').createRecord('option', {
        title: '2015-01-01',
      }),
    );
    assert.equal(
      option.get('day'),
      '2015-01-01',
      'returns ISO 8601 day string if title is ISO 8601 day string',
    );

    run(() => {
      option.set('title', '2015-01-01T11:11:00.000Z');
    });
    assert.equal(
      option.get('day'),
      DateTime.fromISO('2015-01-01T11:11:00.000Z').toISODate(),
      'returns ISO 8601 day string if title is ISO 8601 datetime string',
    );

    run(() => {
      option.set('title', 'abc');
    });
    assert.equal(
      option.get('day'),
      undefined,
      'returns undefined if title is not a valid ISO 8601 string',
    );

    run(() => {
      option.set('title', null);
    });
    assert.equal(
      option.get('day'),
      undefined,
      'returns undefined if title is null',
    );
  });

  test('hasTime property', function (assert) {
    let option = run(() =>
      this.owner.lookup('service:store').createRecord('option', {
        title: '2015-01-01T11:11:00.000Z',
      }),
    );
    assert.ok(option.get('hasTime'));
    run(() => {
      option.set('title', '2015-01-01');
    });
    assert.notOk(option.get('hasTime'));
    run(() => {
      option.set('title', 'foo');
    });
    assert.notOk(option.get('hasTime'));
  });

  test('time property (get)', function (assert) {
    let option = run(() =>
      this.owner.lookup('service:store').createRecord('option', {
        title: '2015-01-01T11:11:00.000Z',
      }),
    );
    assert.equal(
      option.get('time'),
      DateTime.fromISO('2015-01-01T11:11:00.000Z').toFormat('HH:mm'),
      'returns time if title is ISO 8601 datetime string',
    );

    run(() => {
      option.set('title', '2015-01-01');
    });
    assert.equal(
      option.get('time'),
      undefined,
      'returns undefined if title is ISO 8601 day string',
    );

    run(() => {
      option.set('title', 'abc');
    });
    assert.equal(
      option.get('time'),
      undefined,
      'returns undefined if title is not an ISO 8601 date string',
    );
  });

  test('time property (set)', function (assert) {
    let option = run(() =>
      this.owner.lookup('service:store').createRecord('option', {
        title: '2015-01-01',
      }),
    );

    run(() => {
      option.set('time', '11:00');
    });
    assert.equal(
      option.get('title'),
      DateTime.fromISO('2015-01-01T11:00').toISO(),
      'sets title according to time',
    );

    run(() => {
      option.set('time', null);
    });
    assert.equal(
      option.get('title'),
      '2015-01-01',
      'removes time from option if value is false',
    );

    const before = option.get('title');
    run(() => {
      option.set('time', 'abc');
    });
    assert.equal(
      option.get('title'),
      before,
      'does not set title if time is invalid',
    );

    run(() => {
      option.set('title', 'abc');
    });
    assert.throws(() => {
      option.set('time', '11:11');
    }, 'throws if attempt to set a time if title is not a date string');
  });
});
