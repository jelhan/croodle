import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import moment from 'moment';

module('Unit | Controller | poll', function(hooks) {
  setupTest(hooks);

  test('#showExpirationWarning', function(assert) {
    let controller = this.owner.factoryFor('controller:poll').create({
      model: {
        expirationDate: undefined
      }
    });
    assert.notOk(
      controller.get('showExpirationWarning'),
      'is false if expirationDate is undefined'
    );

    controller.set('model.expirationDate', moment().add(1, 'week').toISOString());
    assert.ok(
      controller.get('showExpirationWarning'),
      'is true if expirationDate is less than 2 weeks in future'
    );

    controller.set('model.expirationDate', moment().add(1, 'month').toISOString());
    assert.notOk(
      controller.get('showExpirationWarning'),
      'is false if expirationDate is more than 2 weeks in future'
    );
  });
});
