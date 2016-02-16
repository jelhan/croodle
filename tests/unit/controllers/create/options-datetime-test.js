import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('controller:create/options-datetime', 'Unit | Controller | create/options datetime', {
});

test('normalize options', function(assert) {
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
