import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { DateTime } from 'luxon';

module('Unit | Controller | poll', function (hooks) {
  setupTest(hooks);

  test('#showExpirationWarning', function (assert) {
    let controller = this.owner.factoryFor('controller:poll').create({
      model: {
        expirationDate: undefined,
      },
    });
    assert.notOk(
      controller.get('showExpirationWarning'),
      'is false if expirationDate is undefined'
    );

    controller.set(
      'model.expirationDate',
      DateTime.local().plus({ weeks: 1 }).toISO()
    );
    assert.ok(
      controller.get('showExpirationWarning'),
      'is true if expirationDate is less than 2 weeks in future'
    );

    controller.set(
      'model.expirationDate',
      DateTime.local().plus({ months: 1 }).toISO()
    );
    assert.notOk(
      controller.get('showExpirationWarning'),
      'is false if expirationDate is more than 2 weeks in future'
    );
  });
});
