import { module, test } from 'qunit';
import { setupTest } from 'croodle/tests/helpers';

module('Unit | Controller | poll', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:poll');
    assert.ok(controller);
  });
});
