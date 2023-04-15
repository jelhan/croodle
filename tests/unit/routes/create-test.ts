import { module, test } from 'qunit';
import { setupTest } from 'croodle/tests/helpers';

module('Unit | Route | create', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:create');
    assert.ok(route);
  });
});
