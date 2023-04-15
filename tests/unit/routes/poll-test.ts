import { module, test } from 'qunit';
import { setupTest } from 'croodle/tests/helpers';

module('Unit | Route | poll', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:poll');
    assert.ok(route);
  });
});
