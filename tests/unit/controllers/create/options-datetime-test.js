import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { moduleFor, test } from 'ember-qunit';
import moment from 'moment';

moduleFor('controller:create/options-datetime', 'Unit | Controller | create/options datetime', {
});

test('normalize options - remove days without time if there is another option with a time for that day', function(assert) {
  const dirtyOption = EmberObject.create({ title: '2015-01-01' });
  let controller = this.subject({
    model: {
      options: [
        EmberObject.create({ title: '2015-01-01T12:00:00.000Z' }),
        dirtyOption,
        EmberObject.create({ title: '2017-11-11' }),
        EmberObject.create({ title: '2018-04-04T11:11:00.000Z' })
      ]
    }
  });
  run(() => {
    controller.normalizeOptions();
  });
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

test('normalize options - sort them', function(assert) {
  const dateA = moment().hour(5).toISOString();
  const dateB = moment().hour(10).toISOString();
  const dateC = moment().hour(22).toISOString();
  const dateD = moment().add(1, 'day').toISOString();
  let controller = this.subject({
    model: {
      options: [
        EmberObject.create({ title: dateB }),
        EmberObject.create({ title: dateA }),
        EmberObject.create({ title: dateC }),
        EmberObject.create({ title: dateD })
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
