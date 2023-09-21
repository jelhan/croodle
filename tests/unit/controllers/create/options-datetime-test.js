import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { DateTime } from 'luxon';

module('Unit | Controller | create/options datetime', function(hooks) {
  setupTest(hooks);

  test('normalize options - remove days without time if there is another option with a time for that day', function (assert) {
    const StoreService = this.owner.lookup('service:store');

    const dirtyOption = StoreService.createRecord('option', { title: '2015-01-01' });
    let controller = this.owner.factoryFor('controller:create/options-datetime').create({
      model: {
        options: [
          StoreService.createRecord('option', { title: DateTime.fromISO('2015-01-01T12:00').toISO() }),
          dirtyOption,
          StoreService.createRecord('option', { title: '2017-11-11' }),
          StoreService.createRecord('option', { title: DateTime.fromISO('2018-04-04T11:11').toISO() })
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

    const dateA = DateTime.local().set({ hours: 5 }).toISO();
    const dateB = DateTime.local().set({ hours: 10 }).toISO();
    const dateC = DateTime.local().set({ hours: 22 }).toISO();
    const dateD = DateTime.local().plus({ days: 1 }).toISO();
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
