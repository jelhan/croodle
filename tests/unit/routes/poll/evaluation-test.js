import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | poll/evaluation', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:poll/evaluation');
    assert.ok(route);
  });
});
