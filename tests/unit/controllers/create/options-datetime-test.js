import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';

moduleFor('controller:create/options-datetime', 'Unit | Controller | create/options datetime', {
});

test('normalize options - remove days without time if there is another option with a time for that day', function(assert) {
  const dirtyOption = Ember.Object.create({ title: '2015-01-01' });
  let controller = this.subject({
    model: {
      options: [
        Ember.Object.create({ title: '2015-01-01T12:00:00.000Z' }),
        dirtyOption,
        Ember.Object.create({ title: '2017-11-11' }),
        Ember.Object.create({ title: '2018-04-04T11:11:00.000Z' })
      ]
    }
  });
  Ember.run(() => {
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
        Ember.Object.create({ title: dateB }),
        Ember.Object.create({ title: dateA }),
        Ember.Object.create({ title: dateC }),
        Ember.Object.create({ title: dateD })
      ]
    }
  });
  Ember.run(() => {
    controller.normalizeOptions();
  });
  assert.deepEqual(
    controller.get('options').map((option) => option.get('title')),
    [dateA, dateB, dateC, dateD],
    'options are sorted'
  );
});
