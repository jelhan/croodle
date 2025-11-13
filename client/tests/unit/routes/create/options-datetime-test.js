import { module, test } from 'qunit';
import { setupTest } from '@croodle/client/tests/helpers';

module('Unit | Route | create/options datetime', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:create/options-datetime');
    assert.ok(route);
  });
});
