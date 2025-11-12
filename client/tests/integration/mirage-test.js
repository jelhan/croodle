import { module, test } from 'qunit';
import { setupTest } from '@croodle/client/tests/helpers';
import { setupMirage } from '../helpers/mirage';
import sjcl from 'sjcl';

module('Integration | Mirage api mocking', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('poll factory | encrypts properties', function (assert) {
    let encryptionKey = 'abc';
    let poll = this.server.create('poll', {
      description: 'bar',
      encryptionKey,
      title: 'foo',
    });
    assert.strictEqual(
      JSON.parse(sjcl.decrypt(encryptionKey, poll.title)),
      'foo',
    );
    assert.strictEqual(
      JSON.parse(sjcl.decrypt(encryptionKey, poll.description)),
      'bar',
    );
  });

  test('user factory | encrypts properties', function (assert) {
    let encryptionKey = 'abc';
    let user = this.server.create('user', {
      encryptionKey,
      name: 'foo',
    });
    assert.strictEqual(
      JSON.parse(sjcl.decrypt(encryptionKey, user.name)),
      'foo',
    );
  });
});
