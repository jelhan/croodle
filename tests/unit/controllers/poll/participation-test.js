import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:poll/participation', 'Unit | Controller | poll/participation', {
  needs: [
    'config:environment',
    'controller:poll',
    'service:encryption', 'service:i18n',
    'validator:collection', 'validator:presence', 'validator:unique'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
