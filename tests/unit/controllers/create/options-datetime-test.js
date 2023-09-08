import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import moment from 'moment';

module('Unit | Controller | create/options datetime', function(hooks) {
  setupTest(hooks);

  test('normalize options - remove days without time if there is another option with a time for that day', function (assert) {
    const StoreService = this.owner.lookup('service:store');

    const dirtyOption = StoreService.createRecord('option', { title: '2015-01-01' });
    let controller = this.owner.factoryFor('controller:create/options-datetime').create({
      model: {
        options: [
          StoreService.createRecord('option', { title: moment('2015-01-01T12:00').toISOString() }),
          dirtyOption,
          StoreService.createRecord('option', { title: '2017-11-11' }),
          StoreService.createRecord('option', { title: moment('2018-04-04T11:11').toISOString() })
        ]
      }
    });
    controller.normalizeOptions();
    assert.equal(
      controller.get('options.length'),
      3,
      'one option is removed'
    );
    assert.ok(
      controller.get('options').indexOf(dirtyOption) === -1,
      'correct option is removed'
    );
  });

  test('normalize options - sort them', function (assert) {
    const StoreService = this.owner.lookup('service:store');

    const dateA = moment().hour(5).toISOString();
    const dateB = moment().hour(10).toISOString();
    const dateC = moment().hour(22).toISOString();
    const dateD = moment().add(1, 'day').toISOString();
    let controller = this.owner.factoryFor('controller:create/options-datetime').create({
      model: {
        options: [
          StoreService.createRecord('option', { title: dateB }),
          StoreService.createRecord('option', { title: dateA }),
          StoreService.createRecord('option', { title: dateC }),
          StoreService.createRecord('option', { title: dateD })
        ]
      }
    });
    run(() => {
      controller.normalizeOptions();
    });
    assert.deepEqual(
      controller.get('options').map((option) => option.get('title')),
      [dateA, dateB, dateC, dateD],
      'options are sorted'
    );
  });
});
